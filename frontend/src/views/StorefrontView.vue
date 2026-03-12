<template>
  <DefaultLayout :class="layout()">
    <!-- ─── Header ──────────────────────────────────────────────────────── -->
    <section :class="pageHeader()">
      <div :class="pageHeaderLeft()">
        <i class="pi pi-store text-primary-400 text-3xl"></i>
        <div>
          <h1 :class="title()">Конструктор витрин</h1>
          <p :class="lead()">Настройте магазин, добавьте товары и опубликуйте витрину.</p>
        </div>
      </div>
      <Button
        :label="store.storefront?.isPublished ? 'Снять с публикации' : 'Опубликовать'"
        :icon="store.storefront?.isPublished ? 'pi pi-eye-slash' : 'pi pi-send'"
        :severity="store.storefront?.isPublished ? 'danger' : 'success'"
        :disabled="!store.storefront?.name"
        :loading="publishLoading"
        @click="handleTogglePublish"
      />
    </section>

    <div class="store-settings flex gap-3 my-5">
    <!-- ─── Shop settings ──────────────────────────────────────────────── -->
      <section :class="panel()">
        <h2 :class="sectionTitle()">Настройки магазина</h2>
        <div :class="settingsGrid()">
          <!-- Logo -->
          <div :class="logoArea()">
            <input
              ref="logoInputRef"
              type="file"
              accept="image/*"
              class="hidden"
              @change="onLogoSelect"
            />
            <button :class="logoButton()" @click="logoInputRef?.click()">
              <img
                v-if="store.storefront?.logoUrl"
                :src="store.storefront.logoUrl"
                :class="logoImg()"
                alt="Логотип"
              />
              <div v-else :class="logoPlaceholder()">
                <i class="pi pi-image text-3xl text-slate-500"></i>
                <span :class="logoHint()">Загрузить логотип</span>
              </div>
              <div v-if="logoUploading" :class="logoOverlay()">
                <i class="pi pi-spin pi-spinner text-white text-2xl"></i>
              </div>
            </button>
            <p :class="logoCaption()">до 5 МБ, JPG / PNG</p>
          </div>

          <!-- Shop name -->
          <div :class="nameArea()">
            <label :class="fieldLabel()">Название магазина</label>
            <div :class="nameInputRow()">
              <div :class="nameInputWrap()">
                <InputText
                  v-model="shopNameDraft"
                  :readonly="shopNameLocked"
                  maxlength="10"
                  placeholder="myshop"
                  :class="nameInput()"
                />
                <span :class="nameCounter()">{{ shopNameDraft.length }}/10</span>
              </div>
              <Button
                v-if="!shopNameLocked"
                label="Принять"
                icon="pi pi-check"
                size="small"
                :disabled="!shopNameDraft.trim() || shopNameSaving"
                :loading="shopNameSaving"
                @click="saveShopName"
              />
              <Button
                v-else
                icon="pi pi-pencil"
                size="small"
                severity="secondary"
                text
                @click="shopNameLocked = false"
              />
            </div>
            <div v-if="shopNameLocked && store.storefront?.name" :class="shopLink()">
              <i class="pi pi-link text-primary-400 text-sm"></i>
              <span>{{ store.storefront.name }}.alwib.ru</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ─── Statuses ───────────────────────────────────────────────────── -->
      <section :class="panel()">
        <div :class="statusesHeader()">
          <h2 :class="sectionTitle()">Статусы товаров</h2>
          <span :class="limitBadge()">{{ statuses.length }} / 10</span>
        </div>

        <!-- existing statuses -->
        <div v-if="statuses.length" :class="statusList()">
          <div
            v-for="st in statuses"
            :key="st.id"
            :class="statusItem()"
          >
            <Badge :value="st.label" :severity="st.severity as BadgeSeverity" />
            <button :class="statusDeleteBtn()" @click="handleDeleteStatus(st.id)">
              <i class="pi pi-times text-xs"></i>
            </button>
          </div>
        </div>
        <p v-else :class="emptyHint()">Статусов пока нет. Создайте первый ниже.</p>

        <!-- add status form -->
        <div v-if="statuses.length < 10" :class="statusForm()">
          <InputText
            v-model="newStatusLabel"
            placeholder="Название статуса"
            maxlength="30"
            :class="statusInput()"
          />
          <Select
            v-model="newStatusSeverity"
            :options="severityOptions"
            option-label="label"
            option-value="value"
            placeholder="Цвет"
            :class="statusSelect()"
          >
            <template #option="{ option }">
              <Badge :value="option.label" :severity="option.value as BadgeSeverity" />
            </template>
            <template #value="{ value }">
              <Badge
                v-if="value"
                :value="severityOptions.find((o) => o.value === value)?.label ?? value"
                :severity="value as BadgeSeverity"
              />
              <span v-else class="text-slate-400">Цвет</span>
            </template>
          </Select>
          <Button
            label="Добавить"
            icon="pi pi-plus"
            size="small"
            :disabled="!newStatusLabel.trim() || !newStatusSeverity || statusAdding"
            :loading="statusAdding"
            @click="handleAddStatus"
          />
        </div>
      </section>
    </div>

    <!-- ─── Products ───────────────────────────────────────────────────── -->
    <section>
      <div :class="productsHeader()">
        <h2 :class="sectionTitle()">Товары</h2>
        <span :class="limitBadge()">{{ products.length }} / 50</span>
      </div>

      <div :class="productsGrid()">
        <!-- Add card -->
        <button
          v-if="products.length < 50"
          :class="addProductCard()"
          @click="openCreateDialog"
        >
          <i class="pi pi-plus text-2xl text-slate-500"></i>
          <span :class="addProductLabel()">Добавить товар</span>
        </button>

        <!-- Product cards -->
        <div
          v-for="product in products"
          :key="product.id"
          :class="productCard()"
        >
          <!-- Image -->
          <div :class="productImageWrap()">
            <img
              v-if="product.imageUrl"
              :src="product.imageUrl"
              :class="productImage()"
              alt="Фото"
            />
            <div v-else :class="productImagePlaceholder()">
              <i class="pi pi-image text-2xl text-slate-600"></i>
            </div>
            <!-- Edit button -->
            <button :class="productEditBtn()" @click="openEditDialog(product)">
              <i class="pi pi-pencil text-xs"></i>
            </button>
          </div>

          <!-- Info -->
          <div :class="productInfo()">
            <p :class="productName()">{{ product.name }}</p>
            <p v-if="product.description" :class="productDesc()">{{ product.description }}</p>
            <div :class="productFooter()">
              <span :class="productPrice()">{{ formatPrice(product.price) }}</span>
              <Badge
                v-if="product.status"
                :value="product.status.label"
                :severity="product.status.severity as BadgeSeverity"
                class="text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── Product dialog ─────────────────────────────────────────────── -->
    <Dialog
      v-model:visible="dialogVisible"
      :header="dialogMode === 'create' ? 'Новый товар' : 'Редактировать товар'"
      modal
      :style="{ width: '480px', maxWidth: '95vw' }"
      :draggable="false"
    >
      <div :class="dialogBody()">
        <!-- Photo -->
        <div :class="dialogField()">
          <label :class="fieldLabel()">Фото товара</label>
          <input
            ref="productImageInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="onProductImageSelect"
          />
          <button :class="dialogImageBtn()" @click="productImageInputRef?.click()">
            <img
              v-if="form.imageUrl"
              :src="form.imageUrl"
              :class="dialogImagePreview()"
              alt="Превью"
            />
            <div v-else :class="dialogImagePlaceholder()">
              <i class="pi pi-image text-2xl text-slate-500"></i>
              <span class="text-xs text-slate-500 mt-1">Выбрать фото</span>
            </div>
            <div v-if="productImageUploading" :class="logoOverlay()">
              <i class="pi pi-spin pi-spinner text-white text-2xl"></i>
            </div>
          </button>
        </div>

        <!-- Name -->
        <div :class="dialogField()">
          <div :class="labelRow()">
            <label :class="fieldLabel()">Название</label>
            <span :class="fieldCounter()">{{ form.name.length }}/30</span>
          </div>
          <InputText
            v-model="form.name"
            maxlength="30"
            placeholder="Название товара"
            class="w-full"
          />
        </div>

        <!-- Description -->
        <div :class="dialogField()">
          <div :class="labelRow()">
            <label :class="fieldLabel()">Описание</label>
            <span :class="fieldCounter()">{{ (form.description ?? '').length }}/100</span>
          </div>
          <Textarea
            v-model="form.description"
            maxlength="100"
            placeholder="Краткое описание"
            rows="3"
            class="w-full"
          />
        </div>

        <!-- Price -->
        <div :class="dialogField()">
          <label :class="fieldLabel()">Цена (₽)</label>
          <InputNumber
            v-model="form.price"
            mode="decimal"
            locale="ru-RU"
            :min="0"
            :max-fraction-digits="2"
            placeholder="0"
            class="w-full"
          />
        </div>

        <!-- Status -->
        <div :class="dialogField()">
          <label :class="fieldLabel()">Статус</label>
          <Select
            v-model="form.statusId"
            :options="statusSelectOptions"
            option-label="label"
            option-value="value"
            placeholder="Без статуса"
            class="w-full"
          >
            <template #option="{ option }">
              <div class="flex items-center gap-2">
                <Badge
                  v-if="option.severity"
                  :value="option.label"
                  :severity="option.severity as BadgeSeverity"
                />
                <span v-else class="text-slate-300">{{ option.label }}</span>
              </div>
            </template>
          </Select>
        </div>
      </div>

      <template #footer>
        <div :class="dialogFooter()">
          <Button
            v-if="dialogMode === 'edit'"
            label="Удалить"
            severity="danger"
            text
            icon="pi pi-trash"
            :loading="dialogDeleting"
            @click="handleDeleteProduct"
          />
          <div class="flex gap-2 ml-auto">
            <Button label="Отмена" severity="secondary" text @click="dialogVisible = false" />
            <Button
              :label="dialogMode === 'create' ? 'Создать' : 'Сохранить'"
              icon="pi pi-check"
              :loading="dialogSaving"
              :disabled="!form.name.trim() || form.price === null"
              @click="handleSaveProduct"
            />
          </div>
        </div>
      </template>
    </Dialog>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import Badge from 'primevue/badge'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'
