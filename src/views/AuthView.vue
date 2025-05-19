<template>
  <div class="flex justify-center h-screen w-screen items-center">
    <Card :class="{ 'w-full h-full flex justify-center rounded-0': mobile, neon: !mobile }">
      <template #content>
        <div class="auth-form flex flex-col items-center">
          <img src="/alwib.png" width="72" class="mb-2" />
          <h2 class="text-xl mb-5">Alwib Workspace</h2>
          <SignUp />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import SignUp from '@/components/auth/SignUp.vue'

import { useBreakpoints } from '@/composables/useBreakpoints'

const { mobile } = useBreakpoints()
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
