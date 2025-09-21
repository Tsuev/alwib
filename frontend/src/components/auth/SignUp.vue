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
      <label for="passwod">Придумайте пароль</label>
    </FloatLabel>
    <FloatLabel variant="on" class="mb-3 w-100">
      <InputText id="nickname" name="nickname" type="text" fluid required />
      <label for="nickname">Придумайте имя</label>
    </FloatLabel>
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
import FloatLabel from 'primevue/floatlabel'
import { Form } from '@primevue/forms'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Password from 'primevue/password'

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

    if (response?.user) {
      userStore.setUser(response.user)
    }

    showConfirmModal.value = true
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped></style>
