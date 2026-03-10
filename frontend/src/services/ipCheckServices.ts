import axios from '@/plugins/axios'
import type { IpCheckResult } from '@/types/ipCheck'

export const lookup = async (query: string): Promise<IpCheckResult> => {
  const response = await axios.post<IpCheckResult>(
    '/ip-check/lookup',
    { query },
    { withCredentials: true },
  )
  return response.data
}
