---
name: alwib-frontend
description: Develop and maintain the Alwib Vue 3 frontend in `frontend/`. Use when implementing or refactoring pages, components, composables, stores, router guards, API integrations, authentication UX, PrimeVue/Tailwind UI behavior, and frontend lint/test/build flows.
---

# Alwib Frontend

## Stack and key paths
- Vue 3 + TypeScript + Vite
- PrimeVue + Tailwind CSS 4
- Pinia for state
- Vue Router for route guards
- HTTP layer in `src/plugins/axios.ts`
- API wrappers in `src/services/`
- UI/state orchestration in `src/composables/` and `src/stores/`

## Work sequence
1. Locate the feature boundary.
2. Define or update types in `src/types/` before implementation.
3. Add or update API calls in `src/services/*`.
4. Keep view orchestration in composables/stores and rendering in components/views.
5. Show user-facing failures with PrimeVue toast where UX expects explicit feedback.
6. Run quality checks in `frontend/`:
   - `npm run lint`
   - `npm run type-check`
   - `npm run test:unit` when behavior changes

## Project conventions
- Reuse configured axios instance from `src/plugins/axios.ts`.
- Preserve token + cookie flow:
  - `Authorization: Bearer <token>` from `localStorage`
  - `withCredentials: true` for backend cookie flow
- Keep auth state in `useUserStore`.
- Respect router meta contract:
  - `requiresAuth` for protected routes
  - `requiresGuest` for guest-only routes
- Prefer `@/` imports where available.
- Keep style aligned with existing ESLint/Prettier setup.

## Auth-specific notes
- Frontend contains local dev auth bypass in `src/services/authServices.ts`.
- If auth flow changes, update both request/response typing and service methods.
- Keep `login/register/request-otp/verify-otp/logout/profile/verify-token` behavior aligned with backend `/auth/*` endpoints.

## Done criteria
- Feature works from route and UI level.
- Types and service contracts are synchronized.
- Lint/type checks pass.
- Auth guards and edge-case errors are handled.
