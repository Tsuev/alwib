<template>
  <header :class="header()">
    <Toolbar
      :class="toolbar()"
      :pt="{
        root: { class: toolbarRoot() },
        start: { class: toolbarStart() },
        center: { class: toolbarCenter() },
        end: { class: toolbarEnd() },
      }"
    >
      <template #start>
        <Button
          :class="menuButton()"
          icon="pi pi-bars"
          severity="secondary"
          text
          rounded
          aria-label="Открыть меню"
          @click="toggleSidebar"
        />
      </template>

      <template #center>
        <div :class="centerWrap()">
          <div :class="timeLabelClass()">
            {{ timeText }}
          </div>
        </div>
      </template>

      <template #end>
        <div :class="desktopWrap()">
          <div :class="chip()">
            <i :class="chipIconBolt()" aria-hidden="true"></i>
            <span>Pro trial</span>
          </div>

          <button :class="chipButton()">
            <i :class="chipIconBell()" aria-hidden="true"></i>
            <span>3</span>
          </button>

          <div :class="profileChip()">
            <span :class="avatarSmall()">
              {{ initials }}
            </span>
            <span :class="userLabelClass()">
              {{ userText }}
            </span>
          </div>
        </div>

        <div :class="mobileWrap()">
          <button :class="mobileButton()" @click="isProfileOpen = !isProfileOpen">
            <span :class="avatarSmall()">
              {{ initials }}
            </span>
          </button>

          <transition
            :enter-active-class="transitionEnterActive()"
            :enter-from-class="transitionEnterFrom()"
            :enter-to-class="transitionEnterTo()"
            :leave-active-class="transitionLeaveActive()"
            :leave-from-class="transitionLeaveFrom()"
            :leave-to-class="transitionLeaveTo()"
          >
            <div v-if="isProfileOpen" :class="profileMenu()">
              <div :class="profileHeader()">
                <span :class="avatarLarge()">
                  {{ initials }}
                </span>
                <span :class="userLabelSmall()">
                  {{ userText }}
                </span>
              </div>

              <div :class="profileItem()">
                <i :class="chipIconBolt()" aria-hidden="true"></i>
                <span>Pro trial активен</span>
              </div>

              <div :class="profileItem()">
                <i :class="chipIconBell()" aria-hidden="true"></i>
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
import { tv } from 'tailwind-variants'

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

const timeText = computed(() =>
  now.value.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }),
)

const userText = computed(() => userStore.user?.email ?? 'Гость')
const initials = computed(() => (userText.value[0] ?? 'G').toUpperCase())

const toggleSidebar = () => uiStore.toggleSidebar()

const styles = tv({
  slots: {
    header: ['sticky top-0 z-20 px-4 pt-4 md:px-8'],
    toolbar: [
      'relative flex flex-row items-center min-h-[52px] rounded-2xl border',
      'border-slate-800/70 bg-slate-950/80 px-4 py-2 shadow-lg',
      'shadow-black/30 backdrop-blur',
      '[background-image:linear-gradient(120deg,rgba(10,18,14,0.9),rgba(9,12,18,0.9))]',
    ],
    toolbarRoot: ['flex flex-row items-center'],
    toolbarStart: ['flex items-center'],
    toolbarCenter: [
      'flex items-center justify-center flex-1 md:absolute md:left-1/2 md:-translate-x-1/2',
    ],
    toolbarEnd: ['flex items-center justify-end'],
    menuButton: ['text-slate-200 hover:bg-slate-800/70'],
    centerWrap: ['flex flex-col items-center text-[11px] text-slate-300'],
    timeLabel: ['text-[16px] font-semibold tracking-[0.3em] text-white'],
    desktopWrap: ['hidden md:flex items-center gap-3 text-xs text-slate-300'],
    chip: [
      'flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1',
    ],
    chipButton: [
      'flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1',
    ],
    chipIconBolt: ['pi pi-bolt text-primary-300'],
    chipIconBell: ['pi pi-bell text-primary-300'],
    profileChip: [
      'flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1',
    ],
    avatarSmall: [
      'flex h-6 w-6 items-center justify-center rounded-full',
      'bg-gradient-to-br from-emerald-400 to-lime-300 text-[11px] font-semibold text-slate-950',
    ],
    userLabel: ['max-w-[120px] truncate text-xs text-slate-200'],
    mobileWrap: ['md:hidden relative'],
    mobileButton: [
      'flex h-9 w-9 items-center justify-center rounded-full border',
      'border-slate-800 bg-slate-900/80',
    ],
    transitionEnterActive: ['transition ease-out duration-200'],
    transitionEnterFrom: ['opacity-0 translate-y-2'],
    transitionEnterTo: ['opacity-100 translate-y-0'],
    transitionLeaveActive: ['transition ease-in duration-150'],
    transitionLeaveFrom: ['opacity-100 translate-y-0'],
    transitionLeaveTo: ['opacity-0 translate-y-2'],
    profileMenu: [
      'absolute right-0 top-12 w-56 rounded-xl border border-slate-800',
      'bg-slate-950/95 p-3 shadow-xl backdrop-blur space-y-2',
    ],
    profileHeader: ['mb-3 flex items-center gap-2'],
    avatarLarge: [
      'flex h-8 w-8 items-center justify-center rounded-full',
      'bg-gradient-to-br from-emerald-400 to-lime-300 text-sm font-semibold text-slate-950',
    ],
    userLabelSmall: ['truncate text-xs text-slate-200'],
    profileItem: [
      'flex items-center gap-2 rounded-lg border border-slate-800',
      'bg-slate-900/70 px-3 py-2 text-xs text-slate-300',
    ],
  },
})

const {
  header,
  toolbar,
  toolbarRoot,
  toolbarStart,
  toolbarCenter,
  toolbarEnd,
  menuButton,
  centerWrap,
  timeLabel: timeLabelClass,
  desktopWrap,
  chip,
  chipButton,
  chipIconBolt,
  chipIconBell,
  profileChip,
  avatarSmall,
  userLabel: userLabelClass,
  mobileWrap,
  mobileButton,
  transitionEnterActive,
  transitionEnterFrom,
  transitionEnterTo,
  transitionLeaveActive,
  transitionLeaveFrom,
  transitionLeaveTo,
  profileMenu,
  profileHeader,
  avatarLarge,
  userLabelSmall,
  profileItem,
} = styles()
</script>
