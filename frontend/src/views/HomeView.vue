<template>
  <DefaultLayout :class="layout()">
    <HomeHeroSection />

    <section :class="sectionGrid()">
      <HomeUsageBlock :usage-cards="usageCards" />
      <HomeStatusBlock />
    </section>

    <HomeModulesSection :modules="modules" />
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import HomeHeroSection from '@/components/home/HomeHeroSection.vue'
import HomeUsageBlock, { type HomeUsageCard } from '@/components/home/HomeUsageBlock.vue'
import HomeStatusBlock from '@/components/home/HomeStatusBlock.vue'
import HomeModulesSection, { type HomeModuleConfig } from '@/components/home/HomeModulesSection.vue'
import { tv } from 'tailwind-variants'

const styles = tv({
  slots: {
    layout: ['flex flex-col gap-8'],
    sectionGrid: ['grid gap-6 lg:grid-cols-3'],
  },
})

const { layout, sectionGrid } = styles()

const usageCards: HomeUsageCard[] = [
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

const modules: HomeModuleConfig[] = [
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
