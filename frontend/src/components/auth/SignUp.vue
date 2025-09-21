<template>
  <Form @submit="signUpApp">
    <h2 class="text-2xl mb-3 text-center">Регистрация</h2>
    <FloatLabel variant="on" class="mb-3 w-100">
      <InputText id="email" name="email" type="email" fluid required />
      <label for="email">Почта</label>
    </FloatLabel>
    <FloatLabel variant="on" class="mb-3 w-100">
      <Password
        name="password"
        promptLabel="Введите пароль"
        weakLabel="Слишком простой"
        mediumLabel="Хороший"
        strongLabel="Отличный"
        toggleMask
        fluid
      />
      <label for="password">Придумайте пароль</label>
    </FloatLabel>
    <Button type="submit" severity="primary" label="Зарегистрироваться" fluid :loading="loading" />
    <div
      class="mt-3 text-right text-green-300 font-semibold cursor-pointer"
      @click="$emit('switch-to-login')"
    >
      Войти в аккаунт
    </div>
  </Form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import { Form } from '@primevue/forms'
import Button from 'primevue/button'
import Password from 'primevue/password'

import authServices from '@/services/authServices'

import type { RegisterDto } from '@/types/AuthTypes'

import { useUserStore } from '@/stores/userStore'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'

const toast = useToast()
const userStore = useUserStore()
const router = useRouter()

const loading = ref(false)

const signUpApp = async ({ values }: { values: unknown }) => {
  try {
    loading.value = true

    const response = await authServices.register(values as RegisterDto, toast)

    if (response?.user) {
      userStore.setUser(response.user)
      router.push({ name: 'home' })
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped></style>
