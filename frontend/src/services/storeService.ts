import axios from '@/plugins/axios'
import type { Product, ProductStatus, Store } from '@/types/store'

export const getStore = async (): Promise<Store | null> => {
  const response = await axios.get<Store | null>('/store', {
    withCredentials: true,
  })
  return response.data
}

export const upsertStore = async (data: {
  name?: string
  logoUrl?: string
  whatsapp?: string
  telegram?: string
}): Promise<Store> => {
  const response = await axios.put<Store>('/store', data, {
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
  messenger?: string | null
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
    messenger: string | null
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
