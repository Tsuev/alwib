<template>
  <header class="header-bar px-4 md:px-8">
    <Toolbar class="header-toolbar">
      <template #start>
        <div class="left-group">
          <Button
            class="menu-btn"
            icon="pi pi-bars"
            severity="secondary"
            text
            rounded
            aria-label="Открыть меню"
            @click="toggleSidebar"
          />
          <div class="window-dots">
            <span class="dot bg-red-400"></span>
            <span class="dot bg-yellow-400"></span>
            <span class="dot bg-green-400"></span>
          </div>
        </div>
      </template>

      <template #center>
        <div class="center-info">
          <div class="balance">
            <i class="pi pi-wallet"></i>
            <span>{{ balanceLabel }}</span>
          </div>
          <div class="time">{{ timeLabel }}</div>
        </div>
      </template>

      <template #end>
        <div class="right-info">
          <div class="chip">
            <i class="pi pi-bolt"></i>
            <span>Pro trial</span>
          </div>
          <button class="chip ghost" type="button">
            <i class="pi pi-bell"></i>
            <span>3</span>
          </button>
          <div class="user">
            <span class="avatar">{{ initials }}</span>
            <span class="user-name">{{ userLabel }}</span>
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

const balanceLabel = computed(() => 'Баланс: 1 240 ₽')
const toggleSidebar = () => uiStore.toggleSidebar()
</script>

<style lang="scss" scoped>
.header-bar {
  @apply sticky top-0 z-20 pt-4;
}

.header-toolbar {
  @apply relative rounded-2xl border border-slate-800/70 bg-slate-950/80 px-4 py-2 shadow-lg shadow-black/30 backdrop-blur;
  background-image: linear-gradient(120deg, rgba(10, 18, 14, 0.9), rgba(9, 12, 18, 0.9));
  min-height: 52px;
}

:deep(.p-toolbar-start),
:deep(.p-toolbar-center),
:deep(.p-toolbar-end) {
  @apply flex items-center;
}

:deep(.p-toolbar-start) {
  @apply flex-1;
}

:deep(.p-toolbar-end) {
  @apply flex-1 justify-end;
}

:deep(.p-toolbar-center) {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  min-width: 220px;
}

.header-toolbar :deep(.p-button.p-button-text) {
  @apply hover:bg-slate-800/70;
}

.left-group {
  @apply flex items-center gap-3;
}

.menu-btn {
  @apply text-slate-200;
}

.window-dots {
  @apply flex items-center gap-2;

  .dot {
    @apply h-3 w-3 rounded-full shadow-inner;
  }
}

.center-info {
  @apply flex flex-col items-center gap-1 text-[11px] text-slate-300;

  .balance {
    @apply flex items-center gap-2 text-slate-200;

    i {
      @apply text-primary-400;
    }
  }

  .time {
    @apply text-sm font-semibold tracking-[0.3em] text-white;
  }
}

.right-info {
  @apply flex items-center gap-3 text-xs text-slate-300;

  .chip {
    @apply flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 transition;

    i {
      @apply text-primary-300;
    }
  }

  .ghost {
    @apply hover:border-slate-700 hover:bg-slate-900/90;
  }

  .user {
    @apply flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-2 py-1;
  }

  .avatar {
    @apply flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-lime-300 text-[11px] font-semibold text-slate-950;
  }

  .user-name {
    @apply max-w-[120px] truncate text-xs text-slate-200;
  }
}

@media (max-width: 768px) {
  :deep(.p-toolbar-center) {
    position: static;
    transform: none;
    margin-left: auto;
    margin-right: auto;
  }

  .right-info {
    @apply gap-2;

    .chip {
      @apply px-2;
    }

    .user-name {
      @apply max-w-[90px];
    }
  }
}
</style>
