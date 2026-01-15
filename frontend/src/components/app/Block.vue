<template>
  <div class="block">
    <div v-if="$slots.header" class="header">
      <slot name="header" />
    </div>
    <div class="content">
      <slot />
    </div>
    <div v-if="$slots.footer" class="footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.block {
  @apply rounded-2xl bg-slate-900/80 p-6 shadow-lg shadow-black/20;
}
</style>
