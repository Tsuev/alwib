<template>
  <DefaultLayout class="flex flex-col gap-8">
    <header class="flex flex-col gap-2">
      <h1 class="text-3xl font-semibold text-white">Загрузчик видео</h1>
      <p class="text-slate-300">
        Скачивание контента из соцсетей через Cobalt. Поддерживаются большинство платформ.
      </p>
    </header>

    <section class="grid gap-6 lg:grid-cols-3">
      <div class="rounded-2xl bg-slate-900/80 p-6">
        <p class="text-sm uppercase tracking-wide text-slate-400">Бесплатный лимит</p>
        <div class="mt-3 text-2xl font-semibold text-white">1 видео / день</div>
        <p class="mt-3 text-sm text-slate-300">
          При высокой нагрузке запросы отправляются в очередь.
        </p>
      </div>

      <div class="rounded-2xl bg-slate-900/80 p-6">
        <p class="text-sm uppercase tracking-wide text-slate-400">Поддержка</p>
        <ul class="mt-3 space-y-2 text-sm text-slate-200">
          <li class="flex items-start gap-2">
            <i class="pi pi-check-circle mt-0.5 text-primary-400" aria-hidden="true"></i>
            <span>TikTok, YouTube, Instagram, VK, X и другие.</span>
          </li>
          <li class="flex items-start gap-2">
            <i class="pi pi-check-circle mt-0.5 text-primary-400" aria-hidden="true"></i>
            <span>Планируется self-hosted режим.</span>
          </li>
        </ul>
      </div>

      <div class="rounded-2xl bg-slate-900/80 p-6">
        <p class="text-sm uppercase tracking-wide text-slate-400">Действия</p>
        <Button label="Скачать видео" severity="primary" class="mt-4 w-full" disabled />
        <p class="mt-4 text-xs text-slate-400">Модуль в разработке — готовим интеграцию Cobalt.</p>
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Button from 'primevue/button'
</script>
