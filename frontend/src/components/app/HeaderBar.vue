<template>
  <header class="sticky top-0 z-20 px-4 pt-4 md:px-8">
    <Toolbar
        class="relative flex flex-row items-center min-h-[52px]
              rounded-2xl border border-slate-800/70
              bg-slate-950/80 px-4 py-2
              shadow-lg shadow-black/30 backdrop-blur
              [background-image:linear-gradient(120deg,rgba(10,18,14,0.9),rgba(9,12,18,0.9))]"
        :pt="{
          root: { class: 'flex flex-row items-center' },
          start: { class: 'flex items-center' },
          center: {
            class:
              'flex items-center justify-center flex-1 md:absolute md:left-1/2 md:-translate-x-1/2',
          },
          end: { class: 'flex items-center justify-end' },
        }"
      >

      <template #start>
        <Button
          class="text-slate-200 hover:bg-slate-800/70"
          icon="pi pi-bars"
          severity="secondary"
          text
          rounded
          aria-label="Открыть меню"
          @click="toggleSidebar"
        />
      </template>

      <template #center>
        <div class="flex flex-col items-center text-[11px] text-slate-300">
          <div class="text-[16px] font-semibold tracking-[0.3em] text-white">
            {{ timeLabel }}
          </div>
        </div>
      </template>

      <template #end>
        <div class="hidden md:flex items-center gap-3 text-xs text-slate-300">
          <div
            class="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1"
          >
            <i class="pi pi-bolt text-primary-300"></i>
            <span>Pro trial</span>
          </div>

          <button
            class="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1"
          >
            <i class="pi pi-bell text-primary-300"></i>
            <span>3</span>
          </button>

          <div
            class="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1"
          >
            <span
              class="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-lime-300 text-[11px] font-semibold text-slate-950"
            >
              {{ initials }}
            </span>
            <span class="max-w-[120px] truncate text-xs text-slate-200">
              {{ userLabel }}
            </span>
          </div>
        </div>

        <div class="md:hidden relative">
          <button
            class="flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-slate-900/80"
            @click="isProfileOpen = !isProfileOpen"
          >
            <span
              class="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-lime-300 text-[11px] font-semibold text-slate-950"
            >
              {{ initials }}
            </span>
          </button>

          <transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-2"
          >
            <div
              v-if="isProfileOpen"
              class="absolute right-0 top-12 w-56 rounded-xl border border-slate-800 bg-slate-950/95 p-3 shadow-xl backdrop-blur"
            >
              <div class="mb-3 flex items-center gap-2">
                <span
                  class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-lime-300 text-sm font-semibold text-slate-950"
                >
                  {{ initials }}
                </span>
                <span class="truncate text-xs text-slate-200">
                  {{ userLabel }}
                </span>
              </div>

              <div
                class="mb-2 flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-xs text-slate-300"
              >
                <i class="pi pi-bolt text-primary-300"></i>
                <span>Pro trial активен</span>
              </div>

              <div
                class="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-xs text-slate-300"
              >
                <i class="pi pi-bell text-primary-300"></i>
                <span>Уведомлений: 3</span>
              </div>
            </div>
          </transition>
        </div>
      </template>
    </Toolbar>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import { useUserStore } from '@/stores/userStore'
import { useUiStore } from '@/stores/uiStore'

const userStore = useUserStore()
const uiStore = useUiStore()

const now = ref(new Date())
const isProfileOpen = ref(false)

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
  now.value.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
)

const userLabel = computed(() => userStore.user?.email ?? 'Гость')
const initials = computed(() => (userLabel.value[0] ?? 'G').toUpperCase())

const toggleSidebar = () => uiStore.toggleSidebar()
</script>
