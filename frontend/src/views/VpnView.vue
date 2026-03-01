<template>
  <DefaultLayout :class="layout()">
    <header :class="header()">
      <h1 :class="title()">VPN (VLESS)</h1>
      <p :class="lead()">
        Быстрый доступ к защищённому интернету. Выдача ключа через 3x-ui с пробным периодом 3 дня.
      </p>
    </header>

    <section :class="sectionGrid()">
      <VpnKeyCard
        :loading="loading"
        :has-key="hasKey"
        :key-view="keyView"
        :copy-label="copyLabel"
        :copy-icon="copyIcon"
        @copy-key="copyKey"
      />

      <VpnActionsCard
        :loading="loading"
        :requesting-trial="requestingTrial"
        :trial-button-label="trialButtonLabel"
        :trial-button-disabled="trialButtonDisabled"
        @request-trial="requestTrialKey"
      />
    </section>

    <section :class="sectionGrid()">
      <VpnAccessStatusCard
        :loading="loading"
        :access-tag-severity="accessTagSeverity"
        :access-tag-label="accessTagLabel"
        :access-days-text="accessDaysText"
        :access-description="accessDescription"
      />

      <VpnTrafficCard
        :loading="loading"
        :traffic-used="trafficUsed"
        :traffic-limit-label="trafficLimitLabel"
        :traffic-percent="trafficPercent"
      />

      <VpnConnectionStatusCard :loading="loading" :is-online="isOnline" />
    </section>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { tv } from 'tailwind-variants'
import { useToast } from 'primevue/usetoast'

import DefaultLayout from '@/layouts/DefaultLayout.vue'
import VpnKeyCard from '@/components/vpn/VpnKeyCard.vue'
import VpnActionsCard from '@/components/vpn/VpnActionsCard.vue'
import VpnAccessStatusCard from '@/components/vpn/VpnAccessStatusCard.vue'
import VpnTrafficCard from '@/components/vpn/VpnTrafficCard.vue'
import VpnConnectionStatusCard from '@/components/vpn/VpnConnectionStatusCard.vue'
import { vpnServices } from '@/services'
import type { VpnOverviewResponse } from '@/types/vpn'

const styles = tv({
  slots: {
    layout: ['flex flex-col gap-8'],
    header: ['flex flex-col gap-2'],
    title: ['text-3xl font-semibold text-white'],
    lead: ['text-slate-300'],
    sectionGrid: ['grid mt-6 gap-6 lg:grid-cols-3'],
  },
})

const { layout, header, title, lead, sectionGrid } = styles()

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
