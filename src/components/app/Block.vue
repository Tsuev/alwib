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
  border-radius: 15px;
  background-color: var(--p-surface-900);
  box-shadow: -1px 2px 20px 4px rgba(34, 60, 80, 0.2);
  padding: 30px;
}
</style>
