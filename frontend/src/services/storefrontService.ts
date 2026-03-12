import axios from '@/plugins/axios'
import type { Product, ProductStatus, Storefront } from '@/types/store'

export const getStorefront = async (): Promise<Storefront | null> => {
  const response = await axios.get<Storefront | null>('/store', {
    withCredentials: true,
  })
  return response.data
}

export const upsertStorefront = async (data: {
  name?: string
  logoUrl?: string
}): Promise<Storefront> => {
  const response = await axios.put<Storefront>('/store', data, {
    withCredentials: true,
  })
  return response.data
}

export const togglePublish = async (): Promise<{ isPublished: boolean }> => {
  const response = await axios.post<{ isPublished: boolean }>(
    '/store/publish',
    {},
    { withCredentials: true },
  )
  return response.data
}

export const uploadImage = async (file: File): Promise<{ url: string }> => {
  const form = new FormData()
  form.append('file', file)
  const response = await axios.post<{ url: string }>('/store/upload', form, {
    withCredentials: true,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

// ─── Products ───────────────────────────────────────────────────────────────

export const getProducts = async (): Promise<Product[]> => {
  const response = await axios.get<Product[]>('/store/products', {
    withCredentials: true,
  })
  return response.data
}

export const createProduct = async (data: {
  name: string
  description?: string
  price: number
  imageUrl?: string
  statusId?: number
}): Promise<Product> => {
  const response = await axios.post<Product>('/store/products', data, {
    withCredentials: true,
  })
  return response.data
}

export const updateProduct = async (
  id: number,
  data: Partial<{
    name: string
    description: string
    price: number
    imageUrl: string
    statusId: number | null
  }>,
): Promise<Product> => {
  const response = await axios.patch<Product>(`/store/products/${id}`, data, {
    withCredentials: true,
  })
  return response.data
}

export const deleteProduct = async (id: number): Promise<void> => {
  await axios.delete(`/store/products/${id}`, { withCredentials: true })
}

// ─── Statuses ────────────────────────────────────────────────────────────────

export const getStatuses = async (): Promise<ProductStatus[]> => {
  const response = await axios.get<ProductStatus[]>('/store/statuses', {
    withCredentials: true,
  })
  return response.data
}

export const createStatus = async (data: {
  label: string
  severity: string
}): Promise<ProductStatus> => {
  const response = await axios.post<ProductStatus>('/store/statuses', data, {
    withCredentials: true,
  })
  return response.data
}

export const deleteStatus = async (id: number): Promise<void> => {
  await axios.delete(`/store/statuses/${id}`, { withCredentials: true })
}
