<template>
  <DefaultLayout :class="layout()">
    <header :class="header()">
      <h1 :class="title()">VPN (VLESS)</h1>
      <p :class="lead()">
        Быстрый доступ к защищённому интернету. Выдача ключа через 3x-ui с пробным периодом 3 дня.
      </p>
    </header>

    <section :class="sectionGrid()">
      <div :class="deepWideCard()">
        <div :class="cardHeader()">
          <p :class="sectionTitle()">VLESS ключ</p>
          <Button
            :label="copyLabel"
            :icon="copyIcon"
            severity="secondary"
            size="small"
            :class="copyButton()"
            :disabled="!hasKey || loading"
            @click="copyKey"
          />
        </div>
        <div :class="keyBox()">
          <template v-if="loading">
            <Skeleton width="80px" height="10px" />
            <Skeleton class="mt-2" width="100%" height="14px" />
            <Skeleton class="mt-2" width="78%" height="14px" />
          </template>
          <template v-else>
            <span v-if="hasKey" :class="keyPrefix()">$ vless://</span>
            <span :class="keyValue()">{{ keyView }}</span>
          </template>
        </div>
        <p v-if="!loading" :class="helperText()">
          {{
            hasKey
              ? 'Используйте ключ в вашем VPN клиенте или скопируйте одной кнопкой.'
              : 'Запросите бесплатный ключ или оформите подписку для доступа.'
          }}
        </p>
        <Skeleton v-else :class="helperText()" width="62%" height="10px" />
      </div>

      <div :class="darkCard()">
        <p :class="sectionTitle()">Действия</p>
        <template v-if="loading">
          <Skeleton :class="firstActionButton()" height="40px" />
          <Skeleton :class="secondActionButton()" height="40px" />
          <Skeleton :class="looseHelperText()" width="70%" height="10px" />
        </template>
        <template v-else>
          <Button
            :label="trialButtonLabel"
            severity="primary"
            :class="firstActionButton()"
            :disabled="trialButtonDisabled"
            :loading="requestingTrial"
            @click="requestTrialKey"
          />
          <Button
            label="Открыть инструкцию"
            severity="secondary"
            :class="secondActionButton()"
            disabled
          />
          <p :class="looseHelperText()">Пробный ключ выдается один раз на 3 дня.</p>
        </template>
      </div>
    </section>

    <section :class="sectionGrid()">
      <div :class="darkCard()">
        <p :class="sectionTitle()">Статус доступа</p>
        <div v-if="loading" :class="statusRow()">
          <Skeleton width="118px" height="30px" />
          <Skeleton width="70px" height="18px" />
        </div>
        <div v-else :class="statusRow()">
          <Tag :severity="accessTagSeverity">{{ accessTagLabel }}</Tag>
          <span :class="mutedText()">{{ accessDaysText }}</span>
        </div>
        <p v-if="!loading" :class="looseBodyText()">{{ accessDescription }}</p>
        <div v-else :class="looseBodyText()">
          <Skeleton width="100%" height="10px" />
          <Skeleton class="mt-2" width="84%" height="10px" />
        </div>
      </div>

      <div :class="darkCard()">
        <p :class="sectionTitle()">Трафик</p>
        <div v-if="loading" :class="trafficHeader()">
          <Skeleton width="96px" height="30px" />
          <Skeleton width="74px" height="14px" />
        </div>
        <div v-else :class="trafficHeader()">
          <div :class="trafficValue()">{{ trafficUsed }}</div>
          <div :class="hintText()">{{ trafficLimitLabel }}</div>
        </div>
        <div :class="progressTrack()">
          <Skeleton v-if="loading" width="100%" height="8px" />
          <div v-else :class="progressFill()" :style="{ width: `${trafficPercent}%` }"></div>
        </div>
        <p v-if="!loading" :class="helperText()">Потребленный трафик по текущему VPN ключу.</p>
        <Skeleton v-else :class="helperText()" width="66%" height="10px" />
      </div>

      <div :class="darkCard()">
        <p :class="sectionTitle()">Статус подключения</p>
        <div v-if="loading" :class="statusRow()">
          <Skeleton shape="circle" size="10px" />
          <Skeleton width="72px" height="24px" />
        </div>
        <div v-else :class="statusRow()">
          <span :class="statusDotClass"></span>
          <span :class="statusText()">
            {{ isOnline ? 'Онлайн' : 'Офлайн' }}
          </span>
        </div>
        <p v-if="!loading" :class="bodyText()">
          {{ isOnline ? 'Сессия активна, ключ используется.' : 'Подключение не обнаружено.' }}
        </p>
        <div v-else :class="bodyText()">
          <Skeleton width="82%" height="10px" />
        </div>
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { tv } from 'tailwind-variants'
import { useToast } from 'primevue/usetoast'

