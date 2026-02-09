<template>
  <div class="app-shell flex min-h-screen bg-slate-950 text-white">
    <Sidebar v-if="showSidebar" />
    <main
      :class="[
        'w-full flex-1 min-w-0',
        showSidebar && uiStore.sidebarOpen ? 'lg:pl-[260px]' : '',
      ]"
    >
      <RouterView />
    </main>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterView, useRoute } from 'vue-router'

import Toast from 'primevue/toast'
import Sidebar from './components/app/Sidebar.vue'
import { useUserStore } from '@/stores/userStore'
import { useAuth } from '@/composables/useAuth'
import { useUiStore } from '@/stores/uiStore'

const route = useRoute()
const userStore = useUserStore()
const { initializeAuth } = useAuth()
const uiStore = useUiStore()

const showSidebar = computed(
  () => route.path !== '/auth' && route.path !== '/preload' && userStore.isAuthenticated
)

onMounted(() => {
  initializeAuth()
})
</script>
