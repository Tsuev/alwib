<template>
  <button type="button" :class="addChatButton()" @click="$emit('add-chat')">
    <i class="pi pi-plus" :class="addIcon()"></i>
    <span :class="addText()">Новый чат</span>
  </button>
</template>

<script setup lang="ts">
import { tv } from 'tailwind-variants'

defineEmits<{
  'add-chat': []
}>()

const styles = tv({
  slots: {
    addChatButton: [
      'flex h-[430px] cursor-pointer w-full max-w-[360px] shrink-0 flex-col items-center justify-center rounded-2xl',
      'border border-dashed border-emerald-500/60 bg-slate-950/40 text-emerald-300',
      'transition hover:bg-slate-900/70 hover:text-emerald-200',
    ],
    addIcon: ['text-2xl'],
    addText: ['mt-3 text-center text-xs'],
  },
})

const { addChatButton, addIcon, addText } = styles()
</script>
