export type AgentValue = 'standard' | 'marketing' | 'interview' | 'code'

export type ChatItem = {
  id: string
  agent: AgentValue
  pinned: boolean
}

export type AgentOption = {
  label: string
  value: AgentValue
}

export const agentOptions: AgentOption[] = [
  { label: 'Стандартный агент', value: 'standard' },
  { label: 'Маркетолог', value: 'marketing' },
  { label: 'Интервью-ассистент', value: 'interview' },
  { label: 'Код-ассистент', value: 'code' },
]

export const getAgentLabel = (value: AgentValue) =>
  agentOptions.find((agent) => agent.value === value)?.label ?? 'Стандартный агент'
