import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types/AuthTypes'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const authInitialized = ref(false)

  const setUser = (userData: User | null) => {
    user.value = userData
    isAuthenticated.value = !!userData
  }

  const clearUser = () => {
    user.value = null
    isAuthenticated.value = false
  }

  const setAuthInitialized = (value: boolean) => {
    authInitialized.value = value
  }

  return { user, isAuthenticated, authInitialized, setUser, clearUser, setAuthInitialized }
})
