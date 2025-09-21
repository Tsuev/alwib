import axios from 'axios'
import { useUserStore } from '@/stores/userStore'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // from .env files
  withCredentials: true, // Включаем отправку cookies
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized, logging out...')
      // Очищаем стор пользователя при 401 ошибке
      const userStore = useUserStore()
      userStore.clearUser()
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
