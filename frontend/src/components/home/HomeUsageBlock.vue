<template>
  <Block :class="blockWide()">
    <template #header>
      <div :class="blockHeader()">
        <span :class="blockHeaderKicker()">Использование</span>
        <span :class="blockHeaderMeta()">за последние 7 дней</span>
      </div>
    </template>
    <div :class="usageGrid()">
      <div v-for="card in usageCards" :key="card.kicker" :class="usageCard()">
        <div :class="usageCardHeader()">
          <p :class="usageCardKicker()">{{ card.kicker }}</p>
          <i :class="['pi', card.icon, usageIcon()]"></i>
        </div>
        <p :class="usageValue()">{{ card.value }}</p>
        <p :class="usageCaption()">{{ card.caption }}</p>
      </div>
    </div>
    <div :class="ideasRow()">
      <span>Идеи для инфографики:</span>
      <span :class="ideasPill()">Скорость API</span>
      <span :class="ideasPill()">Очередь задач</span>
      <span :class="ideasPill()">Глубина архива</span>
      <span :class="ideasPill()">Экономия времени</span>
    </div>
  </Block>
</template>

<script setup lang="ts">
import Block from '@/components/app/Block.vue'
import { tv } from 'tailwind-variants'

export type HomeUsageCard = {
  kicker: string
  value: string
  caption: string
  icon: string
}

defineProps<{
  usageCards: HomeUsageCard[]
}>()

const styles = tv({
  slots: {
    blockWide: ['lg:col-span-2'],
    blockHeader: [
      'flex flex-col gap-1 text-sm text-slate-400 md:flex-row md:items-center',
      'md:justify-between',
    ],
    blockHeaderKicker: ['uppercase mt-2 tracking-wide'],
    blockHeaderMeta: ['text-xs'],
    usageGrid: ['mt-6 grid gap-4 sm:grid-cols-2'],
    usageCard: ['rounded-2xl border border-slate-800/70 bg-slate-950/70 p-4'],
    usageCardHeader: ['flex items-center justify-between'],
    usageCardKicker: ['text-sm text-slate-400'],
    usageIcon: ['text-primary-400'],
    usageValue: ['mt-3 text-2xl font-semibold text-white'],
    usageCaption: ['mt-1 text-xs text-slate-400'],
    ideasRow: ['mt-6 flex flex-wrap gap-2 text-xs text-slate-400'],
    ideasPill: ['rounded-full border border-slate-800 px-3 py-1'],
  },
})

const {
  blockWide,
  blockHeader,
  blockHeaderKicker,
  blockHeaderMeta,
  usageGrid,
  usageCard,
  usageCardHeader,
  usageCardKicker,
  usageIcon,
  usageValue,
  usageCaption,
  ideasRow,
  ideasPill,
} = styles()
</script>
