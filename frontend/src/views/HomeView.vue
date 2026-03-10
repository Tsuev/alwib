<template>
  <DefaultLayout :class="layout()">
    <section :class="header()">
      <h1 :class="title()">Workspace Alwib</h1>
      <p :class="lead()">
        Единый доступ к сервисам: аналитика, автоматизация публикаций, VPN, ассистенты и витрины. В
        бесплатном режиме доступны базовые лимиты, подписка открывает расширенные квоты.
      </p>
      <div :class="tagRow()">
        <Tag severity="info">SSO + Google OAuth</Tag>
        <Tag severity="success">Единая подписка</Tag>
        <Tag severity="warning">Бесплатные лимиты</Tag>
      </div>
    </section>

    <section :class="sectionGrid()">
      <Block :class="blockWide()">
        <template #header>
          <div :class="blockHeader()">
            <span :class="blockHeaderKicker()">Использование</span>
            <span :class="blockHeaderMeta()">за последние 7 дней</span>
          </div>
        </template>
        <div :class="usageGrid()">
          <div v-for="card in usageCards" :key="card.kicker" :class="usageCard()">
            <div :class="usageCardHeader()">
              <p :class="usageCardKicker()">{{ card.kicker }}</p>
              <i :class="['pi', card.icon, usageIcon()]"></i>
            </div>
            <p :class="usageValue()">{{ card.value }}</p>
            <p :class="usageCaption()">{{ card.caption }}</p>
          </div>
        </div>
        <div :class="ideasRow()">
          <span>Идеи для инфографики:</span>
          <span :class="ideasPill()">Скорость API</span>
          <span :class="ideasPill()">Очередь задач</span>
          <span :class="ideasPill()">Глубина архива</span>
          <span :class="ideasPill()">Экономия времени</span>
        </div>
      </Block>

      <Block>
        <template #header>
          <div :class="blockHeader()">
            <span :class="blockHeaderKickerPlain()">Статус</span>
            <span :class="statusHighlightSmall()">активно</span>
          </div>
        </template>
        <div :class="statusList()">
          <div :class="statusRow()">
            <span>Подписка</span>
            <span :class="statusHighlight()">Pro trial</span>
          </div>
          <div :class="statusRow()">
            <span>Следующий платёж</span>
            <span>12 фев</span>
          </div>
          <div :class="statusRow()">
            <span>Команда</span>
            <span>1 участник</span>
          </div>
          <div :class="statusNote()">
            Добавьте участников и доступы к модулям, чтобы собрать единое рабочее пространство.
          </div>
        </div>
      </Block>
    </section>

    <section>
      <div :class="sectionHeader()">
        <h2 :class="sectionTitle()">Модули</h2>
        <Tag severity="secondary">MVP в работе</Tag>
      </div>
      <div :class="modulesGrid()">
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
import { tv } from 'tailwind-variants'

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

const styles = tv({
  slots: {
    layout: ['flex flex-col gap-8'],
    header: ['flex flex-col gap-2'],
    title: ['text-3xl font-semibold text-white'],
    lead: ['text-slate-300'],
    tagRow: ['mt-3 flex flex-wrap gap-3'],
    sectionGrid: ['grid gap-6 lg:grid-cols-3'],
    blockWide: ['lg:col-span-2'],
    blockHeader: [
      'flex flex-col gap-1 text-sm text-slate-400 md:flex-row md:items-center',
      'md:justify-between',
    ],
    blockHeaderKicker: ['uppercase mt-2 tracking-wide'],
    blockHeaderKickerPlain: ['uppercase tracking-wide'],
    blockHeaderMeta: ['text-xs'],
    usageGrid: ['mt-6 grid gap-4 sm:grid-cols-2'],
    usageCard: ['rounded-2xl border border-slate-800/70 bg-slate-950/70 p-4'],
    usageCardHeader: ['flex items-center justify-between'],
    usageCardKicker: ['text-sm text-slate-400'],
    usageIcon: ['text-primary-400'],
    usageValue: ['mt-3 text-2xl font-semibold text-white'],
    usageCaption: ['mt-1 text-xs text-slate-400'],
    ideasRow: ['mt-6 flex flex-wrap gap-2 text-xs text-slate-400'],
    ideasPill: ['rounded-full border border-slate-800 px-3 py-1'],
    statusList: ['mt-4 space-y-4 text-sm text-slate-200'],
    statusRow: ['flex items-center justify-between'],
    statusHighlight: ['text-primary-300'],
    statusHighlightSmall: ['text-xs text-primary-300'],
    statusNote: [
      'rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 text-xs',
      'text-slate-400 mb-4 sm:mb-0',
    ],
    sectionHeader: ['flex items-center justify-between gap-4'],
    sectionTitle: ['text-2xl font-semibold text-white'],
    modulesGrid: ['mt-5 grid gap-6 md:grid-cols-2 xl:grid-cols-3'],
  },
})

const {
  layout,
  header,
  title,
  lead,
  tagRow,
  sectionGrid,
  blockWide,
  blockHeader,
  blockHeaderKicker,
  blockHeaderKickerPlain,
  blockHeaderMeta,
  usageGrid,
  usageCard,
  usageCardHeader,
  usageCardKicker,
  usageIcon,
  usageValue,
  usageCaption,
  ideasRow,
  ideasPill,
  statusList,
  statusRow,
  statusHighlight,
  statusHighlightSmall,
  statusNote,
  sectionHeader,
  sectionTitle,
  modulesGrid,
} = styles()

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
    description: 'Проверка IP-адреса или домена через 2ip API с картой.',
    statusLabel: 'Доступно',
    statusSeverity: 'info',
    limits: ['IP и доменные имена', 'Карта с геолокацией'],
    actionLabel: 'Открыть',
    route: '/ip-check',
  },
]
</script>
