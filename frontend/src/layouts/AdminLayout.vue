<template>
  <div class="admin-layout flex h-screen flex-col bg-slate-950 text-white">
    <!-- Header -->
    <Header />

    <!-- Main Content -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <Sidebar v-if="showSidebar" />

      <!-- Content Area -->
      <main
        :class="[
          'flex-1 overflow-auto transition-all duration-300',
          showSidebar && sidebarOpen ? 'lg:ml-0' : '',
        ]"
      >
        <div class="content-wrapper">
          <slot />
        </div>
      </main>
    </div>

    <!-- Toast Notifications -->
    <Toast position="bottom-right" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Toast from 'primevue/toast'
import Header from '@/components/app/Header.vue'
import Sidebar from '@/components/app/Sidebar.vue'
import { useUserStore } from '@/stores/userStore'
import { useUiStore } from '@/stores/uiStore'
import { storeToRefs } from 'pinia'

const route = useRoute()
const userStore = useUserStore()
const uiStore = useUiStore()
const { sidebarOpen } = storeToRefs(uiStore)

const showSidebar = computed(
  () => route.path !== '/auth' && route.path !== '/preload' && userStore.isAuthenticated
)
</script>

<style lang="scss" scoped>
.admin-layout {
  overflow: hidden;
}

.content-wrapper {
  @apply h-full bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900;
  background: radial-gradient(
    ellipse 200% 100% at 50% 0%,
    rgba(30, 58, 138, 0.15),
    transparent 70%
  );
}
</style>
