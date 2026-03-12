import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

const DEV_FRONTEND_PORTS = new Set([5173, 5174, 4173]);

const isPrivateNetworkFrontendOrigin = (origin: string): boolean => {
  try {
    const parsed = new URL(origin);
    const protocol = parsed.protocol;
    if (protocol !== 'http:' && protocol !== 'https:') {
      return false;
    }

    const port = parsed.port
      ? Number(parsed.port)
      : protocol === 'https:'
        ? 443
        : 80;

    if (!DEV_FRONTEND_PORTS.has(port)) {
      return false;
    }

    const hostname = parsed.hostname;
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '::1'
    ) {
      return true;
    }

    if (/^10\./.test(hostname) || /^192\.168\./.test(hostname)) {
      return true;
    }

    const subnet172 = hostname.match(/^172\.(\d{1,2})\./);
    if (!subnet172) {
      return false;
    }

    const secondOctet = Number(subnet172[1]);
    return secondOctet >= 16 && secondOctet <= 31;
  } catch {
    return false;
  }
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(process.cwd(), 'public'));
  app.use(cookieParser());
  const frontendOrigins = (
    process.env.FRONTEND_URLS ||
    process.env.FRONTEND_URL ||
    'http://localhost:5173,http://localhost:5174'
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  const frontendOriginsSet = new Set(frontendOrigins);
  const allowPrivateNetworkCors =
    process.env.CORS_ALLOW_PRIVATE_NETWORK === 'true' ||
    process.env.NODE_ENV !== 'production';

  // Включаем глобальную валидацию
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Включаем CORS для работы с cookies
  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (typeof origin !== 'string') {
        callback(null, false);
        return;
      }

      if (frontendOriginsSet.has(origin)) {
        callback(null, true);
        return;
      }

      if (allowPrivateNetworkCors && isPrivateNetworkFrontendOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
    credentials: true,
  });

  // Настройка Swagger документации
  const config = new DocumentBuilder()
    .setTitle('Alwib API')
    .setDescription('API документация для Alwib приложения')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Введите JWT токен',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('auth', 'Аутентификация и авторизация')
    .addTag('ai', 'AI ассистенты и закрепленные чаты')
    .addTag('app', 'Основные функции приложения')
    .addTag('downloader', 'Загрузка контента через Media Roller')
    .addTag('vpn', 'VPN интеграция через 3x-ui')
    .addTag('storefront', 'Конструктор витрин')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
