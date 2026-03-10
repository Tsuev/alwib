# Skills for alwib

## Available skills

- `alwib-frontend`: Vue 3 frontend skill for `frontend/` (views, components, composables, services, routing, auth UX, PrimeVue/Tailwind integration, and frontend checks).  
  file: `.codex/skills/alwib-frontend/SKILL.md`
- `alwib-backend`: NestJS backend skill for `backend/` (controllers/services/dto/guards, Prisma schema+migrations, JWT/cookie auth flow, and backend checks).  
  file: `.codex/skills/alwib-backend/SKILL.md`

## Trigger examples

- "Use `alwib-frontend`: add a new protected module page with API integration."
- "Use `alwib-backend`: create CRUD endpoints with Prisma and Swagger docs."

Ниже — переписанная версия в формате `md` для `agents.md`.

---

# Frontend Skills

## 1. fe_design_component_with_primevue

**Owner:** `frontend_agent`

### Description

Проектирует и реализует UI-компонент, используя PrimeVue как основной набор компонентов.
Если нужного компонента нет в PrimeVue — используется headless-подход или кастомная реализация через Tailwind Variants, сохраняя единый стиль и API компонента.

---

### Trigger Conditions

* Требуется новый UI-компонент.
* Требуется обновление существующего компонента.
* Есть утвержденное ТЗ / макет / описание поведения.

---

### Input Schema

* `component_name: string`
* `purpose: string`
* `props: object`
* `events: list`
* `states: list`
* `primevue_candidates: list`
* `fallback_allowed: boolean`
* `styling_tokens`

  * `uses_tailwind_variants: true`
  * `variants: object`

---

### Process Rules

1. Сначала подобрать подходящие компоненты PrimeVue (Button, InputText, DataTable, Dialog и т.д.).
2. Если PrimeVue не покрывает сценарий:

   * предпочесть headless-паттерн (композиция базовых компонентов + логика);
   * либо реализовать кастом через Tailwind Variants.
3. Обязательные состояния:

   * loading
   * disabled
   * error
   * empty (если применимо)
4. Все классы оформлять через Tailwind Variants.
5. "Голый" Tailwind допустим только в минимальном объеме (1–2 утилитарных класса).
6. Поведение и события документировать (в комментариях или README модуля).

---

### Output Schema

* `files`

  * `path`
  * `type: vue_component | composable | stylesheet | types`
* `usage_example`
* `notes`

  * `primevue_used`
  * `custom_fallback_used`

---

### Acceptance Criteria

* PrimeVue используется везде, где это возможно.
* При кастомной реализации стили только через Tailwind Variants.
* Поддержаны состояния loading/disabled/error/empty.
* API компонента (props/events) стабилен и согласован.

---

### Constraints

* Не использовать сторонние UI-библиотеки кроме PrimeVue.
* Не писать inline-стили.

---

# 2. fe_module_placement_and_structure

**Owner:** `frontend_agent`

### Description

Размещает компоненты и код в соответствии со структурой проекта:

* `modules/components` — общие
* `app` — глобальные
* `pages` — страничные

---

### Trigger Conditions

* Добавляется новый компонент.
* Добавляется новый модуль.
* Выполняется рефакторинг структуры.

---

### Input Schema

* `artifact_type: component | composable | page | layout | store`
* `scope: global | shared | page_specific`
* `module_name: string`
* `page_name: optional string`

---

### Process Rules

1. Компонент используется в нескольких местах → `modules/components`.
2. Глобальная логика (layout, shell, navbar, провайдеры, базовые виджеты) → `app`.
3. Компонент относится к одной странице → `pages/<page>/components`.
4. Именование:

   * PascalCase для компонентов.
   * kebab-case для папок (если принято).
5. Каждый компонент в отдельной папке при наличии вложенных частей.

---

### Output Schema

* `placement_decision`

  * `path`
  * `rationale`
* `moved_files` (optional)

---

### Acceptance Criteria

* Размещение соответствует правилам scope.
* Нет дублирования компонентов.

---

### Constraints

* Не переносить компоненты без необходимости.
* Обновлять все импорты при переносе.

