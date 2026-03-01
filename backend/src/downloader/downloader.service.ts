import {
  BadGatewayException,
  Injectable,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
import { mkdir, rm, writeFile } from 'fs/promises';
import { extname, join } from 'path';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';
import { createReadStream } from 'fs';

type StoredDownload = {
  token: string;
  filePath: string;
  fileName: string;
  mimeType: string;
  expiresAt: number;
  timer: NodeJS.Timeout;
};

export type RequestedDownload = {
  downloadUrl: string;
  fileName: string;
  expiresAt: string;
};

export type DownloadFileResult = {
  fileName: string;
  mimeType: string;
  stream: ReturnType<typeof createReadStream>;
};

@Injectable()
export class DownloaderService implements OnModuleInit, OnModuleDestroy {
  private readonly mediaRollerBaseUrl =
    process.env.MEDIA_ROLLER_BASE_URL || 'http://82.202.156.136:8085/';
  private readonly storageDir = join(tmpdir(), 'alwib-downloader');
  private readonly ttlMs =
    Number(process.env.DOWNLOADER_FILE_TTL_SECONDS || '120') * 1000;

  private readonly downloads = new Map<string, StoredDownload>();

  async onModuleInit(): Promise<void> {
    await mkdir(this.storageDir, { recursive: true });
  }

  async onModuleDestroy(): Promise<void> {
    const files = Array.from(this.downloads.values());
    this.downloads.clear();

    await Promise.all(
      files.map(async (file) => {
        clearTimeout(file.timer);
        await this.safeDeleteFile(file.filePath);
      }),
    );
  }

  async requestDownload(sourceUrl: string): Promise<RequestedDownload> {
    const endpoint = this.buildMediaRollerUrl(sourceUrl);
    const response = await fetch(endpoint.toString());

    if (!response.ok) {
      throw new BadGatewayException('Media Roller вернул ошибку');
    }

    const contentType =
      response.headers.get('content-type') || 'application/octet-stream';

    if (contentType.includes('application/json')) {
      throw new BadGatewayException('Media Roller не вернул медиафайл');
    }

    const bodyArrayBuffer = await response.arrayBuffer();
    const bodyBuffer = Buffer.from(bodyArrayBuffer);
    if (bodyBuffer.length === 0) {
      throw new BadGatewayException('Media Roller вернул пустой файл');
    }

    const contentDisposition = response.headers.get('content-disposition');
    const fileName = this.resolveFileName(contentDisposition, contentType);
    const token = randomUUID();
    const filePath = join(this.storageDir, `${token}-${fileName}`);
    const expiresAt = Date.now() + Math.max(this.ttlMs, 10_000);

    await writeFile(filePath, bodyBuffer);
    const timer = setTimeout(() => {
      void this.deleteByToken(token);
    }, expiresAt - Date.now());

    this.downloads.set(token, {
      token,
      filePath,
      fileName,
      mimeType: contentType,
      expiresAt,
      timer,
    });

    return {
      downloadUrl: `/downloader/file/${token}`,
      fileName,
      expiresAt: new Date(expiresAt).toISOString(),
    };
  }

  getDownloadFile(token: string): DownloadFileResult {
    const stored = this.downloads.get(token);
    if (!stored) {
      throw new NotFoundException(
        'Ссылка для скачивания не найдена или истекла',
      );
    }

    if (stored.expiresAt <= Date.now()) {
      void this.deleteByToken(token);
      throw new NotFoundException('Ссылка для скачивания истекла');
    }

    return {
      fileName: stored.fileName,
      mimeType: stored.mimeType,
      stream: createReadStream(stored.filePath),
    };
  }

  private async deleteByToken(token: string): Promise<void> {
    const stored = this.downloads.get(token);
    if (!stored) {
      return;
    }

    this.downloads.delete(token);
    clearTimeout(stored.timer);
    await this.safeDeleteFile(stored.filePath);
  }

  private async safeDeleteFile(path: string): Promise<void> {
    try {
      await rm(path, { force: true });
    } catch {
      return;
    }
  }

  private buildMediaRollerUrl(sourceUrl: string): URL {
    if (!this.mediaRollerBaseUrl) {
      throw new ServiceUnavailableException(
        'Не настроена переменная MEDIA_ROLLER_BASE_URL',
      );
    }

    let base: URL;
    try {
      const normalized = this.mediaRollerBaseUrl.endsWith('/')
        ? this.mediaRollerBaseUrl
        : `${this.mediaRollerBaseUrl}/`;
      base = new URL(normalized);
    } catch {
      throw new ServiceUnavailableException(
        'Некорректная переменная MEDIA_ROLLER_BASE_URL',
      );
    }

    const endpoint = new URL('api/download', base);
    endpoint.searchParams.set('url', sourceUrl);
    return endpoint;
  }

  private resolveFileName(
    contentDisposition: string | null,
    contentType: string,
  ): string {
    const fromDisposition =
      this.fileNameFromContentDisposition(contentDisposition);
    if (fromDisposition) {
      return fromDisposition;
    }

    const extension = this.extensionByContentType(contentType);
    return `content-${Date.now()}${extension}`;
  }

  private fileNameFromContentDisposition(header: string | null): string | null {
    if (!header) {
      return null;
    }

    const utf8Match = header.match(/filename\*=UTF-8''([^;]+)/i);
    if (utf8Match?.[1]) {
      return this.sanitizeFileName(decodeURIComponent(utf8Match[1]));
    }

    const basicMatch = header.match(/filename="?([^";]+)"?/i);
    if (basicMatch?.[1]) {
      return this.sanitizeFileName(basicMatch[1]);
    }

    return null;
  }

  private sanitizeFileName(fileName: string): string {
    const cleaned = fileName
      .replace(/[/\\?%*:|"<>]/g, '-')
      .trim()
      .replace(/\s+/g, ' ');

    if (!cleaned) {
      return `content-${Date.now()}.bin`;
    }

    return cleaned;
  }

  private extensionByContentType(contentType: string): string {
    const normalized = contentType.split(';')[0].trim().toLowerCase();
    const mapping: Record<string, string> = {
      'video/mp4': '.mp4',
      'video/webm': '.webm',
      'video/quicktime': '.mov',
      'audio/mpeg': '.mp3',
      'audio/mp4': '.m4a',
      'image/jpeg': '.jpg',
      'image/png': '.png',
    };

    if (mapping[normalized]) {
      return mapping[normalized];
    }

    if (normalized.startsWith('video/')) {
      const ext = extname(normalized.replace('video/', '.'));
      return ext || '.mp4';
    }

    return '.bin';
  }
}
