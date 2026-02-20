import { Injectable, Logger } from '@nestjs/common';
import nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);

  private parseBoolean(value: string | undefined, fallback: boolean) {
    if (value === undefined) {
      return fallback;
    }

    return value.toLowerCase() === 'true';
  }

  private getTransport() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 465);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const secure = this.parseBoolean(process.env.SMTP_SECURE, port === 465);

    if (!host || !user || !pass) {
      this.logger.warn(
        'SMTP credentials are missing. OTP email will not be sent.',
      );
      return null;
    }

    return nodemailer.createTransport({
      host,
      port,
      secure,
      requireTLS: !secure,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      auth: {
        user,
        pass,
      },
    });
  }

  async sendOtpEmail(email: string, code: string) {
    const transport = this.getTransport();

    if (!transport) {
      return;
    }

    const from =
      process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@alwib.ru';

    try {
      await transport.sendMail({
        from,
        to: email,
        subject: 'Код подтверждения Alwib',
        text: `Ваш код подтверждения: ${code}. Код действителен 10 минут.`,
        html: `
          <div style="font-family: Arial, sans-serif;">
            <h2>Подтверждение почты</h2>
            <p>Ваш код подтверждения:</p>
            <div style="font-size: 24px; font-weight: bold; margin: 12px 0;">${code}</div>
            <p>Код действителен 10 минут.</p>
          </div>
        `,
      });
    } catch (error) {
      this.logger.error(
        `Не удалось отправить OTP на ${email}: ${(error as Error).message}`,
      );
      throw error;
    }
  }
}
