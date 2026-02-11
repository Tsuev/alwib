<template>
  <DefaultLayout :class="layout()">
    <header :class="header()">
      <h1 :class="title()">Загрузчик видео</h1>
      <p :class="lead()">
        Скачивание контента из соцсетей через Cobalt. Поддерживаются большинство платформ.
      </p>
    </header>

    <section :class="sectionGrid()">
      <div :class="card()">
        <p :class="cardTitle()">Бесплатный лимит</p>
        <div :class="cardValue()">1 видео / день</div>
        <p :class="cardText()">При высокой нагрузке запросы отправляются в очередь.</p>
      </div>

      <div :class="card()">
        <p :class="cardTitle()">Поддержка</p>
        <ul :class="list()">
          <li :class="listItem()">
            <i :class="listIcon()" aria-hidden="true"></i>
            <span>TikTok, YouTube, Instagram, VK, X и другие.</span>
          </li>
          <li :class="listItem()">
            <i :class="listIcon()" aria-hidden="true"></i>
            <span>Планируется self-hosted режим.</span>
          </li>
        </ul>
      </div>

      <div :class="card()">
        <p :class="cardTitle()">Действия</p>
        <Button label="Скачать видео" severity="primary" :class="actionButton()" disabled />
        <p :class="helperText()">Модуль в разработке — готовим интеграцию Cobalt.</p>
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Button from 'primevue/button'
import { tv } from 'tailwind-variants'

const styles = tv({
  slots: {
    layout: ['flex flex-col gap-8'],
    header: ['flex flex-col gap-2'],
    title: ['text-3xl font-semibold text-white'],
    lead: ['text-slate-300'],
    sectionGrid: ['grid gap-6 mt-6 lg:grid-cols-3'],
    card: ['rounded-2xl bg-slate-900/80 p-6'],
    cardTitle: ['text-sm uppercase tracking-wide text-slate-400'],
    cardValue: ['mt-3 text-2xl font-semibold text-white'],
    cardText: ['mt-3 text-sm text-slate-300'],
    list: ['mt-3 space-y-2 text-sm text-slate-200'],
    listItem: ['flex items-start gap-2'],
    listIcon: ['pi pi-check-circle mt-0.5 text-primary-400'],
    actionButton: ['mt-4 w-full'],
    helperText: ['mt-4 text-xs text-slate-400'],
  },
})

const {
  layout,
  header,
  title,
  lead,
  sectionGrid,
  card,
  cardTitle,
  cardValue,
  cardText,
  list,
  listItem,
  listIcon,
  actionButton,
  helperText,
} = styles()
</script>
