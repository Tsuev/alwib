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

    <Button 
      type="submit" 
      severity="primary" 
      label="Зарегистрироваться" 
      fluid 
      :loading="loading" 
      @click="visible = true"
    />

    <div
      class="mt-3 text-right text-green-300 font-semibold cursor-pointer"
      @click="$emit('switch-to-login')"
    >
      Войти в аккаунт
    </div>
  </Form>

  <Dialog
    v-model:visible="visible"
    modal
    :draggable="false"
    :closable="false"
    :style="{ width: '25rem' }"
  >
    <template #header>
      <h3 class="text-center w-full text-lg font-semibold leading-snug">
        Введите код подтверждения
      </h3>
    </template>

    <div class="flex flex-col items-center gap-3 mt-4 mb-4">
      <InputOtp name="passcode" />

      <div v-if="timer > 0" class="text-gray-400 text-sm font-medium mt-2">
        Повторная отправка через 
        <span class="text-white">{{ formatTime(timer) }}</span>
      </div>

      <Button
        v-else
        type="button"
        label="Запросить ещё раз"
        text
        size="small"
        severity="secondary"
        class="mt-2 opacity-80"
        @click="requestCodeAgain"
      />
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import { Form } from '@primevue/forms'
import Button from 'primevue/button'
import Password from 'primevue/password'
import InputOtp from 'primevue/inputotp';

import authServices from '@/services/authServices'
import type { RegisterDto } from '@/types/AuthTypes'
import { useUserStore } from '@/stores/userStore'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'

const toast = useToast()
const userStore = useUserStore()
const router = useRouter()

const loading = ref(false)
const visible = ref(false)
const timer = ref(0)
const resendAttempts = ref(0)
let timerInterval: number | undefined

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

const startTimer = (duration: number) => {
  timer.value = duration
  clearInterval(timerInterval)
  timerInterval = window.setInterval(() => {
    if (timer.value > 0) {
      timer.value--
    } else {
      clearInterval(timerInterval)
    }
  }, 1000)
}

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

const requestCodeAgain = () => {
  resendAttempts.value++

  let duration = 60 
  if (resendAttempts.value === 2) duration = 300 
  else if (resendAttempts.value === 3) duration = 600 
  else if (resendAttempts.value >= 4) duration = 900 
  toast.add({
    severity: 'info',
    summary: `Код повторно отправлен (ожидание ${formatTime(duration)})`,
    life: 3000
  })

  startTimer(duration)
}
</script>

<style lang="scss" scoped>
.p-dialog-header {
  display: flex;
  justify-content: center !important;
  text-align: center;
  width: 100%;
  padding: var(--p-dialog-header-padding);
}

.text-gray-400 {
  color: #9ca3af;
}
</style>
