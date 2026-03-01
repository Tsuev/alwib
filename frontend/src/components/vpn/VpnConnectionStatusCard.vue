<template>
  <div :class="card()">
    <p :class="sectionTitle()">Статус подключения</p>

    <div v-if="loading" :class="statusRow()">
      <Skeleton shape="circle" size="10px" />
      <Skeleton width="72px" height="24px" />
    </div>

    <div v-else :class="statusRow()">
      <span :class="statusDot"></span>
      <span :class="statusText()">{{ isOnline ? 'Онлайн' : 'Офлайн' }}</span>
    </div>

    <p v-if="!loading" :class="bodyText()">
      {{ isOnline ? 'Сессия активна, ключ используется.' : 'Подключение не обнаружено.' }}
    </p>
    <div v-else :class="bodyText()">
      <Skeleton width="82%" height="10px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Skeleton from 'primevue/skeleton'
import { computed } from 'vue'
import { tv } from 'tailwind-variants'

const props = defineProps<{
  loading: boolean
  isOnline: boolean
}>()

const styles = tv({
  slots: {
    card: ['rounded-2xl bg-slate-900/80 p-6'],
    sectionTitle: ['text-sm uppercase tracking-wide text-slate-400'],
    statusRow: ['mt-3 flex items-center gap-3'],
    statusText: ['text-lg font-semibold text-white'],
    statusDot: ['h-2.5 w-2.5 rounded-full'],
    bodyText: ['mt-3 text-sm text-slate-300'],
  },
  variants: {
    status: {
      online: {
        statusDot: ['bg-emerald-400'],
      },
      offline: {
        statusDot: ['bg-rose-400'],
      },
    },
  },
})

const { card, sectionTitle, statusRow, statusText, bodyText } = styles()
const statusDot = computed(() => styles({ status: props.isOnline ? 'online' : 'offline' }).statusDot())
</script>
