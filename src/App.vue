<template>
  <Sidebar v-if="route.path !== '/auth'" />
  <RouterView />
  <Toast />
</template>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'

import Toast from 'primevue/toast'
import Sidebar from './components/app/Sidebar.vue'

const route = useRoute()
</script>

<style scoped></style>
