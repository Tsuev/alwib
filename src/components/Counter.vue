<template>
  <div class="counter text-center">
    <h1>Счетчик</h1>
    <div class="mb-5">{{ count }}</div>
    <div class="flex gap-2">
      <Button label="Сбросить" @click="count = 0" />
      <Button label="Увеличить" @click="count++" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import Button from 'primevue/button'

const count = ref(0)
</script>

<style scoped>
.counter {
  font-size: 24px;
}
</style>
