/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSupabase } from '@/composables/useSupabase'
import type { UserAuthType } from '@/types/AuthTypes'
import { type ToastServiceMethods } from 'primevue/toastservice'

const { supabase } = useSupabase()

const signUp = async ({ email, password, nickname }: UserAuthType, toast: ToastServiceMethods) => {
  try {
    const {
      data: { session, user },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nickname },
        emailRedirectTo: window.location.origin,
      },
    })

    if (error) throw error

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

const login = async (
  { email, password }: Omit<UserAuthType, 'nickname'>,
  toast: ToastServiceMethods,
) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) throw error

    return data
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
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) throw error

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
