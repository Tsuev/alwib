export type BadgeSeverity =
  | 'success'
  | 'info'
  | 'warn'
  | 'danger'
  | 'secondary'
  | 'contrast'

export interface ProductStatus {
  id: number
  storeId: number
  label: string
  severity: BadgeSeverity
}

export interface Product {
  id: number
  storeId: number
  statusId: number | null
  name: string
  description?: string | null
  price: number
  imageUrl?: string | null
  messenger: string | null
  status?: ProductStatus | null
  createdAt: string
  updatedAt: string
}

export interface Store {
  id: number
  userId: number
  name: string | null
  logoUrl: string | null
  whatsapp: string | null
  telegram: string | null
  isPublished: boolean
  products: Product[]
  statuses: ProductStatus[]
  createdAt: string
  updatedAt: string
}
