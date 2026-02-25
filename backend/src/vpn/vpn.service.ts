import {
  BadGatewayException,
  ConflictException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { randomBytes, randomUUID } from 'crypto';
import { request as httpsRequest } from 'https';
import { request as httpRequest } from 'http';
import type { IncomingHttpHeaders, RequestOptions } from 'http';

const TRIAL_DURATION_DAYS = 3;
const BYTES_IN_GB = 1024 ** 3;

type XuiApiResponse<T> = {
  success: boolean;
  msg: string;
  obj: T;
};

type XuiInbound = {
  id: number;
  protocol: string;
  port: number;
  listen: string;
  settings: string;
  streamSettings: string;
};

type XuiInboundSettingsClient = {
  id: string;
  email: string;
  enable?: boolean;
  flow?: string;
  expiryTime?: number;
  subId?: string;
  totalGB?: number;
  limitIp?: number;
  reset?: number;
};

type XuiInboundSettings = {
  clients: XuiInboundSettingsClient[];
};

type XuiStreamSettings = {
  network?: string;
  security?: string;
  tcpSettings?: {
    header?: {
      type?: string;
    };
  };
  wsSettings?: {
    path?: string;
    headers?: {
      Host?: string;
      host?: string;
    };
  };
  grpcSettings?: {
    serviceName?: string;
    authority?: string;
    multiMode?: boolean;
  };
  realitySettings?: {
    settings?: {
      publicKey?: string;
      fingerprint?: string;
      serverName?: string;
      spiderX?: string;
    };
    shortIds?: string[];
  };
  tlsSettings?: {
    serverName?: string;
    alpn?: string[];
  };
};

type XuiClientTraffic = {
  email: string;
  uuid?: string;
  enable?: boolean;
  up: number;
  down: number;
  allTime: number;
  expiryTime: number;
  total: number;
  lastOnline: number;
};

type XuiRequestResult = {
  statusCode: number;
  headers: IncomingHttpHeaders;
  body: string;
};

export type VpnStatus = 'none' | 'active' | 'expired' | 'disabled';

export type VpnOverviewResponse = {
  hasKey: boolean;
  vpnKey: string | null;
  traffic: {
    upBytes: number;
    downBytes: number;
    totalBytes: number;
    limitBytes: number | null;
    usedPercent: number | null;
    usedGb: number;
  };
  connection: {
    isOnline: boolean;
    lastOnlineAt: string | null;
  };
  access: {
    status: VpnStatus;
    hasAccess: boolean;
    expiresAt: string | null;
    daysLeft: number | null;
  };
  trial: {
    canClaim: boolean;
    claimedAt: string | null;
    durationDays: number;
  };
};

export type VpnTrialResponse = {
  message: string;
  created: boolean;
  data: VpnOverviewResponse;
};

@Injectable()
export class VpnService {
  private sessionCookie: string | null = null;
  private sessionExpiresAt = 0;

  private readonly xuiBaseUrl = process.env.XUI_BASE_URL || '';
  private readonly xuiUsername = process.env.XUI_USERNAME || '';
  private readonly xuiPassword = process.env.XUI_PASSWORD || '';
  private readonly xuiInboundId = Number(process.env.XUI_INBOUND_ID || '1');
  private readonly allowInsecureTls =
    process.env.XUI_ALLOW_INSECURE_TLS === 'true';
  private readonly onlineWindowMs =
    Number(process.env.XUI_ONLINE_WINDOW_SECONDS || '300') * 1000;

  constructor(private readonly prisma: PrismaService) {}

  async getOverviewByUserId(userId: number): Promise<VpnOverviewResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        vpnTrialClaimedAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    const inbound = await this.getInbound();
    const inboundSettings = this.parseInboundSettings(inbound.settings);
    const streamSettings = this.parseStreamSettings(inbound.streamSettings);

    const client = this.findClientByEmail(inboundSettings.clients, user.email);
    const canClaim = user.vpnTrialClaimedAt === null;

    if (!client) {
      return this.buildEmptyOverview(canClaim, user.vpnTrialClaimedAt);
    }

    const traffic = await this.getClientTraffics(user.email);
    const onlines = await this.getOnlineEmails();

    return this.buildOverviewWithClient({
      email: user.email,
      canClaim,
      claimedAt: user.vpnTrialClaimedAt,
      inbound,
      client,
      streamSettings,
      traffic,
      onlines,
    });
  }

  async claimTrialByUserId(userId: number): Promise<VpnTrialResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        vpnTrialClaimedAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    if (user.vpnTrialClaimedAt) {
      throw new ConflictException('Пробный ключ уже был выдан');
    }

    const inbound = await this.getInbound();
    const inboundSettings = this.parseInboundSettings(inbound.settings);
    const existingClient = this.findClientByEmail(
      inboundSettings.clients,
      user.email,
    );

    let created = false;
    if (!existingClient) {
      await this.addClient({
        id: randomUUID(),
        email: user.email,
        enable: true,
        flow: '',
        expiryTime: Date.now() + TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000,
        totalGB: 0,
        limitIp: 0,
        tgId: '',
        subId: this.generateSubId(),
        reset: 0,
      });
      created = true;
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        vpnTrialClaimedAt: new Date(),
      },
    });

    const data = await this.getOverviewByUserId(user.id);

    return {
      message: created
        ? 'Пробный ключ успешно создан на 3 дня'
        : 'VPN ключ уже существует, trial помечен как использованный',
      created,
      data,
    };
  }

  private buildEmptyOverview(
    canClaim: boolean,
    claimedAt: Date | null,
  ): VpnOverviewResponse {
    return {
      hasKey: false,
      vpnKey: null,
      traffic: {
        upBytes: 0,
        downBytes: 0,
        totalBytes: 0,
        limitBytes: null,
        usedPercent: null,
        usedGb: 0,
      },
      connection: {
        isOnline: false,
        lastOnlineAt: null,
      },
      access: {
        status: 'none',
        hasAccess: false,
        expiresAt: null,
        daysLeft: 0,
      },
      trial: {
        canClaim,
        claimedAt: claimedAt?.toISOString() || null,
        durationDays: TRIAL_DURATION_DAYS,
      },
    };
  }

  private buildOverviewWithClient(params: {
    email: string;
    canClaim: boolean;
    claimedAt: Date | null;
    inbound: XuiInbound;
    client: XuiInboundSettingsClient;
    streamSettings: XuiStreamSettings;
    traffic: XuiClientTraffic | null;
    onlines: string[];
  }): VpnOverviewResponse {
    const { email, canClaim, claimedAt, inbound, client, streamSettings } =
      params;
    const traffic = params.traffic;
    const expiryTime = this.resolveExpiryTime(client, traffic);
    const enable = this.resolveEnable(client, traffic);
    const lastOnline = traffic?.lastOnline || 0;
    const isOnline = this.resolveOnline(email, params.onlines, lastOnline);

    const trafficUp = traffic?.up || 0;
    const trafficDown = traffic?.down || 0;
    const trafficTotal = traffic?.allTime || trafficUp + trafficDown;
    const trafficLimit =
      typeof traffic?.total === 'number' && traffic.total > 0
        ? traffic.total
        : null;
    const usedPercent = trafficLimit
      ? Math.min(100, Math.round((trafficTotal / trafficLimit) * 100))
      : null;
    const access = this.resolveAccess(enable, expiryTime);

    return {
      hasKey: true,
      vpnKey: this.buildVlessKey({
        inbound,
        streamSettings,
        uuid: traffic?.uuid || client.id,
        email,
        flow: client.flow || '',
      }),
      traffic: {
        upBytes: trafficUp,
        downBytes: trafficDown,
        totalBytes: trafficTotal,
        limitBytes: trafficLimit,
        usedPercent,
        usedGb: Number((trafficTotal / BYTES_IN_GB).toFixed(2)),
      },
      connection: {
        isOnline,
        lastOnlineAt:
          lastOnline > 0 ? new Date(lastOnline).toISOString() : null,
      },
      access,
      trial: {
        canClaim,
        claimedAt: claimedAt?.toISOString() || null,
        durationDays: TRIAL_DURATION_DAYS,
      },
    };
  }

  private resolveEnable(
    client: XuiInboundSettingsClient,
    traffic: XuiClientTraffic | null,
  ): boolean {
    if (typeof client.enable === 'boolean') {
      return client.enable;
    }
    if (typeof traffic?.enable === 'boolean') {
      return traffic.enable;
    }
    return true;
  }

  private resolveExpiryTime(
    client: XuiInboundSettingsClient,
    traffic: XuiClientTraffic | null,
  ): number {
    if (typeof client.expiryTime === 'number') {
      return client.expiryTime;
    }
    if (typeof traffic?.expiryTime === 'number') {
      return traffic.expiryTime;
    }
    return 0;
  }

  private resolveOnline(
    email: string,
    onlineEmails: string[],
    lastOnline: number,
  ): boolean {
    const emailLower = email.toLowerCase();
    const onlineByList = onlineEmails.some(
      (onlineEmail) => onlineEmail.toLowerCase() === emailLower,
    );
    const onlineByLastSeen =
      lastOnline > 0 && Date.now() - lastOnline <= this.onlineWindowMs;

    return onlineByList || onlineByLastSeen;
  }

  private resolveAccess(
    enable: boolean,
    expiryTime: number,
  ): {
    status: VpnStatus;
    hasAccess: boolean;
    expiresAt: string | null;
    daysLeft: number | null;
  } {
    if (!enable) {
      return {
        status: 'disabled',
        hasAccess: false,
        expiresAt: expiryTime > 0 ? new Date(expiryTime).toISOString() : null,
        daysLeft: 0,
      };
    }

    if (expiryTime <= 0) {
      return {
        status: 'active',
        hasAccess: true,
        expiresAt: null,
        daysLeft: null,
      };
    }

    const now = Date.now();
    if (expiryTime <= now) {
      return {
        status: 'expired',
        hasAccess: false,
        expiresAt: new Date(expiryTime).toISOString(),
        daysLeft: 0,
      };
    }

    const daysLeft = Math.ceil((expiryTime - now) / (24 * 60 * 60 * 1000));
    return {
      status: 'active',
      hasAccess: true,
      expiresAt: new Date(expiryTime).toISOString(),
      daysLeft,
    };
  }

  private buildVlessKey(params: {
    inbound: XuiInbound;
    streamSettings: XuiStreamSettings;
    uuid: string;
    email: string;
    flow: string;
  }): string {
    const { inbound, streamSettings, uuid, email, flow } = params;
    const address = this.resolveAddress(inbound.listen);
    const port = inbound.port;
    const type = streamSettings.network || 'tcp';
    const security = streamSettings.security || 'none';
    const query = new URLSearchParams();

    query.set('type', type);
    query.set('security', security);
    query.set('encryption', 'none');

    if (flow) {
      query.set('flow', flow);
    }

    if (security === 'tls') {
      const serverName = streamSettings.tlsSettings?.serverName;
      if (serverName) {
        query.set('sni', serverName);
      }
      const alpn = streamSettings.tlsSettings?.alpn;
      if (alpn && alpn.length > 0) {
        query.set('alpn', alpn.join(','));
      }
    }

    if (security === 'reality') {
      const reality = streamSettings.realitySettings;
      const publicKey = reality?.settings?.publicKey;
      const fingerprint = reality?.settings?.fingerprint;
      const serverName = reality?.settings?.serverName;
      const spiderX = reality?.settings?.spiderX;
      const shortId = reality?.shortIds?.[0];

      if (publicKey) {
        query.set('pbk', publicKey);
      }
      if (fingerprint) {
        query.set('fp', fingerprint);
      }
      if (serverName) {
        query.set('sni', serverName);
      }
      if (spiderX) {
        query.set('spx', spiderX);
      }
      if (shortId) {
        query.set('sid', shortId);
      }
    }

    if (type === 'ws') {
      const wsPath = streamSettings.wsSettings?.path || '/';
      query.set('path', wsPath);

      const wsHost =
        streamSettings.wsSettings?.headers?.Host ||
        streamSettings.wsSettings?.headers?.host;
      if (wsHost) {
        query.set('host', wsHost);
      }
    }

    if (type === 'grpc') {
      const serviceName = streamSettings.grpcSettings?.serviceName;
      if (serviceName) {
        query.set('serviceName', serviceName);
      }

      const mode = streamSettings.grpcSettings?.multiMode ? 'multi' : 'gun';
      query.set('mode', mode);

      const authority = streamSettings.grpcSettings?.authority;
      if (authority) {
        query.set('authority', authority);
      }
    }

    if (type === 'tcp') {
      const headerType = streamSettings.tcpSettings?.header?.type;
      if (headerType && headerType !== 'none') {
        query.set('headerType', headerType);
      }
    }

    return `vless://${uuid}@${address}:${port}?${query.toString()}#${encodeURIComponent(email)}`;
  }

  private resolveAddress(listen: string): string {
    if (listen && listen !== '0.0.0.0' && listen !== '::') {
      return listen;
    }

    const baseUrl = this.getXuiBaseUrl();
    return baseUrl.hostname;
  }

  private parseInboundSettings(settingsRaw: string): XuiInboundSettings {
    if (!settingsRaw) {
      return { clients: [] };
    }

    try {
      const parsed = JSON.parse(settingsRaw) as Partial<XuiInboundSettings>;
      const clients = Array.isArray(parsed.clients) ? parsed.clients : [];
      return { clients };
    } catch {
      throw new BadGatewayException(
        'Не удалось распарсить settings inbound из 3x-ui',
      );
    }
  }

  private parseStreamSettings(settingsRaw: string): XuiStreamSettings {
    if (!settingsRaw) {
      return {};
    }

    try {
      return JSON.parse(settingsRaw) as XuiStreamSettings;
    } catch {
      throw new BadGatewayException(
        'Не удалось распарсить streamSettings inbound из 3x-ui',
      );
    }
  }

  private findClientByEmail(
    clients: XuiInboundSettingsClient[],
    email: string,
  ): XuiInboundSettingsClient | null {
    const target = email.toLowerCase();
    const client = clients.find(
      (currentClient) => currentClient.email.toLowerCase() === target,
    );
    return client || null;
  }

  private generateSubId(length = 16): string {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const bytes = randomBytes(length);
    return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join(
      '',
    );
  }

  private async getInbound(): Promise<XuiInbound> {
    const response = await this.xuiRequest<XuiInbound>(
      `panel/api/inbounds/get/${this.getInboundId()}`,
      'GET',
    );
    return response.obj;
  }

  private async getClientTraffics(
    email: string,
  ): Promise<XuiClientTraffic | null> {
    const encodedEmail = encodeURIComponent(email);
    const response = await this.xuiRequest<XuiClientTraffic | null>(
      `panel/api/inbounds/getClientTraffics/${encodedEmail}`,
      'GET',
      undefined,
      true,
    );

    if (!response.success || !response.obj) {
      return null;
    }

    return response.obj;
  }

  private async getOnlineEmails(): Promise<string[]> {
    const response = await this.xuiRequest<string[]>(
      'panel/api/inbounds/onlines',
      'POST',
      {},
      true,
    );

    if (!response.success || !Array.isArray(response.obj)) {
      return [];
    }

    return response.obj;
  }

  private async addClient(client: {
    id: string;
    email: string;
    enable: boolean;
    flow: string;
    expiryTime: number;
    totalGB: number;
    limitIp: number;
    tgId: string;
    subId: string;
    reset: number;
  }): Promise<void> {
    await this.xuiRequest<null>('panel/api/inbounds/addClient', 'POST', {
      id: this.getInboundId(),
      settings: JSON.stringify({
        clients: [client],
      }),
    });
  }

  private async xuiRequest<T>(
    path: string,
    method: 'GET' | 'POST',
    body?: unknown,
    allowFailure = false,
  ): Promise<XuiApiResponse<T>> {
    const cookie = await this.getSessionCookie();
    const response = await this.rawRequest(path, method, body, cookie);

    if (response.statusCode === 401) {
      this.clearSession();
      const refreshedCookie = await this.getSessionCookie();
      const retryResponse = await this.rawRequest(
        path,
        method,
        body,
        refreshedCookie,
      );
      return this.parseXuiResponse<T>(retryResponse.body, allowFailure);
    }

    return this.parseXuiResponse<T>(response.body, allowFailure);
  }

  private parseXuiResponse<T>(
    rawBody: string,
    allowFailure: boolean,
  ): XuiApiResponse<T> {
    let parsed: XuiApiResponse<T>;
    try {
      parsed = JSON.parse(rawBody) as XuiApiResponse<T>;
    } catch {
      throw new BadGatewayException('Некорректный ответ от 3x-ui API');
    }

    if (!parsed.success && !allowFailure) {
      throw new BadGatewayException(parsed.msg || 'Ошибка запроса к 3x-ui API');
    }

    return parsed;
  }

  private async getSessionCookie(): Promise<string> {
    if (this.sessionCookie && Date.now() < this.sessionExpiresAt) {
      return this.sessionCookie;
    }

    const username = this.xuiUsername;
    const password = this.xuiPassword;

    if (!username || !password) {
      throw new ServiceUnavailableException(
        'Не настроены переменные XUI_USERNAME/XUI_PASSWORD',
      );
    }

    const loginResponse = await this.rawRequest('login', 'POST', {
      username,
      password,
    });

    const parsed = this.parseXuiResponse<null>(loginResponse.body, false);
    if (!parsed.success) {
      throw new ServiceUnavailableException(
        parsed.msg || 'Не удалось авторизоваться в 3x-ui',
      );
    }

    const cookieHeader = loginResponse.headers['set-cookie'];
    const { cookie, maxAgeSeconds } = this.extractSessionCookie(cookieHeader);

    this.sessionCookie = cookie;
    this.sessionExpiresAt =
      Date.now() + Math.max(60, maxAgeSeconds) * 1000 - 5_000;

    return cookie;
  }

  private clearSession(): void {
    this.sessionCookie = null;
    this.sessionExpiresAt = 0;
  }

  private extractSessionCookie(cookieHeader: string[] | string | undefined): {
    cookie: string;
    maxAgeSeconds: number;
  } {
    const cookieEntries = Array.isArray(cookieHeader)
      ? cookieHeader
      : cookieHeader
        ? [cookieHeader]
        : [];

    const sessionCookie = cookieEntries.find((entry) =>
      entry.startsWith('3x-ui='),
    );
    if (!sessionCookie) {
      throw new ServiceUnavailableException(
        '3x-ui не вернул сессионный cookie при авторизации',
      );
    }

    const cookie = sessionCookie.split(';')[0];
    const maxAgeMatch = sessionCookie.match(/Max-Age=(\d+)/i);
    const maxAgeSeconds = maxAgeMatch ? Number(maxAgeMatch[1]) : 600;

    return { cookie, maxAgeSeconds };
  }

  private rawRequest(
    path: string,
    method: 'GET' | 'POST',
    body?: unknown,
    cookie?: string,
  ): Promise<XuiRequestResult> {
    const baseUrl = this.getXuiBaseUrl();
    const url = new URL(path.replace(/^\/+/, ''), baseUrl);
    const payload = body === undefined ? undefined : JSON.stringify(body);
    const headers: Record<string, string> = {
      Accept: 'application/json, text/plain, */*',
    };

    if (payload) {
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = String(Buffer.byteLength(payload));
    }
    if (cookie) {
      headers.Cookie = cookie;
    }

    const options: RequestOptions = {
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port ? Number(url.port) : undefined,
      method,
      path: `${url.pathname}${url.search}`,
      headers,
      timeout: 15_000,
    };

    if (url.protocol === 'https:') {
      (
        options as RequestOptions & {
          rejectUnauthorized?: boolean;
        }
      ).rejectUnauthorized = !this.allowInsecureTls;
    }

    const requester = url.protocol === 'https:' ? httpsRequest : httpRequest;

    return new Promise<XuiRequestResult>((resolve, reject) => {
      const req = requester(options, (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (chunk: Buffer) => chunks.push(chunk));
        res.on('end', () => {
          const responseBody = Buffer.concat(chunks).toString('utf-8');
          resolve({
            statusCode: res.statusCode || 0,
            headers: res.headers,
            body: responseBody,
          });
        });
      });

      req.on('timeout', () => {
        req.destroy(new Error('3x-ui API request timeout'));
      });
      req.on('error', () => {
        reject(
          new ServiceUnavailableException(
            'Не удалось подключиться к 3x-ui API',
          ),
        );
      });

      if (payload) {
        req.write(payload);
      }
      req.end();
    });
  }

  private getXuiBaseUrl(): URL {
    if (!this.xuiBaseUrl) {
      throw new ServiceUnavailableException(
        'Не настроена переменная XUI_BASE_URL',
      );
    }

    const normalizedBaseUrl = this.xuiBaseUrl.endsWith('/')
      ? this.xuiBaseUrl
      : `${this.xuiBaseUrl}/`;

    try {
      return new URL(normalizedBaseUrl);
    } catch {
      throw new ServiceUnavailableException(
        'Некорректное значение XUI_BASE_URL',
      );
    }
  }

  private getInboundId(): number {
    if (!Number.isInteger(this.xuiInboundId) || this.xuiInboundId <= 0) {
      throw new ServiceUnavailableException(
        'Некорректная переменная XUI_INBOUND_ID',
      );
    }
    return this.xuiInboundId;
  }
}