import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'
import Tag from 'primevue/tag'
import { vpnServices } from '@/services'
import type { VpnOverviewResponse } from '@/types/vpn'

const styles = tv({
  slots: {
    layout: ['flex flex-col gap-8'],
    header: ['flex flex-col gap-2'],
    title: ['text-3xl font-semibold text-white'],
    lead: ['text-slate-300'],
    sectionGrid: ['grid mt-6 gap-6 lg:grid-cols-3'],
    card: ['rounded-2xl p-6'],
    cardHeader: ['flex items-center justify-between gap-3'],
    sectionTitle: ['text-sm uppercase tracking-wide text-slate-400'],
    helperText: ['text-xs text-slate-400'],
    bodyText: ['text-sm text-slate-300'],
    mutedText: ['text-sm text-slate-200'],
    hintText: ['text-sm text-slate-400'],
    statusRow: ['mt-3 flex items-center gap-3'],
    statusText: ['text-lg font-semibold text-white'],
    statusDot: ['h-2.5 w-2.5 rounded-full'],
    trafficHeader: ['mt-3 flex items-baseline justify-between'],
    trafficValue: ['text-2xl font-semibold text-white'],
    progressTrack: ['mt-3 h-2 rounded-full bg-slate-800'],
    progressFill: [
      'h-2 rounded-full bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 transition-all',
    ],
    actionButton: ['w-full'],
    copyButton: ['shrink-0'],
    keyBox: [
      'mt-4 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3',
      'font-mono text-sm text-emerald-300',
    ],
    keyPrefix: ['block text-xs text-slate-500'],
    keyValue: ['break-all'],
  },
  variants: {
    cardTone: {
      dark: {
        card: ['bg-slate-900/80'],
      },
      deep: {
        card: ['bg-slate-950/90'],
      },
    },
    cardSpan: {
      1: {
        card: [''],
      },
      2: {
        card: ['lg:col-span-2'],
      },
    },
    helperSpacing: {
      tight: {
        helperText: ['mt-3'],
      },
      loose: {
        helperText: ['mt-4'],
      },
    },
    bodySpacing: {
      tight: {
        bodyText: ['mt-3'],
      },
      loose: {
        bodyText: ['mt-4'],
      },
    },
    actionSpacing: {
      first: {
        actionButton: ['mt-4'],
      },
      second: {
        actionButton: ['mt-3'],
      },
      none: {
        actionButton: [''],
      },
    },
    status: {
      online: {
        statusDot: ['bg-emerald-400'],
      },
      offline: {
        statusDot: ['bg-rose-400'],
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

const {
  layout,
  header,
  title,
  lead,
  sectionGrid,
  cardHeader,
  sectionTitle,
  helperText,
  bodyText,
  mutedText,
  hintText,
  statusRow,
  statusText,
  trafficHeader,
  trafficValue,
  progressTrack,
  progressFill,
  copyButton,
  keyBox,
  keyPrefix,
  keyValue,
} = styles()

const deepWideCard = styles({ cardTone: 'deep', cardSpan: 2 }).card
const darkCard = styles({ cardTone: 'dark' }).card
const firstActionButton = styles({ actionSpacing: 'first' }).actionButton
const secondActionButton = styles({ actionSpacing: 'second' }).actionButton
const looseHelperText = styles({ helperSpacing: 'loose' }).helperText
const looseBodyText = styles({ bodySpacing: 'loose' }).bodyText

const toast = useToast()

const loading = ref(true)
const requestingTrial = ref(false)
const copied = ref(false)
const vpnData = ref<VpnOverviewResponse | null>(null)

const missingKeyText = 'Ключ отсутсвует запросите бесплатный ключ или оформите подписку'

const hasKey = computed(() => Boolean(vpnData.value?.hasKey && vpnData.value?.vpnKey))
const fullKey = computed(() => vpnData.value?.vpnKey || '')
const keyView = computed(() => {
  if (!hasKey.value) {
    return missingKeyText
  }
  return fullKey.value.replace(/^vless:\/\//, '')
})

const isOnline = computed(() => vpnData.value?.connection.isOnline || false)
const statusDotClass = computed(() =>
  styles({ status: isOnline.value ? 'online' : 'offline' }).statusDot(),
)

const accessTagLabel = computed(() => {
  const status = vpnData.value?.access.status || 'none'

  if (status === 'active') {
    return 'Доступ активен'
  }
  if (status === 'expired') {
    return 'Доступ истек'
  }
  if (status === 'disabled') {
    return 'Доступ отключен'
  }
  return 'Ключ отсутствует'
})

const accessTagSeverity = computed<'success' | 'warn' | 'danger' | 'secondary'>(() => {
  const status = vpnData.value?.access.status || 'none'

  if (status === 'active') {
    return 'success'
  }
  if (status === 'expired') {
    return 'warn'
  }
  if (status === 'disabled') {
    return 'danger'
  }
  return 'secondary'
})

const accessDaysText = computed(() => {
  const access = vpnData.value?.access
  if (!access) {
    return 'нет данных'
  }
  if (access.status === 'none') {
    return 'ключ не создан'
  }
  if (access.daysLeft === null) {
    return 'без ограничения'
  }
  if (access.daysLeft <= 0) {
    return '0 дней'
  }
  return `${access.daysLeft} дн.`
})

const accessDescription = computed(() => {
  const status = vpnData.value?.access.status || 'none'

  if (status === 'active') {
    return 'VPN доступ активен. Продлите подписку до даты окончания, чтобы не потерять доступ.'
  }
  if (status === 'expired') {
    return 'Срок действия ключа завершился. Запросите новый доступ или оформите подписку.'
  }
  if (status === 'disabled') {
    return 'Ключ отключен на стороне панели VPN.'
  }
  return 'Ключ пока не создан.'
})

const trafficUsed = computed(() => formatBytes(vpnData.value?.traffic.totalBytes || 0))
const trafficLimitLabel = computed(() => {
  const limitBytes = vpnData.value?.traffic.limitBytes ?? null
  return limitBytes ? `из ${formatBytes(limitBytes)}` : 'без лимита'
})
const trafficPercent = computed(() => vpnData.value?.traffic.usedPercent || 0)

const trialButtonDisabled = computed(
  () => requestingTrial.value || !vpnData.value?.trial.canClaim || hasKey.value,
)
const trialButtonLabel = computed(() => {
  if (requestingTrial.value) {
    return 'Запрашиваем...'
  }
  if (hasKey.value) {
    return 'Ключ уже выдан'
  }
  if (vpnData.value?.trial.canClaim) {
    return 'Получить пробный ключ'
  }
  return 'Пробный ключ уже получен'
})

const copyLabel = computed(() => (copied.value ? 'Скопировано' : 'Скопировать'))
const copyIcon = computed(() => (copied.value ? 'pi pi-check' : 'pi pi-copy'))

const loadVpnData = async (withToast = false) => {
  const response = await vpnServices.getMyVpnData(withToast ? toast : undefined)
  if (response) {
    vpnData.value = response
  }
}

const requestTrialKey = async () => {
  if (trialButtonDisabled.value) {
    return
  }

  requestingTrial.value = true
  const response = await vpnServices.claimTrial(toast)

  if (response) {
    vpnData.value = response.data
  } else {
    await loadVpnData(false)
  }

  requestingTrial.value = false
}

const copyKey = async () => {
  if (!hasKey.value || !fullKey.value) {
    return
  }

  try {
    await navigator.clipboard.writeText(fullKey.value)
    copied.value = true
    window.setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    copied.value = false
  }
}

onMounted(async () => {
  await loadVpnData(true)
  loading.value = false
})

const formatBytes = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 Б'
  }

  const units = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex += 1
  }

  const digits = unitIndex === 0 ? 0 : 2
  return `${size.toFixed(digits)} ${units[unitIndex]}`
}
</script>
