<template>
  <DefaultLayout class="flex flex-col gap-8">
    <header class="flex flex-col gap-2">
      <h1 class="text-3xl font-semibold text-white">ИИ ассистенты</h1>
      <p class="text-slate-300">
        Подготовленные роли с контролируемыми промптами. История каждого диалога хранится
        до 50 сообщений.
      </p>
    </header>

    <section class="grid gap-6 lg:grid-cols-2">
      <div class="rounded-2xl bg-slate-900/80 p-6">
        <p class="text-sm uppercase tracking-wide text-slate-400">Базовые роли</p>
        <ul class="mt-3 space-y-2 text-sm text-slate-200">
          <li class="flex items-start gap-2">
            <i class="pi pi-check-circle mt-0.5 text-primary-400" aria-hidden="true"></i>
            <span>Маркетолог</span>
          </li>
          <li class="flex items-start gap-2">
            <i class="pi pi-check-circle mt-0.5 text-primary-400" aria-hidden="true"></i>
            <span>Помощник к собеседованию</span>
          </li>
          <li class="flex items-start gap-2">
            <i class="pi pi-check-circle mt-0.5 text-primary-400" aria-hidden="true"></i>
            <span>Код-ассистент</span>
          </li>
        </ul>
      </div>

      <div class="rounded-2xl bg-slate-900/80 p-6">
        <p class="text-sm uppercase tracking-wide text-slate-400">Лимиты</p>
        <ul class="mt-3 space-y-2 text-sm text-slate-200">
          <li class="flex items-start gap-2">
            <i class="pi pi-check-circle mt-0.5 text-primary-400" aria-hidden="true"></i>
            <span>До 50 сообщений в каждом чате.</span>
          </li>
          <li class="flex items-start gap-2">
            <i class="pi pi-check-circle mt-0.5 text-primary-400" aria-hidden="true"></i>
            <span>Промпты фиксируются на стороне админа.</span>
          </li>
        </ul>
        <Button label="Открыть библиотеку ролей" severity="primary" class="mt-6 w-full" disabled />
        <p class="mt-4 text-xs text-slate-400">Модуль в разработке — подключим Deepseek API.</p>
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Button from 'primevue/button'
</script>
