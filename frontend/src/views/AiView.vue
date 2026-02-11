<template>
  <DefaultLayout :class="layout()">
    <header :class="header()">
      <h1 :class="title()">ИИ ассистенты</h1>
      <p :class="lead()">
        Подготовленные роли с контролируемыми промптами. История каждого диалога хранится до 50
        сообщений.
      </p>
    </header>

    <section :class="sectionGrid()">
      <div :class="card()">
        <p :class="cardTitle()">Базовые роли</p>
        <ul :class="list()">
          <li :class="listItem()">
            <i :class="listIcon()" aria-hidden="true"></i>
            <span>Маркетолог</span>
          </li>
          <li :class="listItem()">
            <i :class="listIcon()" aria-hidden="true"></i>
            <span>Помощник к собеседованию</span>
          </li>
          <li :class="listItem()">
            <i :class="listIcon()" aria-hidden="true"></i>
            <span>Код-ассистент</span>
          </li>
        </ul>
      </div>

      <div :class="card()">
        <p :class="cardTitle()">Лимиты</p>
        <ul :class="list()">
          <li :class="listItem()">
            <i :class="listIcon()" aria-hidden="true"></i>
            <span>До 50 сообщений в каждом чате.</span>
          </li>
          <li :class="listItem()">
            <i :class="listIcon()" aria-hidden="true"></i>
            <span>Промпты фиксируются на стороне админа.</span>
          </li>
        </ul>
        <Button
          label="Открыть библиотеку ролей"
          severity="primary"
          :class="actionButton()"
          disabled
        />
        <p :class="helperText()">Модуль в разработке — подключим Deepseek API.</p>
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
    sectionGrid: ['grid gap-6 mt-6 lg:grid-cols-2'],
    card: ['rounded-2xl bg-slate-900/80 p-6'],
    cardTitle: ['text-sm uppercase tracking-wide text-slate-400'],
    list: ['mt-3 space-y-2 text-sm text-slate-200'],
    listItem: ['flex items-start gap-2'],
    listIcon: ['pi pi-check-circle mt-0.5 text-primary-400'],
    actionButton: ['mt-6 w-full'],
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
  list,
  listItem,
  listIcon,
  actionButton,
  helperText,
} = styles()
</script>
