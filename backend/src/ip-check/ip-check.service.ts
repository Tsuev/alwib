import {
  BadGatewayException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';

export type IpAsnInfo = {
  id: string;
  name: string;
  hosting: boolean;
};

export type IpCheckResult = {
  ip: string;
  city: string;
  lat: string;
  lon: string;
  country: string;
  code: string;
  emoji: string;
  timezone: string;
  asn: IpAsnInfo;
};

@Injectable()
export class IpCheckService {
  private readonly token = process.env.TWO_IP_TOKEN;

  async lookup(query: string): Promise<IpCheckResult> {
    if (!this.token) {
      throw new ServiceUnavailableException(
        'Не настроена переменная TWO_IP_TOKEN',
      );
    }

    const url = new URL('https://api.2ip.io');
    url.searchParams.set('token', this.token);
    url.searchParams.set('ip', query);

    let response: Response;
    try {
      response = await fetch(url.toString());
    } catch {
      throw new BadGatewayException('Не удалось подключиться к 2ip.io');
    }

    if (!response.ok) {
      throw new BadGatewayException(`2ip.io вернул ошибку: ${response.status}`);
    }

    let data: IpCheckResult & { error?: string };
    try {
      data = (await response.json()) as IpCheckResult & { error?: string };
    } catch {
      throw new BadGatewayException('2ip.io вернул некорректный ответ');
    }

    if (data.error) {
      throw new NotFoundException('IP-адрес или домен не найден');
    }

    return data;
  }
}
