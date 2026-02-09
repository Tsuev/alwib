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
  User,
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

const DEV_EMAIL = 'tsuev@alwib.ru'
const DEV_PASSWORD = '0000'
const DEV_OTP = '0000'
const DEV_TOKEN = 'dev-token-tsuev'

const DEV_USER: User = {
  id: 1,
  email: DEV_EMAIL,
  role: 'owner',
  createdAt: '2024-01-01T00:00:00.000Z',
}

const persistDevSession = () => {
  try {
    localStorage.setItem('token', DEV_TOKEN)
    localStorage.setItem('dev_user', JSON.stringify(DEV_USER))
  } catch (error) {
    console.warn('Не удалось сохранить dev-сессию', error)
  }
}

const clearDevSession = () => {
  try {
    localStorage.removeItem('token')
    localStorage.removeItem('dev_user')
  } catch (error) {
    console.warn('Не удалось очистить dev-сессию', error)
  }
}

const getDevSession = (): User | null => {
  try {
    const token = localStorage.getItem('token')
    if (token !== DEV_TOKEN) return null
    const rawUser = localStorage.getItem('dev_user')
    if (!rawUser) return DEV_USER
    return JSON.parse(rawUser) as User
  } catch (error) {
    console.warn('Не удалось прочитать dev-сессию', error)
    return null
  }
}

const register = async (
  registerDto: RegisterDto,
  toast: ToastServiceMethods,
): Promise<RegisterResponse | null> => {
  try {
    if (registerDto.email === DEV_EMAIL && registerDto.password === DEV_PASSWORD) {
      toast.add({
        severity: 'success',
        summary: 'Регистрация успешна',
        detail: 'Dev-доступ активирован',
        life: 3000,
      })
      return { message: 'Dev-доступ активирован', user: DEV_USER }
    }

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
    if (requestOtpDto.email === DEV_EMAIL) {
      toast.add({
        severity: 'success',
        summary: 'Код отправлен',
        detail: 'Используйте 0000',
        life: 3000,
      })
      return true
    }

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
    if (verifyOtpDto.email === DEV_EMAIL && verifyOtpDto.code === DEV_OTP) {
      persistDevSession()
      toast.add({
        severity: 'success',
        summary: 'Почта подтверждена',
        detail: 'Dev-доступ активирован',
        life: 3000,
      })
      return { message: 'Dev-доступ активирован', user: DEV_USER }
    }

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
    if (loginDto.email === DEV_EMAIL && loginDto.password === DEV_PASSWORD) {
      persistDevSession()
      toast.add({
        severity: 'success',
        summary: 'Вход выполнен',
        detail: 'Dev-доступ активирован',
        life: 3000,
      })
      return { message: 'Dev-доступ активирован', user: DEV_USER }
    }

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
    const devSession = getDevSession()
    if (devSession) {
      clearDevSession()
      toast.add({
        severity: 'success',
        summary: 'Выход выполнен',
        detail: 'Dev-доступ завершён',
        life: 3000,
      })
      return true
    }

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
    const devSession = getDevSession()
    if (devSession) {
      return { user: devSession }
    }

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
    const devSession = getDevSession()
    if (devSession) {
      return { valid: true, user: devSession }
    }

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
