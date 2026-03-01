<template>
  <div :class="card()">
    <p :class="sectionTitle()">Действия</p>

    <template v-if="loading">
      <Skeleton :class="firstActionButton()" height="40px" />
      <Skeleton :class="secondActionButton()" height="40px" />
      <Skeleton :class="helperText()" width="70%" height="10px" />
    </template>

    <template v-else>
      <Button
        :label="trialButtonLabel"
        severity="primary"
        :class="firstActionButton()"
        :disabled="trialButtonDisabled"
        :loading="requestingTrial"
        @click="$emit('request-trial')"
      />
      <Button label="Открыть инструкцию" severity="secondary" :class="secondActionButton()" disabled />
      <p :class="helperText()">Пробный ключ выдается один раз на 3 дня.</p>
    </template>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'
import { tv } from 'tailwind-variants'

defineProps<{
  loading: boolean
  requestingTrial: boolean
  trialButtonDisabled: boolean
  trialButtonLabel: string
}>()

defineEmits<{
  'request-trial': []
}>()

const styles = tv({
  slots: {
    card: ['rounded-2xl bg-slate-900/80 p-6'],
    sectionTitle: ['text-sm uppercase tracking-wide text-slate-400'],
    actionButton: ['w-full'],
    helperText: ['mt-4 text-xs text-slate-400'],
  },
  variants: {
    actionSpacing: {
      first: {
        actionButton: ['mt-4'],
      },
      second: {
        actionButton: ['mt-3'],
      },
    },
  },
})

const firstActionButton = styles({ actionSpacing: 'first' }).actionButton
const secondActionButton = styles({ actionSpacing: 'second' }).actionButton
const { card, sectionTitle, helperText } = styles()
</script>
