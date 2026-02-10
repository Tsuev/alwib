<template>
  <DefaultLayout :class="styles().layout()">
    <header :class="styles().header()">
      <h1 :class="styles().title()">VPN (VLESS)</h1>
      <p :class="styles().lead()">
        Быстрый доступ к защищённому интернету. Выдача ключа через 3x-ui с пробным периодом
        3 дня.
      </p>
    </header>

    <section :class="styles().sectionGrid()">
      <div :class="styles({ cardTone: 'deep', cardSpan: 2 }).card()">
        <div :class="styles().cardHeader()">
          <p :class="styles().sectionTitle()">VLESS ключ</p>
          <Button
            :label="copyLabel"
            :icon="copyIcon"
            severity="secondary"
            size="small"
            :class="styles().copyButton()"
            @click="copyKey"
          />
        </div>
        <div :class="styles().keyBox()">
          <span :class="styles().keyPrefix()">$ vless://</span>
          <span :class="styles().keyValue()">{{ vlessKey }}</span>
        </div>
        <p :class="styles().helperText()">
          Используйте ключ в вашем VPN клиенте или скопируйте одной кнопкой.
        </p>
      </div>

      <div :class="styles({ cardTone: 'dark' }).card()">
        <p :class="styles().sectionTitle()">Действия</p>
        <Button
          label="Получить пробный ключ"
          severity="primary"
          :class="styles({ actionSpacing: 'first' }).actionButton()"
          disabled
        />
        <Button
          label="Открыть инструкцию"
          severity="secondary"
          :class="styles({ actionSpacing: 'second' }).actionButton()"
          disabled
        />
        <p :class="styles({ helperSpacing: 'loose' }).helperText()">
          Модуль в разработке — скоро подключим выдачу ключей.
        </p>
      </div>
    </section>

    <section :class="styles().sectionGrid()">
      <div :class="styles({ cardTone: 'dark' }).card()">
        <p :class="styles().sectionTitle()">Статус доступа</p>
        <div :class="styles().statusRow()">
          <Tag severity="success">Пробный доступ</Tag>
          <span :class="styles().mutedText()">до 3 дней</span>
        </div>
        <p :class="styles({ bodySpacing: 'loose' }).bodyText()">
          После пробного периода доступ блокируется до оплаты общей подписки.
        </p>
      </div>

      <div :class="styles({ cardTone: 'dark' }).card()">
        <p :class="styles().sectionTitle()">Трафик</p>
        <div :class="styles().trafficHeader()">
          <div :class="styles().trafficValue()">{{ trafficUsed }}</div>
          <div :class="styles().hintText()">из {{ trafficLimit }}</div>
        </div>
        <div :class="styles().progressTrack()">
          <div
            :class="styles().progressFill()"
            :style="{ width: `${trafficPercent}%` }"
          ></div>
        </div>
        <p :class="styles().helperText()">Обновляется каждые 10 минут.</p>
      </div>

      <div :class="styles({ cardTone: 'dark' }).card()">
        <p :class="styles().sectionTitle()">Статус подключения</p>
        <div :class="styles().statusRow()">
          <span
            :class="styles({ status: isOnline ? 'online' : 'offline' }).statusDot()"
          ></span>
          <span :class="styles().statusText()">
            {{ isOnline ? 'Онлайн' : 'Офлайн' }}
          </span>
        </div>
        <p :class="styles().bodyText()">
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

const styles = tv({
  slots: {
    layout: 'flex flex-col gap-8',
    header: 'flex flex-col gap-2',
    title: 'text-3xl font-semibold text-white',
    lead: 'text-slate-300',
    sectionGrid: 'grid mt-6 gap-6 lg:grid-cols-3',
    card: 'rounded-2xl p-6',
    cardHeader: 'flex items-center justify-between gap-3',
    sectionTitle: 'text-sm uppercase tracking-wide text-slate-400',
    helperText: 'text-xs text-slate-400',
    bodyText: 'text-sm text-slate-300',
    mutedText: 'text-sm text-slate-200',
    hintText: 'text-sm text-slate-400',
    statusRow: 'mt-3 flex items-center gap-3',
    statusText: 'text-lg font-semibold text-white',
    statusDot: 'h-2.5 w-2.5 rounded-full',
    trafficHeader: 'mt-3 flex items-baseline justify-between',
    trafficValue: 'text-2xl font-semibold text-white',
    progressTrack: 'mt-3 h-2 rounded-full bg-slate-800',
    progressFill:
      'h-2 rounded-full bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 transition-all',
    actionButton: 'w-full',
    copyButton: 'shrink-0',
    keyBox:
      'mt-4 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 font-mono text-sm text-emerald-300',
    keyPrefix: 'block text-xs text-slate-500',
    keyValue: 'break-all',
  },
  variants: {
    cardTone: {
      dark: {
        card: 'bg-slate-900/80',
      },
      deep: {
        card: 'bg-slate-950/90',
      },
    },
    cardSpan: {
      1: {
        card: '',
      },
      2: {
        card: 'lg:col-span-2',
      },
    },
    helperSpacing: {
      tight: {
        helperText: 'mt-3',
      },
      loose: {
        helperText: 'mt-4',
      },
    },
    bodySpacing: {
      tight: {
        bodyText: 'mt-3',
      },
      loose: {
        bodyText: 'mt-4',
      },
    },
    actionSpacing: {
      first: {
        actionButton: 'mt-4',
      },
      second: {
        actionButton: 'mt-3',
      },
      none: {
        actionButton: '',
      },
    },
    status: {
      online: {
        statusDot: 'bg-emerald-400',
      },
      offline: {
        statusDot: 'bg-rose-400',
      },
    },
  },
  defaultVariants: {
    cardTone: 'dark',
    cardSpan: 1,
    helperSpacing: 'tight',
    bodySpacing: 'tight',
    actionSpacing: 'none',
  },
})

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
