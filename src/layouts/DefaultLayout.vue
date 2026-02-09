<template>
  <div class="default-layout">
    <HeaderBar />
    <div class="content px-4 pb-10 pt-6 md:px-8">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderBar from '@/components/app/HeaderBar.vue'
</script>
