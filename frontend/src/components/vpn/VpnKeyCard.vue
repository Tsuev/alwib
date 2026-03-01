<template>
  <div :class="card()">
    <div :class="cardHeader()">
      <p :class="sectionTitle()">VLESS ключ</p>
      <Button
        :label="copyLabel"
        :icon="copyIcon"
        severity="secondary"
        size="small"
        :class="copyButton()"
        :disabled="!hasKey || loading"
        @click="$emit('copy-key')"
      />
    </div>

    <div :class="keyBox()">
      <template v-if="loading">
        <Skeleton width="80px" height="10px" />
        <Skeleton class="mt-2" width="100%" height="14px" />
        <Skeleton class="mt-2" width="78%" height="14px" />
      </template>
      <template v-else>
        <span v-if="hasKey" :class="keyPrefix()">$ vless://</span>
        <span :class="keyValue()">{{ keyView }}</span>
      </template>
    </div>

    <p v-if="!loading" :class="helperText()">
      {{
        hasKey
          ? 'Используйте ключ в вашем VPN клиенте или скопируйте одной кнопкой.'
          : 'Запросите бесплатный ключ или оформите подписку для доступа.'
      }}
    </p>
    <Skeleton v-else :class="helperText()" width="62%" height="10px" />
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'
import { tv } from 'tailwind-variants'

defineProps<{
  loading: boolean
  hasKey: boolean
  keyView: string
  copyLabel: string
  copyIcon: string
}>()

defineEmits<{
  'copy-key': []
}>()

const styles = tv({
  slots: {
    card: ['rounded-2xl bg-slate-950/90 p-6 lg:col-span-2'],
    cardHeader: ['flex items-center justify-between gap-3'],
    sectionTitle: ['text-sm uppercase tracking-wide text-slate-400'],
    helperText: ['mt-3 text-xs text-slate-400'],
    copyButton: ['shrink-0'],
    keyBox: [
      'mt-4 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3',
      'font-mono text-sm text-emerald-300',
    ],
    keyPrefix: ['block text-xs text-slate-500'],
    keyValue: ['break-all'],
  },
})

const { card, cardHeader, sectionTitle, helperText, copyButton, keyBox, keyPrefix, keyValue } = styles()
</script>
