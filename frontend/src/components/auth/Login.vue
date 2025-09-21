<template>
  <Form @submit="login">
    <h2 class="text-2xl mb-3 text-center">Войти</h2>
    <FloatLabel variant="on" class="mb-3 w-100">
      <InputText id="email" name="email" type="email" fluid required />
      <label for="email">Почта</label>
    </FloatLabel>
    <FloatLabel variant="on" class="mb-3 w-100">
      <Password name="password" :feedback="false" toggleMask fluid />
      <label for="password">Пароль</label>
    </FloatLabel>
    <Button type="submit" severity="primary" label="Войти" fluid :loading="loading" />
    <div
      class="mt-3 text-right text-green-300 font-semibold cursor-pointer"
      @click="$emit('switch-to-signup')"
    >
      Зарегистрироваться
    </div>
  </Form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import InputText from 'primevue/inputtext'
import { Form } from '@primevue/forms'
import Button from 'primevue/button'
import FloatLabel from 'primevue/floatlabel'
import Password from 'primevue/password'

import authServices from '@/services/authServices'

import type { LoginDto } from '@/types/AuthTypes'

import { useToast } from 'primevue/usetoast'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

const toast = useToast()
const userStore = useUserStore()
const router = useRouter()

const loading = ref(false)

const login = async ({ values }: { values: unknown }) => {
  try {
    loading.value = true

    const response = await authServices.login(values as LoginDto, toast)

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
