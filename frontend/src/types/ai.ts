export type AgentValue =
  | 'standard'
  | 'marketing'
  | 'interview'
  | 'exam'
  | 'code'
  | 'architecture'
  | 'business'
  | 'finance'
  | 'system'

export type AiMessageRole = 'user' | 'assistant'

export type AiChatMessage = {
  id: string
  role: AiMessageRole
  content: string
  createdAt: string
}

export type ChatItem = {
  id: string
  agent: AgentValue
  pinned: boolean
  roleLocked: boolean
  input: string
  messages: AiChatMessage[]
  isTyping: boolean
}

export type AgentOption = {
  label: string
  value: AgentValue
}

export type RespondAiRequest = {
  chatId: string
  agent: AgentValue
  messages: Array<{
    role: AiMessageRole
    content: string
  }>
}

export type RespondAiResponse = {
  answer: string
}

export type PinnedChatPayload = {
  agent: AgentValue
  roleLocked: boolean
  input: string
  messages: Array<{
    role: AiMessageRole
    content: string
  }>
}

export type PinnedChatResponse = {
  id: string
  agent: AgentValue
  roleLocked: boolean
  input: string
  pinned: true
  createdAt: string
  updatedAt: string
  messages: AiChatMessage[]
}

export const CHAT_INPUT_MAX_LENGTH = 1000

export const agentOptions: AgentOption[] = [
  { label: 'Стандартный ассистент', value: 'standard' },
  { label: 'Маркетинг ассистент', value: 'marketing' },
  { label: 'Интервью ассистент', value: 'interview' },
  { label: 'Экзаменационный ассистент', value: 'exam' },
  { label: 'Код ассистент', value: 'code' },
  { label: 'Архитектурный ассистент', value: 'architecture' },
  { label: 'Бизнес ассистент', value: 'business' },
  { label: 'Финансовый ассистент', value: 'finance' },
  { label: 'Системный ассистент', value: 'system' },
]

export const getAgentLabel = (value: AgentValue) =>
  agentOptions.find((agent) => agent.value === value)?.label ?? 'Стандартный ассистент'
