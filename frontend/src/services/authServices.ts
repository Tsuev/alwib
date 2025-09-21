/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UserAuthType } from '@/types/AuthTypes'
import { type ToastServiceMethods } from 'primevue/toastservice'
import type { User } from '@/stores/userStore'

// Проходная авторизация - всегда успешная
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const signUp = async ({ email, password, nickname }: UserAuthType, toast: ToastServiceMethods) => {
  try {
    // Имитируем задержку сети
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Создаем фиктивного пользователя
    const user: User = {
      id: `user_${Date.now()}`,
      email,
      nickname,
    }

    // Создаем фиктивную сессию
    const session = {
      access_token: `fake_token_${Date.now()}`,
      refresh_token: `fake_refresh_${Date.now()}`,
      expires_in: 3600,
      token_type: 'bearer',
    }

    toast.add({
      severity: 'success',
      summary: 'Регистрация успешна',
      detail: 'Добро пожаловать!',
      life: 3000,
    })

    return { session, user }
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка регистрации',
      detail: error?.message,
      life: 3000,
    })
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const login = async (
  { email, password }: Omit<UserAuthType, 'nickname'>,
  toast: ToastServiceMethods,
) => {
  try {
    // Имитируем задержку сети
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Создаем фиктивного пользователя
    const user: User = {
      id: `user_${Date.now()}`,
      email,
      nickname: email.split('@')[0], // Используем часть email как никнейм
    }

    // Создаем фиктивную сессию
    const session = {
      access_token: `fake_token_${Date.now()}`,
      refresh_token: `fake_refresh_${Date.now()}`,
      expires_in: 3600,
      token_type: 'bearer',
    }

    toast.add({
      severity: 'success',
      summary: 'Вход выполнен',
      detail: 'Добро пожаловать!',
      life: 3000,
    })

    return { session, user }
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка входа',
      detail: error?.message,
      life: 3000,
    })
  }
}

const getUser = async (toast?: ToastServiceMethods) => {
  try {
    // Проверяем токен в localStorage
    const token = localStorage.getItem('access_token')

    if (!token) {
      return null
    }

    // Возвращаем фиктивного пользователя
    const user: User = {
      id: 'current_user',
      email: 'user@example.com',
      nickname: 'Пользователь',
    }

    return user
  } catch (error: any) {
    if (toast) {
      toast.add({
        severity: 'error',
        summary: 'Ошибка получения данных',
        detail: error?.message,
        life: 3000,
      })
    }
  }
}

export default { signUp, login, getUser }