import { useStorefrontStore } from '@/stores/storefrontStore'
import { uploadImage } from '@/services/storefrontService'
import type { BadgeSeverity, Product } from '@/types/store'
import { tv } from 'tailwind-variants'

// ─── Store & toast ────────────────────────────────────────────────────────────

const store = useStorefrontStore()
const toast = useToast()

const products = computed(() => store.storefront?.products ?? [])
const statuses = computed(() => store.storefront?.statuses ?? [])

onMounted(async () => {
  try {
    await store.fetchStorefront()
    if (store.storefront?.name) {
      shopNameDraft.value = store.storefront.name
      shopNameLocked.value = true
    }
  } catch {
    toast.add({ severity: 'error', summary: 'Витрина', detail: 'Не удалось загрузить данные', life: 4000 })
  }
})

// ─── Publish ──────────────────────────────────────────────────────────────────

const publishLoading = ref(false)

const handleTogglePublish = async () => {
  publishLoading.value = true
  try {
    await store.togglePublish()
    toast.add({
      severity: 'success',
      summary: 'Витрина',
      detail: store.storefront?.isPublished ? 'Опубликовано' : 'Снято с публикации',
      life: 3000,
    })
  } catch {
    toast.add({ severity: 'error', summary: 'Витрина', detail: 'Ошибка публикации', life: 4000 })
  } finally {
    publishLoading.value = false
  }
}

