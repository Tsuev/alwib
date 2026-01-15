<template>
  <div class="app-shell min-h-screen bg-slate-950 text-white">
    <Sidebar v-if="showSidebar" />
    <main :class="['w-full', showSidebar ? 'ml-0 md:ml-[110px]' : '']">
      <RouterView />
    </main>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'

import Toast from 'primevue/toast'
import Sidebar from './components/app/Sidebar.vue'
import { useUserStore } from '@/stores/userStore'

const route = useRoute()
const userStore = useUserStore()

const showSidebar = computed(() => route.path !== '/auth' && userStore.isAuthenticated)
</script>
