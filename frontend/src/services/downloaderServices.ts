import axios from '@/plugins/axios'
import type { RequestDownloadResponse } from '@/types/downloader'

export const requestDownload = async (url: string): Promise<RequestDownloadResponse> => {
  const response = await axios.post<RequestDownloadResponse>(
    '/downloader/request',
    { url },
    {
      withCredentials: true,
    },
  )

  return response.data
}
