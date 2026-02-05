<template>
  <header class="sticky top-0 z-20 px-4 pt-4 md:px-8">
    <Toolbar
      class="relative min-h-[52px] rounded-2xl border border-slate-800/70 bg-slate-950/80 px-4 py-2 shadow-lg shadow-black/30 backdrop-blur [background-image:linear-gradient(120deg,rgba(10,18,14,0.9),rgba(9,12,18,0.9))]"
      :pt="{
        start: { class: 'flex flex-1 items-center' },
        center: {
          class:
            'static mx-auto flex items-center min-w-[220px] transform-none md:absolute md:left-1/2 md:-translate-x-1/2',
        },
        end: { class: 'flex flex-1 items-center justify-end' },
      }"
    >
      <template #start>
        <div class="flex items-center gap-3">
          <Button
            class="text-slate-200 hover:bg-slate-800/70"
            icon="pi pi-bars"
            severity="secondary"
            text
            rounded
            aria-label="Открыть меню"
            @click="toggleSidebar"
          />
        </div>
      </template>

      <template #center>
        <div class="flex flex-col items-center gap-1 text-[11px] text-slate-300">
          <div class="text-[16px] font-semibold tracking-[0.3em] text-white">{{ timeLabel }}</div>
        </div>
      </template>

      <template #end>
        <div class="flex items-center gap-2 text-xs !text-slate-300 md:gap-3">
          <div
            class="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-2 py-1 transition md:px-3"
          >
            <i class="pi pi-bolt text-primary-300"></i>
            <span>Pro trial</span>
          </div>
          <button
            class="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-2 py-1 transition hover:border-slate-700 hover:bg-slate-900/90 md:px-3"
            type="button"
          >
            <i class="pi pi-bell text-primary-300"></i>
            <span>3</span>
          </button>
          <div class="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1">
            <span
              class="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-lime-300 text-[11px] font-semibold text-slate-950"
            >
              {{ initials }}
            </span>
            <span class="max-w-[90px] truncate text-xs text-slate-200 md:max-w-[120px]">
              {{ userLabel }}
            </span>
          </div>
        </div>
      </template>
    </Toolbar>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import { useUiStore } from '@/stores/uiStore'

const userStore = useUserStore()
const uiStore = useUiStore()
const now = ref(new Date())

let timer: number | undefined

onMounted(() => {
  timer = window.setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (timer) window.clearInterval(timer)
})

const timeLabel = computed(() =>
  now.value.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
)

const userLabel = computed(() => userStore.user?.email ?? 'Гость')
const initials = computed(() => (userLabel.value[0] ?? 'G').toUpperCase())

const toggleSidebar = () => uiStore.toggleSidebar()
</script>
