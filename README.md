# Пока еще в разработке...

# Alwib Workspace (SaaS Platform) 

Единая платформа `workspace.alwib.ru` с доступом к полезным SaaS‑модулям по подписке (SSO + Google OAuth). Бренд: `alwib.ru`, пользовательские витрины: `uniqname.alwib.ru`.

## Стек

- **Frontend:** Vue 3, TypeScript, Tailwind CSS, PrimeVue
- **Backend:** NestJS, PostgreSQL
- **Auth:** JWT + refresh, SSO, Google OAuth
- **Storage:** S3‑совместимое хранилище (Yandex Cloud)
- **Infra:** API gateway + модули (отдельные сервисы)

## Модули (план)

1. **TG‑анализатор**
   - Вход: канал Telegram.
   - Выход: краткий обзор + статистика + базовые графики.
   - Анализ через Deepseek API.
2. **Автопубликации в соцсети**
   - Instagram, WhatsApp статусы, Telegram‑каналы.
   - Планирование по расписанию.
   - Генерация/редактирование изображений (ChatGPT Image).
   - Генерация продающего текста (GPT‑4.1).
3. **VPN (3x-ui)**
   - Пробный ключ на 3 дня → блокировка до оплаты.
   - Подписка: помесячно.
4. **ИИ‑ассистенты**
   - Фиксированные карточки с заранее заданными промптами.
   - Хранение до 50 сообщений в диалоге.
5. **Загрузчик видео**
   - Источники через Cobalt (или self‑hosted).
   - Лимит: 1 видео/день бесплатно, очередь при нагрузке.
6. **Конструктор витрин**
   - CRUD товаров (фото, цена, описание).
   - Витрина без оплаты, с контактной кнопкой в Telegram/WhatsApp.
   - SEO‑friendly URL и мета‑теги.
7. **Plati Market**
   - Каталог → карточка → редирект на оплату.
   - Кеширование результатов.
8. **IP Checker**
   - 1 запрос/день бесплатно.
   - Подписка: до 50 запросов/неделю.

## MVP (предложение)

- **Конструктор витрин** как самый быстрый модуль для запуска.
- **VPN** как сильный платный кейс после витрин.
- Единый аккаунт, биллинг и ограничение по лимитам для бесплатных пользователей.

## Настройки окружения (черновик)

| Переменная | Описание |
| --- | --- |
| `TELEGRAM_BOT_TOKEN` | Bot token для TG‑аналитики |
| `DEEPSEEK_API_KEY` | Ключ Deepseek |
| `OPENAI_API_KEY` | Ключ OpenAI (GPT‑4.1 + Image) |
| `THREEXUI_BASE_URL` | URL 3x‑ui API |
| `THREEXUI_AUTH_TOKEN` | Токен авторизации 3x‑ui |
| `S3_ENDPOINT` | Endpoint S3 (Yandex Cloud) |
| `S3_ACCESS_KEY` | Access key |
| `S3_SECRET_KEY` | Secret key |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GOOGLE_CALLBACK_URL` | Google OAuth callback URL |
| `FRONTEND_URL` | URL фронтенда для редиректа после OAuth |
| `SMTP_HOST` | SMTP host (например, Yandex) |
| `SMTP_PORT` | SMTP порт |
| `SMTP_USER` | SMTP логин |
| `SMTP_PASS` | SMTP пароль |
| `SMTP_FROM` | Email отправителя |

## Домены

- `alwib.ru` — бренд
- `workspace.alwib.ru` — портал с модулями
- `uniqname.alwib.ru` — витрины пользователей
