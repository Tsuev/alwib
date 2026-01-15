<template>
  <DefaultLayout class="flex flex-col gap-8">
    <header class="flex flex-col gap-2">
      <h1 class="text-3xl font-semibold text-white">VPN (VLESS)</h1>
      <p class="text-slate-300">
        Быстрый доступ к защищённому интернету. Выдача ключа через 3x-ui с пробным периодом
        3 дня.
      </p>
    </header>

    <section class="grid gap-6 lg:grid-cols-3">
      <div class="rounded-2xl bg-slate-900/80 p-6">
        <p class="text-sm uppercase tracking-wide text-slate-400">Статус доступа</p>
        <div class="mt-3 flex items-center gap-3">
          <Tag severity="success">Пробный доступ</Tag>
          <span class="text-sm text-slate-200">до 3 дней</span>
        </div>
        <p class="mt-4 text-sm text-slate-300">
          После пробного периода доступ блокируется до оплаты общей подписки.
        </p>
      </div>

      <div class="rounded-2xl bg-slate-900/80 p-6">
        <p class="text-sm uppercase tracking-wide text-slate-400">Что дальше</p>
        <ul class="mt-3 space-y-2 text-sm text-slate-200">
          <li class="flex items-start gap-2">
            <i class="pi pi-check-circle mt-0.5 text-primary-400" aria-hidden="true"></i>
            <span>Подписка продлевается помесячно.</span>
          </li>
          <li class="flex items-start gap-2">
            <i class="pi pi-check-circle mt-0.5 text-primary-400" aria-hidden="true"></i>
            <span>Ключ будет доступен сразу после оплаты.</span>
          </li>
        </ul>
      </div>

      <div class="rounded-2xl bg-slate-900/80 p-6">
        <p class="text-sm uppercase tracking-wide text-slate-400">Действия</p>
        <Button label="Получить пробный ключ" severity="primary" class="mt-4 w-full" disabled />
        <Button
          label="Открыть инструкцию"
          severity="secondary"
          class="mt-3 w-full"
          disabled
        />
        <p class="mt-4 text-xs text-slate-400">
          Модуль в разработке — скоро подключим выдачу ключей.
        </p>
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
</script>
