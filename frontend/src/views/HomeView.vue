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

    <section class="grid gap-6 lg:grid-cols-3">
      <Block class="lg:col-span-2">
        <template #header>
          <div class="flex items-center justify-between text-sm text-slate-400">
            <span class="uppercase tracking-wide">Использование</span>
            <span class="text-xs">за последние 7 дней</span>
          </div>
        </template>
        <div class="mt-6 grid gap-4 sm:grid-cols-2">
          <div
            v-for="card in usageCards"
            :key="card.kicker"
            class="rounded-2xl border border-slate-800/70 bg-slate-950/70 p-4"
          >
            <div class="flex items-center justify-between">
              <p class="text-sm text-slate-400">{{ card.kicker }}</p>
              <i :class="['pi', card.icon, 'text-primary-400']"></i>
            </div>
            <p class="mt-3 text-2xl font-semibold text-white">{{ card.value }}</p>
            <p class="mt-1 text-xs text-slate-400">{{ card.caption }}</p>
          </div>
        </div>
        <div class="mt-6 flex flex-wrap gap-2 text-xs text-slate-400">
          <span>Идеи для инфографики:</span>
          <span class="rounded-full border border-slate-800 px-3 py-1">Скорость API</span>
          <span class="rounded-full border border-slate-800 px-3 py-1">Очередь задач</span>
          <span class="rounded-full border border-slate-800 px-3 py-1">Глубина архива</span>
          <span class="rounded-full border border-slate-800 px-3 py-1">Экономия времени</span>
        </div>
      </Block>

      <Block>
        <template #header>
          <div class="flex items-center justify-between text-sm text-slate-400">
            <span class="uppercase tracking-wide">Статус</span>
            <span class="text-xs text-primary-300">активно</span>
          </div>
        </template>
        <div class="mt-4 space-y-4 text-sm text-slate-200">
          <div class="flex items-center justify-between">
            <span>Подписка</span>
            <span class="text-primary-300">Pro trial</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Следующий платёж</span>
            <span>12 фев</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Команда</span>
            <span>1 участник</span>
          </div>
          <div class="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 text-xs text-slate-400">
            Добавьте участников и доступы к модулям, чтобы собрать единое рабочее пространство.
          </div>
        </div>
      </Block>
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
import Block from '@/components/app/Block.vue'
import Tag from 'primevue/tag'

type UsageCard = {
  kicker: string
  value: string
  caption: string
  icon: string
}

type ModuleStatusSeverity = 'success' | 'info' | 'warning' | 'secondary'

type ModuleConfig = {
  title: string
  description: string
  statusLabel: string
  statusSeverity: ModuleStatusSeverity
  limits: string[]
  actionLabel: string
  route?: string
  disabled?: boolean
}

const usageCards: UsageCard[] = [
  {
    kicker: 'Запросов к сервисам',
    value: '248',
    caption: 'Включая VPN и загрузчик',
    icon: 'pi-chart-line',
  },
  {
    kicker: 'Сэкономлено времени',
    value: '6ч 12м',
    caption: 'Автопостинг и ассистенты',
    icon: 'pi-clock',
  },
  {
    kicker: 'Доступно лимитов',
    value: '72%',
    caption: 'Бесплатные квоты активны',
    icon: 'pi-bolt',
  },
  {
    kicker: 'Активных модулей',
    value: '3 из 8',
    caption: 'Запущены основные',
    icon: 'pi-th-large',
  },
]

const modules: ModuleConfig[] = [
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