---

# 3. fe_build_api_fetch_wrapper

**Owner:** `frontend_agent`

### Description

Реализует единый HTTP-клиент поверх `fetch` с интерфейсом:

* `api.get`
* `api.post`
* `api.put`
* `api.patch`
* `api.delete`

---

### Trigger Conditions

* Требуется общий HTTP-клиент.
* Требуется расширение обработки ошибок.

---

### Input Schema

* `base_url: optional string`
* `auth_strategy: none | bearer_token | cookie`
* `error_format: json | text | mixed`
* `default_headers: optional object`
* `timeout_ms: optional number`

---

### Process Rules

1. Экспортировать объект `api` с методами:

   * `api.get(url, options?)`
   * `api.post(url, body?, options?)`
   * `api.put(url, body?, options?)`
   * `api.patch(url, body?, options?)`
   * `api.delete(url, body?, options?)`
2. `options` поддерживает:

   * `params` (querystring)
   * `headers`
   * `signal` (AbortController)
3. Обработка body:

   * Объект → `JSON.stringify` + `Content-Type: application/json`
   * FormData → не устанавливать `Content-Type`
4. Если `response.ok === false`:

   * выбрасывать typed error (`status`, `message`, `payload`)
5. Парсить ответ в зависимости от `content-type`.
6. Не добавлять retry/refresh-token без явного требования.

---

### Output Schema

* `files`

  * `path`
  * `type: ts_module`
* `public_api`

  * `methods`
  * `examples`
* `error_contract`

  * `fields`

---

### Acceptance Criteria

* Все запросы в проекте используют только `api.*`.
* Единая обработка network и HTTP ошибок.
* Корректная работа с JSON и FormData.

---

### Constraints

* Не использовать axios или другие HTTP-клиенты.
* Не создавать сайд-эффекты в модуле.

---

# 4. fe_integrate_api_in_ui_flows

**Owner:** `frontend_agent`

### Description

Интегрирует `api.*` в UI-сценарии (формы, таблицы, диалоги), обеспечивая корректные состояния загрузки и обработки ошибок.

---

### Trigger Conditions

* Есть endpoint.
* Есть UI-сценарий.

---

### Input Schema

* `ui_flow: string`
* `endpoints: list`
* `state_model: object`
* `error_handling_strategy: toast | inline | dialog`
* `primevue_feedback_components: list`

---

### Process Rules

1. Любой запрос должен иметь loading-индикацию:

   * skeleton
   * spinner
   * disabled controls
2. Ошибки:

   * Формы → inline + общий message.
   * Таблицы/списки → empty/error state.
   * При необходимости → PrimeVue Toast.
3. Успешные действия подтверждать.
4. Поиск/автокомплит → AbortController для отмены запросов.

---

### Output Schema

* `ui_changes`

  * `file`
  * `summary`
* `states_added`

---

### Acceptance Criteria

* Нет "немых" запросов.
* Ошибки отображаются корректно.
* Нет гонок запросов (если применимо).

---

### Constraints

* Не использовать `fetch` напрямую.
* Не хардкодить тексты ошибок без нормализации.

---

# 5. fe_style_system_with_tailwind_variants

**Owner:** `frontend_agent`

### Description

Поддерживает систему вариантов стилей через Tailwind Variants для кастомных компонентов и оберток PrimeVue.

---

### Trigger Conditions

* Требуется кастомный компонент.
* Требуется унификация дизайна.
* Требуется система вариантов (size, intent, state).

---

### Input Schema

* `component_name: string`
* `variants: object`
* `default_variant: object`
* `states: list`

---

### Process Rules

1. TV-конфиг хранить рядом с компонентом либо в общем styling-модуле.
2. Интерактивные компоненты должны поддерживать минимум:

   * size
   * intent
3. Состояния (disabled/loading/error) отражаются через tv-слои.

---

### Output Schema

* `tv_config`

  * `path`
  * `exported`
* `component_usage`

---

### Acceptance Criteria

* Варианты расширяемы.
* Нет дублирования классов.

---

### Constraints

* Не создавать отдельные CSS-файлы без необходимости.

