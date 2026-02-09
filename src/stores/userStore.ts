import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types/AuthTypes'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)

  const setUser = (userData: User | null) => {
    user.value = userData
    isAuthenticated.value = !!userData
  }

  const clearUser = () => {
    user.value = null
    isAuthenticated.value = false
  }

  return { user, isAuthenticated, setUser, clearUser }
})