// ─── Logo ─────────────────────────────────────────────────────────────────────

const logoInputRef = ref<HTMLInputElement | null>(null)
const logoUploading = ref(false)

const onLogoSelect = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  logoUploading.value = true
  try {
    const compressed = await compressImage(file)
    const { url } = await uploadImage(compressed)
    await store.upsertStorefront({ logoUrl: url })
    toast.add({ severity: 'success', summary: 'Логотип', detail: 'Логотип обновлён', life: 3000 })
  } catch {
    toast.add({ severity: 'error', summary: 'Логотип', detail: 'Не удалось загрузить логотип', life: 4000 })
  } finally {
    logoUploading.value = false
    if (logoInputRef.value) logoInputRef.value.value = ''
  }
}

// ─── Shop name ────────────────────────────────────────────────────────────────

const shopNameDraft = ref('')
const shopNameLocked = ref(false)
const shopNameSaving = ref(false)

const saveShopName = async () => {
  if (!shopNameDraft.value.trim()) return
  shopNameSaving.value = true
  try {
    await store.upsertStorefront({ name: shopNameDraft.value.trim() })
    shopNameLocked.value = true
    toast.add({ severity: 'success', summary: 'Магазин', detail: 'Название сохранено', life: 3000 })
  } catch {
    toast.add({ severity: 'error', summary: 'Магазин', detail: 'Не удалось сохранить название', life: 4000 })
  } finally {
    shopNameSaving.value = false
  }
}

