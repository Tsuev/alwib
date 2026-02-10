<template>
  <div :class="styles().layout()">
    <HeaderBar />
    <div :class="styles().content()">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderBar from '@/components/app/HeaderBar.vue'
import { tv } from 'tailwind-variants'

const styles = tv({
  slots: {
    layout: 'default-layout',
    content: 'content px-4 pb-10 pt-6 md:px-8',
  },
})
</script>
