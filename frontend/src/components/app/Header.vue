<template>
  <header class="app-header">
    <!-- Left: Sidebar Toggle -->
    <div class="header-left">
      <button
        @click="toggleSidebar"
        class="sidebar-toggle"
        type="button"
        aria-label="Toggle sidebar"
      >
        <i class="pi" :class="sidebarOpen ? 'pi-align-left' : 'pi-align-left'"></i>
      </button>
    </div>

    <!-- Center: Time & Balance -->
    <div class="header-center">
      <div class="time-balance">
        <div class="time">{{ currentTime }}</div>
        <div class="separator">•</div>
        <div class="balance">
          <i class="pi pi-wallet"></i>
          <span>{{ balance }} ₽</span>
        </div>
      </div>
    </div>

    <!-- Right: User Menu -->
    <div class="header-right">
      <Menu :model="menuItems" :popup="true" ref="menu">
        <template #start>
          <button class="user-button" @click="toggleMenu" type="button">
            <Avatar :label="userInitials" :style="{ backgroundColor: '#3b82f6' }" shape="circle" />
            <div class="user-info">
              <div class="username">{{ username }}</div>
              <div class="email">{{ userEmail }}</div>
            </div>
            <i class="pi pi-chevron-down"></i>
          </button>
        </template>
      </Menu>

      <!-- Notifications -->
      <button class="notification-btn" type="button">
        <i class="pi pi-bell"></i>
        <span class="notification-badge">3</span>
      </button>

      <!-- Settings -->
      <Button
        icon="pi pi-cog"
        severity="secondary"
        text
        rounded
        @click="openSettings"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useUiStore } from '@/stores/uiStore'
import { storeToRefs } from 'pinia'
import Menu from 'primevue/menu'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'

const userStore = useUserStore()
const uiStore = useUiStore()
const { sidebarOpen } = storeToRefs(uiStore)
const { logout } = useAuth()
const router = useRouter()
const toast = useToast()
const menu = ref()

const currentTime = ref('00:00')
const balance = ref(1250.50)

const username = computed(() => userStore.user?.username || 'User')
const userEmail = computed(() => userStore.user?.email || 'user@example.com')
const userInitials = computed(() => {
  const name = userStore.user?.username || userStore.user?.email || 'U'
  return name
    .split(' ')
    .map((word: string) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const menuItems = ref([
  {
    label: 'Профиль',
    icon: 'pi pi-user',
    command: () => router.push('/profile'),
  },
  {
    label: 'Настройки',
    icon: 'pi pi-cog',
    command: () => openSettings(),
  },
  {
    separator: true,
  },
  {
    label: 'Документация',
    icon: 'pi pi-book',
    command: () => window.open('/docs', '_blank'),
  },
  {
    label: 'Помощь',
    icon: 'pi pi-question-circle',
    command: () => {
      toast.add({
        severity: 'info',
        summary: 'Справка',
        detail: 'Свяжитесь с поддержкой: support@alwib.com',
        life: 3000,
      })
    },
  },
  {
    separator: true,
  },
  {
    label: 'Выйти',
    icon: 'pi pi-sign-out',
    command: () => handleLogout(),
  },
])

const toggleSidebar = () => {
  uiStore.toggleSidebar()
}

const toggleMenu = (event: Event) => {
  menu.value?.toggle(event)
}

const openSettings = () => {
  menu.value?.hide()
  toast.add({
    severity: 'info',
    summary: 'Настройки',
    detail: 'Открыть страницу настроек',
    life: 2000,
  })
}

const handleLogout = async () => {
  await logout()
  router.push('/auth')
}

const updateTime = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  currentTime.value = `${hours}:${minutes}`
}

onMounted(() => {
  updateTime()
  const interval = setInterval(updateTime, 60000)
  onUnmounted(() => clearInterval(interval))
})
</script>

<style lang="scss" scoped>
.app-header {
  @apply flex h-16 items-center justify-between border-b border-slate-900 bg-slate-950/50 px-6 backdrop-blur-md;
  gap: 16px;
}

.header-left {
  @apply flex items-center gap-2;
}

.sidebar-toggle {
  @apply rounded-lg p-2 text-slate-400 transition hover:bg-slate-900 hover:text-slate-200;
  border: 1px solid transparent;

  i {
    @apply text-lg;
  }
}

.header-center {
  @apply flex flex-1 items-center justify-center;
}

.time-balance {
  @apply flex items-center gap-2 rounded-lg border border-slate-800/50 bg-slate-900/30 px-4 py-2 text-sm text-slate-300;

  .time {
    @apply font-semibold text-slate-100;
    font-variant-numeric: tabular-nums;
  }

  .separator {
    @apply text-slate-700;
  }

  .balance {
    @apply flex items-center gap-1.5;

    i {
      @apply text-primary-400;
    }
  }
}

.header-right {
  @apply flex items-center gap-3;
}

.user-button {
  @apply flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 transition hover:border-slate-700 hover:bg-slate-900;
  cursor: pointer;

  .user-info {
    @apply flex flex-col text-left;

    .username {
      @apply text-sm font-medium text-white;
    }

    .email {
      @apply text-xs text-slate-400;
    }
  }

  i {
    @apply text-slate-400;
  }

  &:hover {
    .user-info .username {
      @apply text-slate-100;
    }
  }
}

.notification-btn {
  @apply relative rounded-lg p-2 text-slate-400 transition hover:bg-slate-900 hover:text-slate-200;
  border: 1px solid transparent;
  cursor: pointer;

  i {
    @apply text-lg;
  }

  .notification-badge {
    @apply absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white;
  }

  &:hover {
    .notification-badge {
      @apply bg-red-600;
    }
  }
}

:deep(.p-avatar) {
  @apply h-8 w-8;
}

:deep(.p-menu) {
  @apply border-slate-800 bg-slate-900;
  min-width: 200px;

  .p-menu-list {
    @apply gap-1;
  }

  .p-menuitem {
    @apply rounded-md;

    &:hover {
      @apply bg-slate-800;
    }
  }

  .p-menuitem-link {
    @apply text-slate-200;

    .p-menuitem-icon {
      @apply text-slate-400;
    }

    &:hover {
      @apply text-white;

      .p-menuitem-icon {
        @apply text-primary-400;
      }
    }
  }

  .p-menuitem-separator {
    @apply border-slate-800;
  }
}
</style>
