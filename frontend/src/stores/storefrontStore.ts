import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as svc from '@/services/storefrontService'
import type { Product, ProductStatus, Storefront } from '@/types/store'

export const useStorefrontStore = defineStore('storefront', () => {
  const storefront = ref<Storefront | null>(null)
  const isLoading = ref(false)

  async function fetchStorefront() {
    isLoading.value = true
    try {
      storefront.value = await svc.getStorefront()
    } finally {
      isLoading.value = false
    }
  }

  async function upsertStorefront(data: { name?: string; logoUrl?: string }) {
    const result = await svc.upsertStorefront(data)
    storefront.value = result
    return result
  }

  async function togglePublish() {
    const result = await svc.togglePublish()
    if (storefront.value) {
      storefront.value.isPublished = result.isPublished
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
  }) {
    const product = await svc.createProduct(data)
    storefront.value?.products.push(product)
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
    }>,
  ) {
    const updated = await svc.updateProduct(id, data)
    if (storefront.value) {
      const idx = storefront.value.products.findIndex((p) => p.id === id)
      if (idx !== -1) storefront.value.products[idx] = updated
    }
    return updated
  }

  async function deleteProduct(id: number) {
    await svc.deleteProduct(id)
    if (storefront.value) {
      storefront.value.products = storefront.value.products.filter((p) => p.id !== id)
    }
  }

  // ─── Statuses ──────────────────────────────────────────────────────────────

  async function createStatus(data: { label: string; severity: string }) {
    const status = await svc.createStatus(data)
    storefront.value?.statuses.push(status as ProductStatus)
    return status
  }

  async function deleteStatus(id: number) {
    await svc.deleteStatus(id)
    if (storefront.value) {
      storefront.value.statuses = storefront.value.statuses.filter((s) => s.id !== id)
      // Обнуляем statusId у товаров с удалённым статусом
      storefront.value.products = storefront.value.products.map((p) =>
        p.statusId === id ? { ...p, statusId: null, status: null } : p,
      )
    }
  }

  return {
    storefront,
    isLoading,
    fetchStorefront,
    upsertStorefront,
    togglePublish,
    createProduct,
    updateProduct,
    deleteProduct,
    createStatus,
    deleteStatus,
  }
})
