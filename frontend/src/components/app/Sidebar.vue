<template>
  <Sidebar
    v-model:visible="sidebarOpen"
    :modal="mobile"
    :dismissable="mobile"
    :showCloseIcon="mobile"
    class="app-sidebar"
  >
    <aside class="sidebar px-4">
      <!-- Logo Section -->
      <div class="logo">
        <img src="/alwib.png" width="40" alt="Alwib Logo" />
        <div>
          <div class="title">Alwib</div>
          <div class="subtitle">Workspace</div>
        </div>
      </div>

      <!-- Navigation Section -->
      <div class="section">
        <p class="section-title">Навигация</p>
        <RouterLink
          to="/"
          class="menu-item"
          :class="{ active: isRouteActive('/') }"
        >
          <i class="pi pi-home"></i>
          <span>Главная</span>
        </RouterLink>
      </div>

      <!-- Modules Section -->
      <div class="section">
        <p class="section-title">Модули</p>
        <RouterLink
          to="/vpn"
          class="menu-item"
          :class="{ active: isRouteActive('/vpn') }"
        >
          <i class="pi pi-shield"></i>
          <span>VPN</span>
        </RouterLink>
        <RouterLink
          to="/ai"
          class="menu-item"
          :class="{ active: isRouteActive('/ai') }"
        >
          <i class="pi pi-comment"></i>
          <span>ИИ‑ассистенты</span>
        </RouterLink>
        <RouterLink
          to="/downloader"
          class="menu-item"
          :class="{ active: isRouteActive('/downloader') }"
        >
          <i class="pi pi-cloud-download"></i>
          <span>Загрузчик</span>
        </RouterLink>
      </div>

      <!-- Services Section -->
      <div class="section">
        <p class="section-title">Сервисы</p>
        <button class="menu-item muted" type="button" disabled>
          <i class="pi pi-chart-bar"></i>
          <span>TG‑анализатор</span>
          <span class="tag">скоро</span>
        </button>
        <button class="menu-item muted" type="button" disabled>
          <i class="pi pi-send"></i>
          <span>Автопубликации</span>
          <span class="tag">скоро</span>
        </button>
      </div>

      <!-- Logout Section -->
      <div class="exit">
        <button @click="handleLogout" class="menu-item logout-btn w-full" type="button">
          <i class="pi pi-sign-out"></i>
          <span>Выйти</span>
        </button>
      </div>
    </aside>
  </Sidebar>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { useRouter, useRoute } from 'vue-router'
import Sidebar from 'primevue/sidebar'
import { useUiStore } from '@/stores/uiStore'
import { storeToRefs } from 'pinia'
import { useBreakpoints } from '@/composables/useBreakpoints'

const { logout } = useAuth()
const router = useRouter()
const route = useRoute()
const uiStore = useUiStore()
const { sidebarOpen } = storeToRefs(uiStore)
const { mobile } = useBreakpoints()

const isRouteActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const handleLogout = async () => {
  await logout()
  router.push('/auth')
}
</script>

<style lang="scss" scoped>
:deep(.p-sidebar) {
  @apply border-r border-slate-900 bg-slate-950;
  width: 260px;
}

:deep(.p-sidebar-content) {
  padding: 0;
}

.sidebar {
  @apply flex h-screen flex-col py-6;
  background: radial-gradient(circle at top, rgba(30, 58, 138, 0.12), transparent 55%);
}

.logo {
  @apply mb-6 flex items-center gap-3 border-b border-slate-800/80 pb-5;

  .title {
    @apply text-base font-semibold text-white;
  }

  .subtitle {
    @apply text-xs uppercase tracking-[0.2em] text-slate-400;
  }
}

.section {
  @apply mb-6 flex flex-col gap-2;
}

.section-title {
  @apply text-xs uppercase tracking-[0.3em] text-slate-500;
  margin-top: 4px;
}

.menu-item {
  @apply flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-sm text-slate-200 transition leading-5;

  i {
    @apply text-lg text-slate-400;
    min-width: 20px;
  }

  &:hover {
    @apply border-slate-800 bg-slate-900/70 text-white;

    i {
      @apply text-primary-300;
    }
  }

  &.active {
    @apply border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 shadow-lg shadow-black/40 text-white;

    i {
      @apply text-primary-400;
    }
  }
}

.muted {
  @apply cursor-not-allowed opacity-60;
}

.tag {
  @apply ml-auto rounded-full border border-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-widest text-slate-400;
}

.exit {
  @apply mt-auto;

  .logout-btn {
    @apply cursor-pointer text-slate-300;

    &:hover {
      i {
        @apply text-red-400;
      }
    }
  }
}
</style>
