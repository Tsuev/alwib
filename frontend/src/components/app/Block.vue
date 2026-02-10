<template>
  <div :class="styles().block()">
    <div v-if="$slots.header" :class="styles().header()">
      <slot name="header" />
    </div>
    <div :class="styles().content()">
      <slot />
    </div>
    <div v-if="$slots.footer" :class="styles().footer()">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { tv } from 'tailwind-variants'

const styles = tv({
  slots: {
    block: 'rounded-2xl p-6 shadow-lg shadow-black/20',
    header: '',
    content: '',
    footer: '',
  },
})
</script>
