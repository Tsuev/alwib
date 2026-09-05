<template>
  <Block>
    <template #header>
      <div :class="blockHeader()">
        <span :class="blockHeaderKickerPlain()">Статус</span>
        <span :class="statusHighlightSmall()">активно</span>
      </div>
    </template>
    <div :class="statusList()">
      <div :class="statusRow()">
        <span>Подписка</span>
        <span :class="statusHighlight()">Pro trial</span>
      </div>
      <div :class="statusRow()">
        <span>Следующий платёж</span>
        <span>12 фев</span>
      </div>
      <div :class="statusRow()">
        <span>Команда</span>
        <span>1 участник</span>
      </div>
      <div :class="statusNote()">
        Добавьте участников и доступы к модулям, чтобы собрать единое рабочее пространство.
      </div>
    </div>
  </Block>
</template>

<script setup lang="ts">
import Block from '@/components/app/Block.vue'
import { tv } from 'tailwind-variants'

const styles = tv({
  slots: {
    blockHeader: [
      'flex flex-col gap-1 text-sm text-slate-400 md:flex-row md:items-center',
      'md:justify-between',
    ],
    blockHeaderKickerPlain: ['uppercase tracking-wide'],
    statusList: ['mt-4 space-y-4 text-sm text-slate-200'],
    statusRow: ['flex items-center justify-between'],
    statusHighlight: ['text-primary-300'],
    statusHighlightSmall: ['text-xs text-primary-300'],
    statusNote: [
      'rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 text-xs',
      'text-slate-400 mb-4 sm:mb-0',
    ],
  },
})

const {
  blockHeader,
  blockHeaderKickerPlain,
  statusList,
  statusRow,
  statusHighlight,
  statusHighlightSmall,
  statusNote,
} = styles()
</script>
