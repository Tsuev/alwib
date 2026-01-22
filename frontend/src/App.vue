<template>
  <div class="app-shell">
    <AdminLayout>
      <RouterView />
    </AdminLayout>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { useAuth } from '@/composables/useAuth'

const { initializeAuth } = useAuth()

onMounted(() => {
  initializeAuth()
})
</script>
