import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as svc from '@/services/storeService'
import type { Product, ProductStatus, Store } from '@/types/store'

export const useStoreStore = defineStore('store', () => {
  const store = ref<Store | null>(null)
  const isLoading = ref(false)

  async function fetchStore() {
    isLoading.value = true
    try {
      store.value = await svc.getStore()
    } finally {
      isLoading.value = false
    }
  }

  async function upsertStore(data: { name?: string; logoUrl?: string; whatsapp?: string; telegram?: string }) {
    const result = await svc.upsertStore(data)
    store.value = result
    return result
  }

  async function togglePublish() {
    const result = await svc.togglePublish()
    if (store.value) {
      store.value.isPublished = result.isPublished
    }
    return result
  }

  // ─── Products ──────────────────────────────────────────────────────────────

  async function createProduct(data: {
    name: string
    description?: string
    price: number
    imageUrl?: string
    statusId?: number
    messenger?: string | null
  }) {
    const product = await svc.createProduct(data)
    store.value?.products.push(product)
    return product
  }

  async function updateProduct(
    id: number,
    data: Partial<{
      name: string
      description: string
      price: number
      imageUrl: string
      statusId: number | null
      messenger: string | null
    }>,
  ) {
    const updated = await svc.updateProduct(id, data)
    if (store.value) {
      const idx = store.value.products.findIndex((p) => p.id === id)
      if (idx !== -1) store.value.products[idx] = updated
    }
    return updated
  }

  async function deleteProduct(id: number) {
    await svc.deleteProduct(id)
    if (store.value) {
      store.value.products = store.value.products.filter((p) => p.id !== id)
    }
  }

  // ─── Statuses ──────────────────────────────────────────────────────────────

  async function createStatus(data: { label: string; severity: string }) {
    const status = await svc.createStatus(data)
    store.value?.statuses.push(status as ProductStatus)
    return status
  }

  async function deleteStatus(id: number) {
    await svc.deleteStatus(id)
    if (store.value) {
      store.value.statuses = store.value.statuses.filter((s) => s.id !== id)
      // Обнуляем statusId у товаров с удалённым статусом
      store.value.products = store.value.products.map((p) =>
        p.statusId === id ? { ...p, statusId: null, status: null } : p,
      )
    }
  }

  return {
    store,
    isLoading,
    fetchStore,
    upsertStore,
    togglePublish,
    createProduct,
    updateProduct,
    deleteProduct,
    createStatus,
    deleteStatus,
  }
})
