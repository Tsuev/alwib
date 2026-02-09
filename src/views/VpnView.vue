<template>
  <DefaultLayout class="flex flex-col gap-8">
    <header class="flex flex-col gap-2">
      <h1 class="text-3xl font-semibold text-white">VPN (VLESS)</h1>
      <p class="text-slate-300">
        Быстрый доступ к защищённому интернету. Выдача ключа через 3x-ui с пробным периодом
        3 дня.
      </p>
    </header>

    <section class="grid mt-5 gap-6 lg:grid-cols-3">
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
        <p class="text-sm uppercase tracking-wide text-slate-400">Трафик</p>
        <div class="mt-3 flex items-baseline justify-between">
          <div class="text-2xl font-semibold text-white">{{ trafficUsed }}</div>
          <div class="text-sm text-slate-400">из {{ trafficLimit }}</div>
        </div>
        <div class="mt-3 h-2 rounded-full bg-slate-800">
          <div
            class="h-2 rounded-full bg-primary-500 transition-all"
            :style="{ width: `${trafficPercent}%` }"
          ></div>
        </div>
        <p class="mt-3 text-xs text-slate-400">Обновляется каждые 10 минут.</p>
      </div>

      <div class="rounded-2xl bg-slate-900/80 p-6">
        <p class="text-sm uppercase tracking-wide text-slate-400">Статус подключения</p>
        <div class="mt-3 flex items-center gap-3">
          <span
            class="h-2.5 w-2.5 rounded-full"
            :class="isOnline ? 'bg-emerald-400' : 'bg-rose-400'"
          ></span>
          <span class="text-lg font-semibold text-white">
            {{ isOnline ? 'Онлайн' : 'Офлайн' }}
          </span>
        </div>
        <p class="mt-3 text-sm text-slate-300">
          {{ isOnline ? 'Сессия активна, ключ используется.' : 'Подключение не обнаружено.' }}
        </p>
      </div>
    </section>

    <section class="grid mt-5 gap-6 lg:grid-cols-3">
      <div class="rounded-2xl bg-slate-950/90 p-6 lg:col-span-2">
        <div class="flex items-center justify-between gap-3">
          <p class="text-sm uppercase tracking-wide text-slate-400">VLESS ключ</p>
          <Button
            :label="copyLabel"
            :icon="copyIcon"
            severity="secondary"
            size="small"
            class="shrink-0"
            @click="copyKey"
          />
        </div>
        <div
          class="mt-4 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 font-mono text-sm text-emerald-300"
        >
          <span class="block text-xs text-slate-500">$ vless://</span>
          <span class="break-all">{{ vlessKey }}</span>
        </div>
        <p class="mt-3 text-xs text-slate-400">
          Используйте ключ в вашем VPN клиенте или скопируйте одной кнопкой.
        </p>
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
import { computed, ref } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

const vlessKey = ref(
  'vless://b5d9d04b-0a9b-4b7e-8e0a-8f3f6d6a7e02@vpn.example.com:443?encryption=none&security=tls&type=ws#alwib'
)
const trafficUsed = ref('18.6 ГБ')
const trafficLimit = ref('100 ГБ')
const trafficPercent = computed(() => {
  const used = 18.6
  const limit = 100
  return Math.min(100, Math.round((used / limit) * 100))
})
const isOnline = ref(true)

const copied = ref(false)
const copyLabel = computed(() => (copied.value ? 'Скопировано' : 'Скопировать'))
const copyIcon = computed(() => (copied.value ? 'pi pi-check' : 'pi pi-copy'))

const copyKey = async () => {
  try {
    await navigator.clipboard.writeText(vlessKey.value)
    copied.value = true
    window.setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    copied.value = false
  }
}
</script>
