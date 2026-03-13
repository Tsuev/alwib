<template>
  <div :class="productCard()">
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
      <button :class="productEditBtn()" @click="emit('edit', product)">
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
      <a
        v-if="product.messenger && messengerLink"
        :href="messengerLink"
        target="_blank"
        rel="noopener noreferrer"
        :class="messengerBtnClass"
      >
        <i :class="product.messenger === 'whatsapp' ? 'pi pi-whatsapp' : 'pi pi-telegram'"></i>
        <span>Посмотреть</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Badge from 'primevue/badge'
import { useStoreStore } from '@/stores/storeStore'
import type { BadgeSeverity, Product } from '@/types/store'
import { tv } from 'tailwind-variants'

const props = defineProps<{ product: Product }>()
const emit = defineEmits<{ edit: [product: Product] }>()

const store = useStoreStore()

const formatPrice = (price: number) =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(price)

const messengerLink = computed((): string | null => {
  const { messenger } = props.product
  if (!messenger || !store.store) return null

  const text = [
    props.product.name,
    props.product.description,
    `Цена: ${formatPrice(props.product.price)}`,
  ]
    .filter(Boolean)
    .join('\n')
  const encoded = encodeURIComponent(text)

  if (messenger === 'whatsapp' && store.store.whatsapp) {
    const phone = store.store.whatsapp.replace(/\D/g, '')
    return `https://wa.me/${phone}?text=${encoded}`
  }
  if (messenger === 'telegram' && store.store.telegram) {
    const username = store.store.telegram.replace(/^@/, '')
    return `https://t.me/${username}?text=${encoded}`
  }
  return null
})

const messengerBtnClass = computed(() =>
  [
    'mt-2 flex items-center justify-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium',
    'transition-colors duration-150 no-underline',
    props.product.messenger === 'whatsapp'
      ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50 border border-green-800/40'
      : 'bg-sky-900/30 text-sky-400 hover:bg-sky-900/50 border border-sky-800/40',
  ].join(' '),
)

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = tv({
  slots: {
    productCard: [
      'relative flex flex-col rounded-2xl border border-slate-800/80',
      'bg-slate-950/70 overflow-hidden group',
    ],
    productImageWrap: ['relative h-40 bg-slate-900'],
    productImage: ['w-full h-full object-cover'],
    productImagePlaceholder: ['w-full h-full flex items-center justify-center bg-slate-900'],
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
  },
})

const {
  productCard, productImageWrap, productImage, productImagePlaceholder, productEditBtn,
  productInfo, productName, productDesc, productFooter, productPrice,
} = styles()
</script>
