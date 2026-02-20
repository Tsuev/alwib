---
name: alwib-backend
description: Develop and maintain the Alwib NestJS backend in `backend/`. Use when implementing or refactoring modules, controllers, services, DTO validation, Swagger docs, authentication/authorization flows, Prisma schema and migrations, and backend lint/test flows.
---

# Alwib Backend

## Stack and key paths
- NestJS + TypeScript
- Prisma + PostgreSQL
- JWT auth via cookie token + Passport strategies
- Main API bootstrap in `src/main.ts`
- Auth module in `src/auth/`
- Prisma schema and migrations in `prisma/`

## Work sequence
1. Model the API contract first: DTO + response shape.
2. Keep architecture explicit: controller -> service -> prisma access.
3. Add validation decorators in DTO classes and keep Swagger decorators updated.
4. Keep controller thin and push business logic into services.
5. Protect private endpoints with `JwtAuthGuard` and document auth with `@ApiBearerAuth('JWT-auth')`.
6. Run quality checks in `backend/`:
   - `npm run lint`
   - `npm run test`
   - `npm run test:e2e` when endpoint behavior changes

## Prisma conventions
- Edit `prisma/schema.prisma` for model changes.
- Create migrations with `npx prisma migrate dev --name <migration-name>`.
- Regenerate client with `npx prisma generate` after schema updates.
- Commit generated SQL under `prisma/migrations/`.

## Auth and security conventions
- Use `ValidationPipe` assumptions already configured globally in `src/main.ts`.
- Return sanitized user payloads (no password fields).
- Keep cookie key as `token`, `httpOnly: true`, and environment-aware `secure` flag.
- Use Nest exceptions (`UnauthorizedException`, `ConflictException`, etc.) for clear HTTP behavior.

## Project-specific notes
- `AuthService` has a seeded superuser/dev path (`SUPERUSER_*` constants).
- If changing auth flow, keep frontend `src/services/authServices.ts` contract in sync.
- Keep CORS origins and frontend URL handling aligned with environment variables.

## Done criteria
- DTOs, Swagger docs, guards, and responses are consistent.
- Prisma schema/migrations are synchronized.
- Lint/tests pass for touched behavior.
- No sensitive data leaks in API responses.