// ─── Statuses ─────────────────────────────────────────────────────────────────

const severityOptions = [
  { label: 'Зеленый', value: 'success' },
  { label: 'Голубой', value: 'info' },
  { label: 'Оранжевый', value: 'warn' },
  { label: 'Красный', value: 'danger' },
  { label: 'Темный', value: 'secondary' },
  { label: 'Белый', value: 'contrast' },
]

const newStatusLabel = ref('')
const newStatusSeverity = ref('')
const statusAdding = ref(false)

const handleAddStatus = async () => {
  if (!newStatusLabel.value.trim() || !newStatusSeverity.value) return
  statusAdding.value = true
  try {
    await store.createStatus({ label: newStatusLabel.value.trim(), severity: newStatusSeverity.value })
    newStatusLabel.value = ''
    newStatusSeverity.value = ''
    toast.add({ severity: 'success', summary: 'Статус', detail: 'Статус добавлен', life: 3000 })
  } catch {
    toast.add({ severity: 'error', summary: 'Статус', detail: 'Не удалось добавить статус', life: 4000 })
  } finally {
    statusAdding.value = false
  }
}

const handleDeleteStatus = async (id: number) => {
  try {
    await store.deleteStatus(id)
    toast.add({ severity: 'success', summary: 'Статус', detail: 'Статус удалён', life: 3000 })
  } catch {
    toast.add({ severity: 'error', summary: 'Статус', detail: 'Не удалось удалить статус', life: 4000 })
  }
}

// ─── Product dialog ───────────────────────────────────────────────────────────

const dialogVisible = ref(false)
const dialogMode = ref<'create' | 'edit'>('create')
const dialogSaving = ref(false)
const dialogDeleting = ref(false)
const editingProductId = ref<number | null>(null)

const form = reactive({
  name: '',
  description: '',
  price: null as number | null,
  imageUrl: '',
  statusId: null as number | null,
})

const productImageInputRef = ref<HTMLInputElement | null>(null)
const productImageUploading = ref(false)

const statusSelectOptions = computed(() => [
  { label: 'Без статуса', value: null, severity: null },
  ...statuses.value.map((s) => ({ label: s.label, value: s.id, severity: s.severity })),
])

const openCreateDialog = () => {
  dialogMode.value = 'create'
  Object.assign(form, { name: '', description: '', price: null, imageUrl: '', statusId: null })
  editingProductId.value = null
  dialogVisible.value = true
}

const openEditDialog = (product: Product) => {
  dialogMode.value = 'edit'
  Object.assign(form, {
    name: product.name,
    description: product.description ?? '',
    price: product.price,
    imageUrl: product.imageUrl ?? '',
    statusId: product.statusId ?? null,
  })
  editingProductId.value = product.id
  dialogVisible.value = true
}

const onProductImageSelect = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  productImageUploading.value = true
  try {
    const compressed = await compressImage(file)
    const { url } = await uploadImage(compressed)
    form.imageUrl = url
  } catch {
    toast.add({ severity: 'error', summary: 'Фото', detail: 'Не удалось загрузить фото', life: 4000 })
  } finally {
    productImageUploading.value = false
    if (productImageInputRef.value) productImageInputRef.value.value = ''
  }
}

