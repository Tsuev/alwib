<template>
  <div class="sidebar px-3">
    <div class="logo mb-5 flex items-center gap-3 border-b border-slate-800 pb-5 pt-2">
      <img src="/alwib.png" width="42" />
      <div class="text-sm font-semibold text-slate-200">Alwib Workspace</div>
    </div>
    <div class="nav flex flex-col gap-2">
      <RouterLink to="/" class="menu-item" v-tooltip.right="'Главная'">
        <i class="pi pi-home text-2xl text-slate-400"></i>
      </RouterLink>

      <RouterLink to="/vpn" class="menu-item" v-tooltip.right="'VPN'">
        <i class="pi pi-globe text-2xl text-slate-400"></i>
      </RouterLink>

      <RouterLink to="/ai" class="menu-item" v-tooltip.right="'ИИ-ассистенты'">
        <i class="pi pi-microchip-ai text-2xl text-slate-400"></i>
      </RouterLink>

      <RouterLink to="/downloader" class="menu-item" v-tooltip.right="'Загрузчик'">
        <i class="pi pi-download text-2xl text-slate-400"></i>
      </RouterLink>
    </div>

    <div class="exit">
      <button
        @click="handleLogout"
        class="menu-item logout-btn w-full justify-center"
        v-tooltip.right="'Выйти'"
      >
        <i class="pi pi-sign-out text-2xl text-slate-400"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const { logout } = useAuth()
const router = useRouter()

const handleLogout = async () => {
  await logout()
  router.push('/auth')
}
</script>

<style lang="scss" scoped>
.sidebar {
  @apply flex h-screen flex-col bg-slate-950;
}

.nav {
  .menu-item {
    @apply flex h-12 w-12 items-center justify-center rounded-md border-none bg-transparent p-3 transition duration-300;

    &:hover {
      @apply bg-slate-800;

      i {
        @apply text-white;
      }
    }
  }
}

.exit {
  @apply mt-auto mb-6;

  .logout-btn {
    @apply cursor-pointer;

    &:hover {
      i {
        @apply text-red-400;
      }
    }
  }
}

.router-link-exact-active {
  @apply bg-gradient-to-br from-slate-700 to-slate-900 shadow-lg shadow-black/40;

  i {
    @apply text-primary-400;
  }
}
</style>
