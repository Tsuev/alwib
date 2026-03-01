<template>
  <div :class="card()">
    <p :class="sectionTitle()">Статус доступа</p>

    <div v-if="loading" :class="statusRow()">
      <Skeleton width="118px" height="30px" />
      <Skeleton width="70px" height="18px" />
    </div>

    <div v-else :class="statusRow()">
      <Tag :severity="accessTagSeverity">{{ accessTagLabel }}</Tag>
      <span :class="mutedText()">{{ accessDaysText }}</span>
    </div>

    <p v-if="!loading" :class="bodyText()">{{ accessDescription }}</p>
    <div v-else :class="bodyText()">
      <Skeleton width="100%" height="10px" />
      <Skeleton class="mt-2" width="84%" height="10px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Skeleton from 'primevue/skeleton'
import Tag from 'primevue/tag'
import { tv } from 'tailwind-variants'

defineProps<{
  loading: boolean
  accessTagSeverity: 'success' | 'warn' | 'danger' | 'secondary'
  accessTagLabel: string
  accessDaysText: string
  accessDescription: string
}>()

const styles = tv({
  slots: {
    card: ['rounded-2xl bg-slate-900/80 p-6'],
    sectionTitle: ['text-sm uppercase tracking-wide text-slate-400'],
    statusRow: ['mt-3 flex items-center gap-3'],
    mutedText: ['text-sm text-slate-200'],
    bodyText: ['mt-4 text-sm text-slate-300'],
  },
})

const { card, sectionTitle, statusRow, mutedText, bodyText } = styles()
</script>
