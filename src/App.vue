<template>
  <Sidebar v-if="route.path !== '/auth'" />
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" />
    </transition>
  </router-view>
  <Toast />
</template>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'

import Toast from 'primevue/toast'
import Sidebar from './components/app/Sidebar.vue'

const route = useRoute()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
