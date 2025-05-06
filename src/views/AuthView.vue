<template>
  <div class="flex justify-center h-screen items-center">
    <Card :class="{ 'w-full h-full flex justify-center rounded-0': mobile, neon: !mobile }">
      <template #content>
        <div class="auth-form flex flex-col items-center">
          <img src="/alwib.png" width="72" class="mb-2" />
          <h2 class="text-xl mb-5">Alwib Workspace</h2>
          <h2 class="text-2xl mb-3">Авторизация</h2>
          <Form>
            <InputText class="mb-3" name="email" type="email" placeholder="Почта" fluid />
            <InputText class="mb-5" name="password" type="password" placeholder="Пароль" fluid />
            <Button
              type="submit"
              severity="primary"
              label="Зарегистрироваться"
              fluid
              @click="testSignUp"
            />
          </Form>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import { Form } from '@primevue/forms'
import Button from 'primevue/button'

import { useBreakpoints } from '@/composables/useBreakpoints'

import { signUp } from '@/services/authServices'

const { mobile } = useBreakpoints()

const testSignUp = async () => {
  const reg = await signUp('tsuevjudoka@gmail.com', '12345678')

  console.log('reg', reg)
}
</script>

<style lang="scss" scoped>
:deep(.p-card.neon) {
  position: relative;
  padding: 20px; /* отступы внутри блока */
  border-radius: 8px;
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
