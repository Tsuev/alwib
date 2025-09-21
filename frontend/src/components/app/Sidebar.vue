<template>
  <div class="sidebar px-3">
    <div class="logo pt-2 pb-5 mb-5">
      <img src="/alwib.png" width="54" />
    </div>
    <div class="nav flex flex-col gap-2">
      <RouterLink to="/" class="menu-item" v-tooltip.right="'Главная'">
        <i class="pi pi-home text-gray-500" style="font-size: 1.5rem"></i>
      </RouterLink>

      <RouterLink to="/vpn" class="menu-item" v-tooltip.right="'VPN'">
        <i class="pi pi-globe text-gray-500" style="font-size: 1.5rem"></i>
      </RouterLink>

      <RouterLink to="/ai" class="menu-item" v-tooltip.right="'ИИ-ассистенты'">
        <i class="pi pi-microchip-ai text-gray-500" style="font-size: 1.5rem"></i>
      </RouterLink>

      <RouterLink to="/downloader" class="menu-item" v-tooltip.right="'Загрузчик'">
        <i class="pi pi-download text-gray-500" style="font-size: 1.5rem"></i>
      </RouterLink>
    </div>

    <!-- Информация о пользователе и кнопка выхода -->
    <div class="user-section mt-auto mb-3">
      <div
        v-if="user"
        class="user-info mb-2 p-2 rounded"
        style="background-color: var(--p-surface-800)"
      >
        <div class="text-sm text-gray-300">{{ user.email }}</div>
        <div class="text-xs text-gray-500">{{ user.role }}</div>
      </div>
      <button
        @click="handleLogout"
        class="menu-item logout-btn"
        v-tooltip.right="'Выйти'"
        style="width: 100%; justify-content: center"
      >
        <i class="pi pi-sign-out text-gray-500" style="font-size: 1.5rem"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const { user, logout } = useAuth()
const router = useRouter()

const handleLogout = async () => {
  await logout()
  router.push('/auth')
}
</script>

<style lang="scss" scoped>
.sidebar {
  background-color: var(--p-surface-900);
  display: flex;
  flex-direction: column;
  height: 100vh;

  .logo {
    border-bottom: 1px solid var(--p-surface-800);
  }

  .nav {
    .menu-item {
      padding: 12px;
      cursor: pointer;
      border-radius: 5px;
      width: 48px;
      height: 48px;
      transition-duration: 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: none;

      &:hover {
        transition-duration: 0.3s;
        background-color: var(--p-surface-800);
        i {
          color: var(--p-white-100);
        }
      }
    }
  }

  .user-section {
    .logout-btn {
      width: 100% !important;
      height: 48px;
    }
  }
}

.router-link-exact-active {
  background: #000000;
  background: linear-gradient(135deg, #2c3e50, #1a1a2e);
  box-shadow:
    3px 3px 5px rgba(0, 0, 0, 0.3),
    inset -2px -2px 4px rgba(0, 0, 0, 0.5);
  i {
    color: var(--p-primary-500);
  }
}
</style>
