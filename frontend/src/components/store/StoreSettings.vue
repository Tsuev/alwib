<template>
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
            v-if="store.store?.logoUrl"
            :src="store.store.logoUrl"
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
        <div v-if="shopNameLocked && store.store?.name" :class="shopLink()">
          <i class="pi pi-link text-primary-400 text-sm"></i>
          <span>{{ store.store.name }}.alwib.ru</span>
        </div>
      </div>
    </div>

    <!-- Contacts -->
    <div :class="contactsDivider()"></div>
    <h3 :class="contactsTitle()">Контакты для связи</h3>
    <div :class="contactsGrid()">
      <div :class="contactField()">
        <label :class="fieldLabel()">
          <i class="pi pi-whatsapp text-green-400 mr-1"></i>WhatsApp
        </label>
        <InputText v-model="whatsappDraft" placeholder="+79001234567" class="w-full" />
      </div>
      <div :class="contactField()">
        <label :class="fieldLabel()">
          <i class="pi pi-telegram text-sky-400 mr-1"></i>Telegram
        </label>
        <InputText v-model="telegramDraft" placeholder="@username" class="w-full" />
      </div>
    </div>
    <Button
      label="Сохранить контакты"
      size="small"
      icon="pi pi-check"
      :loading="contactsSaving"
      :disabled="contactsSaving"
      @click="saveContacts"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { useToast } from 'primevue/usetoast'
import { useStoreStore } from '@/stores/storeStore'
import { useImageUpload } from '@/composables/useImageUpload'
import { tv } from 'tailwind-variants'

const store = useStoreStore()
const toast = useToast()
const { uploading: logoUploading, upload } = useImageUpload()

// ─── Init drafts from store ────────────────────────────────────────────────────
const shopNameDraft = ref('')
const shopNameLocked = ref(false)
const whatsappDraft = ref('')
const telegramDraft = ref('')

const initialized = ref(false)
watch(
  () => store.store,
  (val) => {
    if (!val || initialized.value) return
    initialized.value = true
    if (val.name) {
      shopNameDraft.value = val.name
      shopNameLocked.value = true
    }
    if (val.whatsapp) whatsappDraft.value = val.whatsapp
    if (val.telegram) telegramDraft.value = val.telegram
  },
  { immediate: true },
)

// ─── Logo ──────────────────────────────────────────────────────────────────────
const logoInputRef = ref<HTMLInputElement | null>(null)

const onLogoSelect = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  try {
    const url = await upload(file)
    await store.upsertStore({ logoUrl: url })
    toast.add({ severity: 'success', summary: 'Логотип', detail: 'Логотип обновлён', life: 3000 })
  } catch {
    toast.add({ severity: 'error', summary: 'Логотип', detail: 'Не удалось загрузить логотип', life: 4000 })
  } finally {
    if (logoInputRef.value) logoInputRef.value.value = ''
  }
}

// ─── Shop name ─────────────────────────────────────────────────────────────────
const shopNameSaving = ref(false)

const saveShopName = async () => {
  if (!shopNameDraft.value.trim()) return
  shopNameSaving.value = true
  try {
    await store.upsertStore({ name: shopNameDraft.value.trim() })
    shopNameLocked.value = true
    toast.add({ severity: 'success', summary: 'Магазин', detail: 'Название сохранено', life: 3000 })
  } catch {
    toast.add({ severity: 'error', summary: 'Магазин', detail: 'Не удалось сохранить название', life: 4000 })
  } finally {
    shopNameSaving.value = false
  }
}

// ─── Contacts ──────────────────────────────────────────────────────────────────
const contactsSaving = ref(false)

const saveContacts = async () => {
  contactsSaving.value = true
  try {
    await store.upsertStore({
      whatsapp: whatsappDraft.value.trim() || undefined,
      telegram: telegramDraft.value.replace(/^@/, '').trim() || undefined,
    })
    toast.add({ severity: 'success', summary: 'Контакты', detail: 'Контакты сохранены', life: 3000 })
  } catch {
    toast.add({ severity: 'error', summary: 'Контакты', detail: 'Не удалось сохранить контакты', life: 4000 })
  } finally {
    contactsSaving.value = false
  }
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = tv({
  slots: {
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
    logoOverlay: ['absolute inset-0 flex items-center justify-center bg-black/60'],
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
    contactsDivider: ['mt-6 border-t border-slate-800/60'],
    contactsTitle: ['text-sm font-medium text-slate-300 mt-4 mb-3'],
    contactsGrid: ['grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3'],
    contactField: ['flex flex-col gap-1.5'],
  },
})

const {
  panel, sectionTitle, settingsGrid,
  logoArea, logoButton, logoImg, logoPlaceholder, logoHint, logoOverlay, logoCaption,
  nameArea, fieldLabel, nameInputRow, nameInputWrap, nameInput, nameCounter, shopLink,
  contactsDivider, contactsTitle, contactsGrid, contactField,
} = styles()
</script>