const handleSaveProduct = async () => {
  if (!form.name.trim() || form.price === null) return
  dialogSaving.value = true
  try {
    const payload = {
      name: form.name.trim(),
      description: form.description || undefined,
      price: +form.price,
      imageUrl: form.imageUrl || undefined,
      statusId: form.statusId ?? undefined,
    }
    if (dialogMode.value === 'create') {
      await store.createProduct(payload)
      toast.add({ severity: 'success', summary: 'Товар', detail: 'Товар добавлен', life: 3000 })
    } else if (editingProductId.value !== null) {
      await store.updateProduct(editingProductId.value, {
        ...payload,
        statusId: form.statusId,
      })
      toast.add({ severity: 'success', summary: 'Товар', detail: 'Товар обновлён', life: 3000 })
    }
    dialogVisible.value = false
  } catch {
    toast.add({ severity: 'error', summary: 'Товар', detail: 'Не удалось сохранить товар', life: 4000 })
  } finally {
    dialogSaving.value = false
  }
}

const handleDeleteProduct = async () => {
  if (editingProductId.value === null) return
  dialogDeleting.value = true
  try {
    await store.deleteProduct(editingProductId.value)
    toast.add({ severity: 'success', summary: 'Товар', detail: 'Товар удалён', life: 3000 })
    dialogVisible.value = false
  } catch {
    toast.add({ severity: 'error', summary: 'Товар', detail: 'Не удалось удалить товар', life: 4000 })
  } finally {
    dialogDeleting.value = false
  }
}

// ─── Utils ─────────────────────────────────────────────────────────────────────

const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

