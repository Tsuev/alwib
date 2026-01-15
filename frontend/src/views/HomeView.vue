<template>
  <DefaultLayout class="flex flex-col gap-8">
    <section class="flex flex-col gap-2">
      <h1 class="text-3xl font-semibold text-white">Workspace Alwib</h1>
      <p class="text-slate-300">
        Единый доступ к сервисам: аналитика, автоматизация публикаций, VPN, ассистенты и
        витрины. В бесплатном режиме доступны базовые лимиты, подписка открывает расширенные
        квоты.
      </p>
      <div class="mt-3 flex flex-wrap gap-3">
        <Tag severity="info">SSO + Google OAuth</Tag>
        <Tag severity="success">Единая подписка</Tag>
        <Tag severity="warning">Бесплатные лимиты</Tag>
      </div>
    </section>

    <section>
      <div class="flex items-center justify-between gap-4">
        <h2 class="text-2xl font-semibold text-white">Модули</h2>
        <Tag severity="secondary">MVP в работе</Tag>
      </div>
      <div class="mt-5 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <ModuleCard
          v-for="module in modules"
          :key="module.title"
          :title="module.title"
          :description="module.description"
          :status-label="module.statusLabel"
          :status-severity="module.statusSeverity"
          :limits="module.limits"
          :action-label="module.actionLabel"
          :route="module.route"
          :disabled="module.disabled"
        />
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import ModuleCard from '@/components/app/ModuleCard.vue'
import Tag from 'primevue/tag'

const modules = [
  {
    title: 'VPN (VLESS)',
    description: 'Автоматическая выдача ключа через 3x-ui с помесячной подпиской.',
    statusLabel: 'Доступно',
    statusSeverity: 'success',
    limits: ['Пробный доступ 3 дня', 'Далее доступ через подписку'],
    actionLabel: 'Открыть',
    route: '/vpn',
  },
  {
    title: 'ИИ ассистенты',
    description: 'Фиксированные роли с контролируемыми промптами и историей.',
    statusLabel: 'Доступно',
    statusSeverity: 'info',
    limits: ['До 50 сообщений в диалоге', 'Планируется библиотека шаблонов'],
    actionLabel: 'Открыть',
    route: '/ai',
  },
  {
    title: 'Загрузчик видео',
    description: 'Скачивание видео из соцсетей через Cobalt с очередью задач.',
    statusLabel: 'Доступно',
    statusSeverity: 'info',
    limits: ['1 видео в день бесплатно', 'Очередь при высокой нагрузке'],
    actionLabel: 'Открыть',
    route: '/downloader',
  },
  {
    title: 'TG-анализатор',
    description: 'Короткий обзор канала с ключевыми метриками и графиками.',
    statusLabel: 'Скоро',
    statusSeverity: 'warning',
    limits: ['Нужен Bot token', 'Отчёт на базе Deepseek'],
    actionLabel: 'Скоро',
    disabled: true,
  },
  {
    title: 'Автопубликации',
    description: 'Контент‑план с генерацией текста и редактированием изображений.',
    statusLabel: 'Скоро',
    statusSeverity: 'warning',
    limits: ['Instagram, WhatsApp, Telegram', 'Расписание + S3 хранилище'],
    actionLabel: 'Скоро',
    disabled: true,
  },
  {
    title: 'Витрины товаров',
    description: 'CRUD товаров и витрина на поддомене пользователя.',
    statusLabel: 'Скоро',
    statusSeverity: 'warning',
    limits: ['SEO-friendly ссылки', 'Контакт в Telegram/WhatsApp'],
    actionLabel: 'Скоро',
    disabled: true,
  },
  {
    title: 'Plati Market',
    description: 'Каталог цифровых товаров с кешированием и поиском.',
    statusLabel: 'Скоро',
    statusSeverity: 'warning',
    limits: ['Каталог → карточка → редирект', 'Кеш ускоряет выдачу'],
    actionLabel: 'Скоро',
    disabled: true,
  },
  {
    title: 'IP Checker',
    description: 'Проверка владельца IP через 2ip API.',
    statusLabel: 'Скоро',
    statusSeverity: 'warning',
    limits: ['1 запрос в день бесплатно', 'Подписка: до 50/неделю'],
    actionLabel: 'Скоро',
    disabled: true,
  },
]
</script>
