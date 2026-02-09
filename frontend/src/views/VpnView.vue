<template>
  <DefaultLayout :class="layout()">
    <header :class="header()">
      <h1 :class="title()">VPN (VLESS)</h1>
      <p :class="lead()">
        Быстрый доступ к защищённому интернету. Выдача ключа через 3x-ui с пробным периодом
        3 дня.
      </p>
    </header>

    <section :class="sectionGrid()">
      <div :class="card({ tone: 'deep', span: 2 })">
        <div :class="cardHeader()">
          <p :class="sectionTitle()">VLESS ключ</p>
          <Button
            :label="copyLabel"
            :icon="copyIcon"
            severity="secondary"
            size="small"
            :class="copyButton()"
            @click="copyKey"
          />
        </div>
        <div :class="keyBox()">
          <span :class="keyPrefix()">$ vless://</span>
          <span :class="keyValue()">{{ vlessKey }}</span>
        </div>
        <p :class="helperText()">
          Используйте ключ в вашем VPN клиенте или скопируйте одной кнопкой.
        </p>
      </div>

      <div :class="card({ tone: 'dark' })">
        <p :class="sectionTitle()">Действия</p>
        <Button
          label="Получить пробный ключ"
          severity="primary"
          :class="actionButton({ spacing: 'first' })"
          disabled
        />
        <Button
          label="Открыть инструкцию"
          severity="secondary"
          :class="actionButton({ spacing: 'second' })"
          disabled
        />
        <p :class="helperText({ spacing: 'loose' })">
          Модуль в разработке — скоро подключим выдачу ключей.
        </p>
      </div>
    </section>

    <section :class="sectionGrid()">
      <div :class="card({ tone: 'dark' })">
        <p :class="sectionTitle()">Статус доступа</p>
        <div :class="statusRow()">
          <Tag severity="success">Пробный доступ</Tag>
          <span :class="mutedText()">до 3 дней</span>
        </div>
        <p :class="bodyText({ spacing: 'loose' })">
          После пробного периода доступ блокируется до оплаты общей подписки.
        </p>
      </div>

      <div :class="card({ tone: 'dark' })">
        <p :class="sectionTitle()">Трафик</p>
        <div :class="trafficHeader()">
          <div :class="trafficValue()">{{ trafficUsed }}</div>
          <div :class="hintText()">из {{ trafficLimit }}</div>
        </div>
        <div :class="progressTrack()">
          <div
            :class="progressFill()"
            :style="{ width: `${trafficPercent}%` }"
          ></div>
        </div>
        <p :class="helperText()">Обновляется каждые 10 минут.</p>
      </div>

      <div :class="card({ tone: 'dark' })">
        <p :class="sectionTitle()">Статус подключения</p>
        <div :class="statusRow()">
          <span
            :class="statusDot({ status: isOnline ? 'online' : 'offline' })"
          ></span>
          <span :class="statusText()">
            {{ isOnline ? 'Онлайн' : 'Офлайн' }}
          </span>
        </div>
        <p :class="bodyText()">
          {{ isOnline ? 'Сессия активна, ключ используется.' : 'Подключение не обнаружено.' }}
        </p>
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { tv } from 'tailwind-variants'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

const layout = tv({ base: 'flex flex-col gap-8' })
const header = tv({ base: 'flex flex-col gap-2' })
const title = tv({ base: 'text-3xl font-semibold text-white' })
const lead = tv({ base: 'text-slate-300' })
const sectionGrid = tv({ base: 'grid mt-5 gap-6 lg:grid-cols-3' })
const card = tv({
  base: 'rounded-2xl p-6',
  variants: {
    tone: {
      dark: 'bg-slate-900/80',
      deep: 'bg-slate-950/90',
    },
    span: {
      1: '',
      2: 'lg:col-span-2',
    },
  },
  defaultVariants: {
    tone: 'dark',
    span: 1,
  },
})
const cardHeader = tv({ base: 'flex items-center justify-between gap-3' })
const sectionTitle = tv({ base: 'text-sm uppercase tracking-wide text-slate-400' })
const helperText = tv({
  base: 'text-xs text-slate-400',
  variants: {
    spacing: {
      tight: 'mt-3',
      loose: 'mt-4',
    },
  },
  defaultVariants: {
    spacing: 'tight',
  },
})
const bodyText = tv({
  base: 'text-sm text-slate-300',
  variants: {
    spacing: {
      tight: 'mt-3',
      loose: 'mt-4',
    },
  },
  defaultVariants: {
    spacing: 'tight',
  },
})
const mutedText = tv({ base: 'text-sm text-slate-200' })
const hintText = tv({ base: 'text-sm text-slate-400' })
const statusRow = tv({ base: 'mt-3 flex items-center gap-3' })
const statusText = tv({ base: 'text-lg font-semibold text-white' })
const statusDot = tv({
  base: 'h-2.5 w-2.5 rounded-full',
  variants: {
    status: {
      online: 'bg-emerald-400',
      offline: 'bg-rose-400',
    },
  },
})
const trafficHeader = tv({ base: 'mt-3 flex items-baseline justify-between' })
const trafficValue = tv({ base: 'text-2xl font-semibold text-white' })
const progressTrack = tv({ base: 'mt-3 h-2 rounded-full bg-slate-800' })
const progressFill = tv({ base: 'h-2 rounded-full bg-primary-500 transition-all' })
const actionButton = tv({
  base: 'w-full',
  variants: {
    spacing: {
      first: 'mt-4',
      second: 'mt-3',
      none: '',
    },
  },
  defaultVariants: {
    spacing: 'none',
  },
})
const copyButton = tv({ base: 'shrink-0' })
const keyBox = tv({
  base: 'mt-4 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 font-mono text-sm text-emerald-300',
})
const keyPrefix = tv({ base: 'block text-xs text-slate-500' })
const keyValue = tv({ base: 'break-all' })

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
