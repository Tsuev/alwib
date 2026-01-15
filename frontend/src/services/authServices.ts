import axios from '@/plugins/axios'
import type {
  RegisterDto,
  LoginDto,
  AuthResponse,
  ProfileResponse,
  VerifyResponse,
  RegisterResponse,
  RequestOtpDto,
  VerifyOtpDto,
} from '@/types/AuthTypes'
import { type ToastServiceMethods } from 'primevue/toastservice'

interface AxiosError {
  response?: {
    data?: {
      message?: string
    }
  }
}

const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  const axiosError = error as AxiosError
  return axiosError?.response?.data?.message || defaultMessage
}

const register = async (
  registerDto: RegisterDto,
  toast: ToastServiceMethods,
): Promise<RegisterResponse | null> => {
  try {
    const response = await axios.post<RegisterResponse>('/auth/register', registerDto, {
      withCredentials: true,
    })

    toast.add({
      severity: 'success',
      summary: 'Регистрация успешна',
      detail: response.data.message,
      life: 3000,
    })

    return response.data
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'Ошибка регистрации')

    toast.add({
      severity: 'error',
      summary: 'Ошибка регистрации',
      detail: errorMessage,
      life: 3000,
    })

    return null
  }
}

const requestOtp = async (
  requestOtpDto: RequestOtpDto,
  toast: ToastServiceMethods,
): Promise<boolean> => {
  try {
    await axios.post('/auth/request-otp', requestOtpDto, {
      withCredentials: true,
    })

    toast.add({
      severity: 'success',
      summary: 'Код отправлен',
      detail: 'Проверьте почту для подтверждения',
      life: 3000,
    })

    return true
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'Ошибка отправки кода')

    toast.add({
      severity: 'error',
      summary: 'Ошибка отправки кода',
      detail: errorMessage,
      life: 3000,
    })

    return false
  }
}

const verifyOtp = async (
  verifyOtpDto: VerifyOtpDto,
  toast: ToastServiceMethods,
): Promise<AuthResponse | null> => {
  try {
    const response = await axios.post<AuthResponse>('/auth/verify-otp', verifyOtpDto, {
      withCredentials: true,
    })

    toast.add({
      severity: 'success',
      summary: 'Почта подтверждена',
      detail: response.data.message,
      life: 3000,
    })

    return response.data
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'Ошибка подтверждения кода')

    toast.add({
      severity: 'error',
      summary: 'Ошибка подтверждения',
      detail: errorMessage,
      life: 3000,
    })

    return null
  }
}

const login = async (
  loginDto: LoginDto,
  toast: ToastServiceMethods,
): Promise<AuthResponse | null> => {
  try {
    const response = await axios.post<AuthResponse>('/auth/login', loginDto, {
      withCredentials: true,
    })

    toast.add({
      severity: 'success',
      summary: 'Вход выполнен',
      detail: response.data.message,
      life: 3000,
    })

    return response.data
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'Ошибка входа')

    toast.add({
      severity: 'error',
      summary: 'Ошибка входа',
      detail: errorMessage,
      life: 3000,
    })

    return null
  }
}

const logout = async (toast: ToastServiceMethods): Promise<boolean> => {
  try {
    await axios.post(
      '/auth/logout',
      {},
      {
        withCredentials: true,
      },
    )

    toast.add({
      severity: 'success',
      summary: 'Выход выполнен',
      detail: 'Вы успешно вышли из системы',
      life: 3000,
    })

    return true
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'Ошибка выхода')

    toast.add({
      severity: 'error',
      summary: 'Ошибка выхода',
      detail: errorMessage,
      life: 3000,
    })

    return false
  }
}

const getProfile = async (toast?: ToastServiceMethods): Promise<ProfileResponse | null> => {
  try {
    const response = await axios.get<ProfileResponse>('/auth/profile', {
      withCredentials: true,
    })

    return response.data
  } catch (error: unknown) {
    if (toast) {
      const errorMessage = getErrorMessage(error, 'Ошибка получения профиля')

      toast.add({
        severity: 'error',
        summary: 'Ошибка получения данных',
        detail: errorMessage,
        life: 3000,
      })
    }

    return null
  }
}

const verifyToken = async (toast?: ToastServiceMethods): Promise<VerifyResponse | null> => {
  try {
    const response = await axios.get<VerifyResponse>('/auth/verify', {
      withCredentials: true,
    })

    return response.data
  } catch (error: unknown) {
    if (toast) {
      const errorMessage = getErrorMessage(error, 'Токен недействителен')

      toast.add({
        severity: 'error',
        summary: 'Ошибка проверки токена',
        detail: errorMessage,
        life: 3000,
      })
    }

    return null
  }
}

export default {
  register,
  requestOtp,
  verifyOtp,
  login,
  logout,
  getProfile,
  verifyToken,
}
