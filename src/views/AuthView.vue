<template>
  <div class="flex justify-center h-screen w-screen items-center">
    <SignUp />
  </div>
</template>

<script setup lang="ts">
import SignUp from '@/components/auth/SignUp.vue'
</script>

<style lang="scss" scoped>
:deep(.p-card.neon) {
  position: relative;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #007700, #009e5f, #009900);
    background-size: 200% 200%;
    border-radius: 10px;
    z-index: -1;
    animation: neonBorder 10s linear infinite;
  }
}
@keyframes neonBorder {
  0% {
    background-position: 0% 50%;
    opacity: 0.3;
    box-shadow: 0 0 10px rgba(0, 158, 0, 0.5);
  }
  50% {
    background-position: 100% 50%;
    opacity: 1;
    box-shadow: 0 0 20px rgba(0, 160, 96, 0.8);
  }
  100% {
    background-position: 0% 50%;
    opacity: 0.3;
    box-shadow: 0 0 10px rgba(0, 136, 0, 0.5);
  }
}
</style>
