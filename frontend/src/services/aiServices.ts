import axios from '@/plugins/axios'
import type {
  PinnedChatPayload,
  PinnedChatResponse,
  RespondAiRequest,
  RespondAiResponse,
} from '@/types/ai'

export const getPinnedChats = async (): Promise<PinnedChatResponse[]> => {
  const response = await axios.get<PinnedChatResponse[]>('/ai/pinned-chats', {
    withCredentials: true,
  })
  return response.data
}

export const savePinnedChat = async (
  chatId: string,
  payload: PinnedChatPayload,
): Promise<PinnedChatResponse> => {
  const response = await axios.put<PinnedChatResponse>(`/ai/pinned-chats/${chatId}`, payload, {
    withCredentials: true,
  })
  return response.data
}

export const deletePinnedChat = async (chatId: string): Promise<{ deleted: boolean }> => {
  const response = await axios.delete<{ deleted: boolean }>(`/ai/pinned-chats/${chatId}`, {
    withCredentials: true,
  })
  return response.data
}

export const getAssistantReply = async (payload: RespondAiRequest): Promise<RespondAiResponse> => {
  const response = await axios.put<RespondAiResponse>('/ai/respond', payload, {
    withCredentials: true,
  })
  return response.data
}
