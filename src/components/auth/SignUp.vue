<template>
  <Form @submit="signUpApp">
    <h2 class="text-2xl mb-3 text-center">Регистрация</h2>
    <InputText class="mb-3" name="nickname" type="text" placeholder="Никнейм" fluid required />
    <InputText class="mb-3" name="email" type="email" placeholder="Почта" fluid required />
    <InputText class="mb-5" name="password" type="password" placeholder="Пароль" fluid required />
    <Button type="submit" severity="primary" label="Зарегистрироваться" fluid :loading />
    <div
      class="mt-3 text-right text-green-300 font-semibold cursor-pointer"
      @click="$emit('switch-to-login')"
    >
      Войти в аккаунт
    </div>
  </Form>
  <Dialog
    v-model:visible="showConfirmModal"
    modal
    header="Подтверждение почты"
    :style="{ width: '25rem' }"
  >
    Мы отправили письмо на вашу почту. Пройдите по ссылке и подтвердите свою почту.
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import InputText from 'primevue/inputtext'
import { Form } from '@primevue/forms'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'

import services from '@/services/services'

import type { UserAuthType } from '@/types/AuthTypes'

import { useUserStore } from '@/stores/userStore'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const userStore = useUserStore()

const loading = ref(false)
const showConfirmModal = ref(false)

const signUpApp = async ({ values }: { values: unknown }) => {
  try {
    loading.value = true

    const response = await services.auth.signUp(values as UserAuthType, toast)

    if (response?.user) userStore.user = response.user

    showConfirmModal.value = true
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped></style>