async function compressImage(file: File): Promise<File> {
  if (file.size <= MAX_SIZE) return file

  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        // Scale down if too large
        const maxDim = 1920
        let { width, height } = img
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, width, height)

        const tryQuality = (quality: number) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) return resolve(file)
              if (blob.size <= MAX_SIZE || quality <= 0.3) {
                resolve(new File([blob], file.name, { type: 'image/jpeg' }))
              } else {
                tryQuality(Math.round((quality - 0.1) * 10) / 10)
              }
            },
            'image/jpeg',
            quality,
          )
        }
        tryQuality(0.9)
      }
      img.src = ev.target!.result as string
    }
    reader.readAsDataURL(file)
  })
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(price)

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = tv({
  slots: {
    layout: ['flex flex-col gap-8'],

    pageHeader: ['flex items-start justify-between gap-4 flex-wrap'],
    pageHeaderLeft: ['flex items-start gap-4'],
    title: ['text-3xl font-semibold text-white'],
    lead: ['text-slate-400 text-sm mt-1'],

    panel: [
      'rounded-3xl border border-slate-800/80 bg-slate-950/70 flex-1',
      'px-6 py-6 shadow-xl shadow-black/30 backdrop-blur',
    ],
    sectionTitle: ['text-lg font-semibold text-white mb-4'],

    settingsGrid: ['grid gap-8 sm:grid-cols-[auto_1fr]'],
    logoArea: ['flex flex-col items-center gap-2'],
    logoButton: [
      'relative w-28 h-28 rounded-2xl border-2 border-dashed border-slate-700 overflow-hidden',
      'flex flex-col items-center justify-center cursor-pointer',
      'hover:border-primary-500 transition-colors duration-200',
    ],
    logoImg: ['w-full h-full object-cover'],
    logoPlaceholder: ['flex flex-col items-center gap-1'],
    logoHint: ['text-[10px] text-slate-500 text-center leading-tight mt-1'],
    logoOverlay: [
      'absolute inset-0 flex items-center justify-center',
      'bg-black/60',
    ],
    logoCaption: ['text-[10px] text-slate-500'],

    nameArea: ['flex flex-col gap-3 justify-center'],
    fieldLabel: ['text-sm text-slate-400'],
    nameInputRow: ['flex items-center gap-2'],
    nameInputWrap: ['relative flex-1'],
    nameInput: ['w-full pr-12'],
    nameCounter: [
      'absolute right-3 top-1/2 -translate-y-1/2',
      'text-[10px] text-slate-500 pointer-events-none',
    ],
    shopLink: [
      'flex items-center gap-1.5 text-sm text-primary-300',
      'rounded-xl border border-primary-900/50 bg-primary-950/40 px-3 py-1.5 w-fit',
    ],

    statusesHeader: ['flex items-center justify-between mb-4'],
    limitBadge: [
      'text-xs text-slate-400 border border-slate-700 rounded-full px-2 py-0.5',
    ],
    statusList: ['flex flex-wrap gap-2 mb-4'],
    statusItem: ['flex items-center gap-1'],
    statusDeleteBtn: [
      'p-1 rounded-full text-slate-500 hover:text-red-400 hover:bg-red-900/20',
      'transition-colors duration-150',
    ],
    emptyHint: ['text-sm text-slate-500 mb-4'],
    statusForm: ['flex flex-wrap items-center gap-2 pt-4 border-t border-slate-800/60'],
    statusInput: ['flex-1 min-w-36'],
    statusSelect: ['w-44'],

    productsHeader: ['flex items-center justify-between mb-4'],
    productsGrid: ['grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'],

    addProductCard: [
      'flex flex-col items-center justify-center gap-2 rounded-2xl',
      'border-2 border-dashed border-slate-700 bg-slate-950/40 p-6 cursor-pointer',
      'hover:border-primary-500 hover:bg-primary-950/20 transition-colors duration-200 min-h-48',
    ],
    addProductLabel: ['text-sm text-slate-500'],

    productCard: [
      'relative flex flex-col rounded-2xl border border-slate-800/80',
      'bg-slate-950/70 overflow-hidden group',
    ],
    productImageWrap: ['relative h-40 bg-slate-900'],
    productImage: ['w-full h-full object-cover'],
    productImagePlaceholder: [
      'w-full h-full flex items-center justify-center bg-slate-900',
    ],
    productEditBtn: [
      'absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-slate-300',
      'opacity-0 group-hover:opacity-100 transition-opacity duration-150',
      'hover:text-white hover:bg-black/80',
    ],
    productInfo: ['p-3 flex flex-col gap-1'],
    productName: ['text-sm font-semibold text-white truncate'],
    productDesc: ['text-xs text-slate-400 line-clamp-2'],
    productFooter: ['flex items-center justify-between gap-2 mt-1'],
    productPrice: ['text-sm font-medium text-primary-300'],

    dialogBody: ['flex flex-col gap-4'],
    dialogField: ['flex flex-col gap-1.5'],
    labelRow: ['flex items-center justify-between'],
    fieldCounter: ['text-xs text-slate-500'],
    dialogImageBtn: [
      'relative w-full h-36 rounded-xl border-2 border-dashed border-slate-700',
      'flex flex-col items-center justify-center cursor-pointer overflow-hidden',
      'hover:border-primary-500 transition-colors duration-200',
    ],
    dialogImagePreview: ['w-full h-full object-cover'],
    dialogImagePlaceholder: ['flex flex-col items-center gap-1'],
    dialogFooter: ['flex items-center w-full'],
  },
})

const {
  layout,
  pageHeader,
  pageHeaderLeft,
  title,
  lead,
  panel,
  sectionTitle,
  settingsGrid,
  logoArea,
  logoButton,
  logoImg,
  logoPlaceholder,
  logoHint,
  logoOverlay,
  logoCaption,
  nameArea,
  fieldLabel,
  nameInputRow,
  nameInputWrap,
  nameInput,
  nameCounter,
  shopLink,
  statusesHeader,
  limitBadge,
  statusList,
  statusItem,
  statusDeleteBtn,
  emptyHint,
  statusForm,
  statusInput,
  statusSelect,
  productsHeader,
  productsGrid,
  addProductCard,
  addProductLabel,
  productCard,
  productImageWrap,
  productImage,
  productImagePlaceholder,
  productEditBtn,
  productInfo,
  productName,
  productDesc,
  productFooter,
  productPrice,
  dialogBody,
  dialogField,
  labelRow,
  fieldCounter,
  dialogImageBtn,
  dialogImagePreview,
  dialogImagePlaceholder,
  dialogFooter,
} = styles()
</script>
