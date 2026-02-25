import axios from '@/plugins/axios'
import type { VpnOverviewResponse, VpnTrialResponse } from '@/types/vpn'
import { type ToastServiceMethods } from 'primevue/toastservice'

interface AxiosError {
  response?: {
    data?: {
      message?: string | string[]
    }
  }
}

const getErrorMessage = (error: unknown, fallback: string): string => {
  const axiosError = error as AxiosError
  const message = axiosError?.response?.data?.message

  if (Array.isArray(message)) {
    return message.join(', ')
  }

  return message || fallback
}

export const getMyVpnData = async (
  toast?: ToastServiceMethods,
): Promise<VpnOverviewResponse | null> => {
  try {
    const response = await axios.get<VpnOverviewResponse>('/vpn/me', {
      withCredentials: true,
    })
    return response.data
  } catch (error: unknown) {
    if (toast) {
      toast.add({
        severity: 'error',
        summary: 'Ошибка VPN',
        detail: getErrorMessage(error, 'Не удалось загрузить VPN данные'),
        life: 3000,
      })
    }
    return null
  }
}

export const claimTrial = async (toast: ToastServiceMethods): Promise<VpnTrialResponse | null> => {
  try {
    const response = await axios.post<VpnTrialResponse>(
      '/vpn/trial',
      {},
      {
        withCredentials: true,
      },
    )

    toast.add({
      severity: 'success',
      summary: 'Пробный доступ',
      detail: response.data.message,
      life: 3000,
    })

    return response.data
  } catch (error: unknown) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: getErrorMessage(error, 'Не удалось запросить пробный ключ'),
      life: 3000,
    })
    return null
  }
}
