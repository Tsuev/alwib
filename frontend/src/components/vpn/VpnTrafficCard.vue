<template>
  <div :class="card()">
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
</template>

<script setup lang="ts">
import Skeleton from 'primevue/skeleton'
import { tv } from 'tailwind-variants'

defineProps<{
  loading: boolean
  trafficUsed: string
  trafficLimitLabel: string
  trafficPercent: number
}>()

const styles = tv({
  slots: {
    card: ['rounded-2xl bg-slate-900/80 p-6'],
    sectionTitle: ['text-sm uppercase tracking-wide text-slate-400'],
    trafficHeader: ['mt-3 flex items-baseline justify-between'],
    trafficValue: ['text-2xl font-semibold text-white'],
    hintText: ['text-sm text-slate-400'],
    progressTrack: ['mt-3 h-2 rounded-full bg-slate-800'],
    progressFill: [
      'h-2 rounded-full bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 transition-all',
    ],
    helperText: ['mt-3 text-xs text-slate-400'],
  },
})

const { card, sectionTitle, trafficHeader, trafficValue, hintText, progressTrack, progressFill, helperText } =
  styles()
</script>
