# Docker запуск Alwib

Этот сценарий поднимает проект полностью в Docker:
- `postgres` (PostgreSQL 16)
- `backend` (NestJS на `http://localhost:3000`)
- `frontend` (Vite/Vue на `http://localhost:5173`)

## Требования

- Docker Desktop / Docker Engine
- Docker Compose v2 (`docker compose`)

## Быстрый старт

Из корня проекта:

```bash
docker compose up --build -d
```

Проверить контейнеры:

```bash
docker compose ps
```

Логи (по сервисам):

```bash
docker compose logs -f postgres
docker compose logs -f backend
docker compose logs -f frontend
```

## Доступ после запуска

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api`
- PostgreSQL: `localhost:5432` (`alwib/alwib`, БД `alwib`)

## Что делает backend при старте

В `docker-compose.yml` для `backend` используется команда:

```bash
npx prisma migrate deploy && npm run start:prod
```

Это означает:
- сначала применяются миграции Prisma,
- затем запускается NestJS в production-режиме.

## Остановка

```bash
docker compose down
```

С удалением volume БД (полный сброс данных):

```bash
docker compose down -v
```

## Настройка переменных

Основные переменные уже заданы в `docker-compose.yml`.
Для production обязательно замените минимум:
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (если используете OAuth)
- `SMTP_*` (если нужна отправка OTP на email)
- `XUI_BASE_URL` / `XUI_USERNAME` / `XUI_PASSWORD` / `XUI_INBOUND_ID` (для VPN через 3x-ui)
- `MEDIA_ROLLER_BASE_URL` (для загрузчика контента)

## Полезно

- Пересобрать только backend:

```bash
docker compose up --build -d backend
```

- Перезапустить один сервис:

```bash
docker compose restart backend
```

- Открыть shell в backend-контейнере:

```bash
docker compose exec backend sh
```
