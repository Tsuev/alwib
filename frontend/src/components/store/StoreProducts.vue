<template>
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
        @click="dialogRef?.openCreate()"
      >
        <i class="pi pi-plus text-2xl text-slate-500"></i>
        <span :class="addProductLabel()">Добавить товар</span>
      </button>

      <!-- Product cards -->
      <StoreProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        @edit="dialogRef?.openEdit($event)"
      />
    </div>

    <StoreProductDialog ref="dialogRef" />
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStoreStore } from '@/stores/storeStore'
import StoreProductCard from './StoreProductCard.vue'
import StoreProductDialog from './StoreProductDialog.vue'
import { tv } from 'tailwind-variants'

const store = useStoreStore()
const products = computed(() => store.store?.products ?? [])
const dialogRef = ref<InstanceType<typeof StoreProductDialog> | null>(null)

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = tv({
  slots: {
    sectionTitle: ['text-lg font-semibold text-white mb-4 pl-4'],
    productsHeader: ['flex items-center justify-between mb-4'],
    limitBadge: ['text-xs text-slate-400 border border-slate-700 rounded-full px-2 py-0.5'],
    productsGrid: ['grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'],
    addProductCard: [
      'flex flex-col items-center justify-center gap-2 rounded-2xl',
      'border-2 border-dashed border-slate-700 bg-slate-950/40 p-6 cursor-pointer',
      'hover:border-primary-500 hover:bg-primary-950/20 transition-colors duration-200 min-h-48',
    ],
    addProductLabel: ['text-sm text-slate-500'],
  },
})

const { sectionTitle, productsHeader, limitBadge, productsGrid, addProductCard, addProductLabel } = styles()
</script>
