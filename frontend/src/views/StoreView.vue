<template>
  <DefaultLayout class="flex flex-col gap-8">
    <StoreHeader />
    <div class="flex gap-3 mb-5">
      <StoreSettings />
      <StoreStatuses />
    </div>
    <StoreProducts />
  </DefaultLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useStoreStore } from '@/stores/storeStore'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import StoreHeader from '@/components/store/StoreHeader.vue'
import StoreSettings from '@/components/store/StoreSettings.vue'
import StoreStatuses from '@/components/store/StoreStatuses.vue'
import StoreProducts from '@/components/store/StoreProducts.vue'

const store = useStoreStore()
const toast = useToast()

onMounted(async () => {
  try {
    await store.fetchStore()
  } catch {
    toast.add({ severity: 'error', summary: 'Витрина', detail: 'Не удалось загрузить данные', life: 4000 })
  }
})
</script>
