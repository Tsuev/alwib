<template>
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
          ref="imageInputRef"
          type="file"
          accept="image/*"
          class="hidden"
          @change="onImageSelect"
        />
        <button :class="dialogImageBtn()" @click="imageInputRef?.click()">
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
          <div v-if="imageUploading" :class="uploadOverlay()">
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
        <InputText v-model="form.name" maxlength="30" placeholder="Название товара" class="w-full" />
      </div>

      <!-- Description -->
      <div :class="dialogField()">
        <div :class="labelRow()">
          <label :class="fieldLabel()">Описание</label>
          <span :class="fieldCounter()">{{ (form.description ?? '').length }}/100</span>
        </div>
        <Textarea v-model="form.description" maxlength="100" placeholder="Краткое описание" rows="3" class="w-full" />
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
              <Badge v-if="option.severity" :value="option.label" :severity="option.severity as BadgeSeverity" />
              <span v-else class="text-slate-300">{{ option.label }}</span>
            </div>
          </template>
        </Select>
      </div>

      <!-- Messenger -->
      <div v-if="messengerOptions.length > 1" :class="dialogField()">
        <label :class="fieldLabel()">Мессенджер для связи</label>
        <SelectButton
          v-model="form.messenger"
          :options="messengerOptions"
          option-label="label"
          option-value="value"
          class="w-full"
        />
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
          @click="handleDelete"
        />
        <div class="flex gap-2 ml-auto">
          <Button label="Отмена" severity="secondary" text @click="dialogVisible = false" />
          <Button
            :label="dialogMode === 'create' ? 'Создать' : 'Сохранить'"
            icon="pi pi-check"
            :loading="dialogSaving"
            :disabled="!form.name.trim() || form.price === null"
            @click="handleSave"
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import SelectButton from 'primevue/selectbutton'
import Badge from 'primevue/badge'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'
import { useStoreStore } from '@/stores/storeStore'
import { useImageUpload } from '@/composables/useImageUpload'
import type { BadgeSeverity, Product } from '@/types/store'
import { tv } from 'tailwind-variants'

const store = useStoreStore()
const toast = useToast()
const { uploading: imageUploading, upload } = useImageUpload()

// ─── Dialog state ──────────────────────────────────────────────────────────────
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
  messenger: null as string | null,
})

const imageInputRef = ref<HTMLInputElement | null>(null)

// ─── Options ───────────────────────────────────────────────────────────────────
const statusSelectOptions = computed(() => [
  { label: 'Без статуса', value: null, severity: null },
  ...(store.store?.statuses ?? []).map((s) => ({ label: s.label, value: s.id, severity: s.severity })),
])

const messengerOptions = computed(() => {
  const opts: { label: string; value: string | null }[] = [{ label: 'Нет', value: null }]
  if (store.store?.whatsapp) opts.push({ label: 'WhatsApp', value: 'whatsapp' })
  if (store.store?.telegram) opts.push({ label: 'Telegram', value: 'telegram' })
  return opts
})

// ─── Expose ────────────────────────────────────────────────────────────────────
const openCreate = () => {
  dialogMode.value = 'create'
  Object.assign(form, { name: '', description: '', price: null, imageUrl: '', statusId: null, messenger: null })
  editingProductId.value = null
  dialogVisible.value = true
}

const openEdit = (product: Product) => {
  dialogMode.value = 'edit'
  Object.assign(form, {
    name: product.name,
    description: product.description ?? '',
    price: product.price,
    imageUrl: product.imageUrl ?? '',
    statusId: product.statusId ?? null,
    messenger: product.messenger ?? null,
  })
  editingProductId.value = product.id
  dialogVisible.value = true
}

defineExpose({ openCreate, openEdit })

// ─── Image upload ──────────────────────────────────────────────────────────────
const onImageSelect = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  try {
    form.imageUrl = await upload(file)
  } catch {
    toast.add({ severity: 'error', summary: 'Фото', detail: 'Не удалось загрузить фото', life: 4000 })
  } finally {
    if (imageInputRef.value) imageInputRef.value.value = ''
  }
}

// ─── Save / Delete ─────────────────────────────────────────────────────────────
const handleSave = async () => {
  if (!form.name.trim() || form.price === null) return
  dialogSaving.value = true
  try {
    const payload = {
      name: form.name.trim(),
      description: form.description || undefined,
      price: +form.price,
      imageUrl: form.imageUrl || undefined,
      statusId: form.statusId ?? undefined,
      messenger: form.messenger,
    }
    if (dialogMode.value === 'create') {
      await store.createProduct(payload)
      toast.add({ severity: 'success', summary: 'Товар', detail: 'Товар добавлен', life: 3000 })
    } else if (editingProductId.value !== null) {
      await store.updateProduct(editingProductId.value, { ...payload, statusId: form.statusId, messenger: form.messenger })
      toast.add({ severity: 'success', summary: 'Товар', detail: 'Товар обновлён', life: 3000 })
    }
    dialogVisible.value = false
  } catch {
    toast.add({ severity: 'error', summary: 'Товар', detail: 'Не удалось сохранить товар', life: 4000 })
  } finally {
    dialogSaving.value = false
  }
}

const handleDelete = async () => {
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

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = tv({
  slots: {
    dialogBody: ['flex flex-col gap-4'],
    dialogField: ['flex flex-col gap-1.5'],
    labelRow: ['flex items-center justify-between'],
    fieldLabel: ['text-sm text-slate-400'],
    fieldCounter: ['text-xs text-slate-500'],
    dialogImageBtn: [
      'relative w-full h-36 rounded-xl border-2 border-dashed border-slate-700',
      'flex flex-col items-center justify-center cursor-pointer overflow-hidden',
      'hover:border-primary-500 transition-colors duration-200',
    ],
    dialogImagePreview: ['w-full h-full object-cover'],
    dialogImagePlaceholder: ['flex flex-col items-center gap-1'],
    uploadOverlay: ['absolute inset-0 flex items-center justify-center bg-black/60'],
    dialogFooter: ['flex items-center w-full'],
  },
})

const {
  dialogBody, dialogField, labelRow, fieldLabel, fieldCounter,
  dialogImageBtn, dialogImagePreview, dialogImagePlaceholder, uploadOverlay, dialogFooter,
} = styles()
</script>
