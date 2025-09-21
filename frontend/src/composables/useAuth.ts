import { onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import authServices from '@/services/authServices'
import { useToast } from 'primevue/usetoast'

export const useAuth = () => {
  const userStore = useUserStore()
  const toast = useToast()

  const initializeAuth = async () => {
    try {
      // Проверяем валидность токена
      const verifyResponse = await authServices.verifyToken()

      if (verifyResponse?.valid && verifyResponse.user) {
        userStore.setUser(verifyResponse.user)
      } else {
        userStore.clearUser()
      }
    } catch (error) {
      console.error('Ошибка инициализации авторизации:', error)
      userStore.clearUser()
    }
  }

  const logout = async () => {
    try {
      const success = await authServices.logout(toast)
      if (success) {
        userStore.clearUser()
      }
    } catch (error) {
      console.error('Ошибка выхода:', error)
      // Даже если запрос не удался, очищаем локальное состояние
      userStore.clearUser()
    }
  }

  const refreshUser = async () => {
    try {
      const profileResponse = await authServices.getProfile()
      if (profileResponse?.user) {
        userStore.setUser(profileResponse.user)
      }
    } catch (error) {
      console.error('Ошибка обновления профиля:', error)
    }
  }

  return {
    initializeAuth,
    logout,
    refreshUser,
    isAuthenticated: userStore.isAuthenticated,
    user: userStore.user,
  }
}
