<template>
  <section class="flex items-start justify-between gap-4 flex-wrap mb-5">
    <div class="flex items-start gap-4">
      <i class="pi pi-store text-primary-400 text-3xl"></i>
      <div>
        <h1 class="text-3xl font-semibold text-white">Конструктор витрин</h1>
        <p class="text-slate-400 text-sm mt-1">Настройте магазин, добавьте товары и опубликуйте витрину.</p>
      </div>
    </div>
    <Button
      :label="store.store?.isPublished ? 'Снять с публикации' : 'Опубликовать'"
      :icon="store.store?.isPublished ? 'pi pi-eye-slash' : 'pi pi-send'"
      :severity="store.store?.isPublished ? 'danger' : 'success'"
      :disabled="!store.store?.name"
      :loading="publishLoading"
      @click="handleTogglePublish"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import { useStoreStore } from '@/stores/storeStore'

const store = useStoreStore()
const toast = useToast()
const publishLoading = ref(false)

const handleTogglePublish = async () => {
  publishLoading.value = true
  try {
    await store.togglePublish()
    toast.add({
      severity: 'success',
      summary: 'Витрина',
      detail: store.store?.isPublished ? 'Опубликовано' : 'Снято с публикации',
      life: 3000,
    })
  } catch {
    toast.add({ severity: 'error', summary: 'Витрина', detail: 'Ошибка публикации', life: 4000 })
  } finally {
    publishLoading.value = false
  }
}
</script>
