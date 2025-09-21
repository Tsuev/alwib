import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface User {
  id: string
  email: string
  nickname?: string
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)

  const setUser = (userData: User | null) => {
    user.value = userData
  }

  const clearUser = () => {
    user.value = null
  }

  return { user, setUser, clearUser }
})
