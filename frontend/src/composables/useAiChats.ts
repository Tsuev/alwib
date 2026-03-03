import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import { aiServices } from '@/services'
import {
  CHAT_INPUT_MAX_LENGTH,
  agentOptions,
  type AgentValue,
  type AiChatMessage,
  type ChatItem,
  type PinnedChatPayload,
  type PinnedChatResponse,
} from '@/types/ai'

const SESSION_CHATS_STORAGE_KEY = 'alwib-ai-session-chats-v1'

type PersistedSessionChat = {
  id: string
  agent: AgentValue
  roleLocked: boolean
  input: string
  messages: Array<{
    id: string
    role: 'user' | 'assistant'
    content: string
    createdAt: string
  }>
}

const makeChatId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

const createMessage = (role: 'user' | 'assistant', content: string): AiChatMessage => ({
  id: makeChatId(),
  role,
  content,
  createdAt: new Date().toISOString(),
})

const createChat = (seed?: Partial<ChatItem>): ChatItem => ({
  id: seed?.id ?? makeChatId(),
  agent: seed?.agent ?? 'standard',
  pinned: seed?.pinned ?? false,
  roleLocked: seed?.roleLocked ?? false,
  input: seed?.input ?? '',
  messages: seed?.messages ?? [],
  isTyping: seed?.isTyping ?? false,
})

const mapPinnedToChat = (chat: PinnedChatResponse): ChatItem =>
  createChat({
    id: chat.id,
    agent: chat.agent,
    pinned: true,
    roleLocked: chat.roleLocked,
    input: chat.input,
    messages: chat.messages,
    isTyping: false,
  })

const mapChatToPinnedPayload = (chat: ChatItem): PinnedChatPayload => ({
  agent: chat.agent,
  roleLocked: chat.roleLocked,
  input: chat.input.slice(0, CHAT_INPUT_MAX_LENGTH),
  messages: chat.messages.map((message) => ({
    role: message.role,
    content: message.content,
  })),
})

const normalizeSessionChat = (chat: PersistedSessionChat): ChatItem =>
  createChat({
    id: chat.id,
    agent: chat.agent,
    pinned: false,
    roleLocked: chat.roleLocked,
    input: chat.input,
    messages: chat.messages,
    isTyping: false,
  })

export const useAiChats = () => {
  const toast = useToast()
  const chats = ref<ChatItem[]>([])
  const expandedChatId = ref<string | null>(null)
  const previousBodyOverflow = ref('')
  const isScrollLockedByModal = ref(false)
  const isLoadingPinnedChats = ref(true)

  const ensureAtLeastOneChat = () => {
    if (chats.value.length === 0) {
      chats.value = [createChat()]
    }
  }

  const orderPinnedFirst = (chatList: ChatItem[]) => {
    const pinned = chatList.filter((chat) => chat.pinned)
    const unpinned = chatList.filter((chat) => !chat.pinned)
    return [...pinned, ...unpinned]
  }

  const loadSessionChats = (): ChatItem[] => {
    try {
      const raw = sessionStorage.getItem(SESSION_CHATS_STORAGE_KEY)
      if (!raw) {
        return []
      }

      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) {
        return []
      }

      const restored = parsed
        .filter(
          (item): item is PersistedSessionChat =>
            Boolean(item && typeof item === 'object' && typeof item.id === 'string'),
        )
        .map((item) => normalizeSessionChat(item))

      return restored
    } catch {
      return []
    }
  }

  const persistSessionChats = () => {
    const unpinned = chats.value
      .filter((chat) => !chat.pinned)
      .map<PersistedSessionChat>((chat) => ({
        id: chat.id,
        agent: chat.agent,
        roleLocked: chat.roleLocked,
        input: chat.input.slice(0, CHAT_INPUT_MAX_LENGTH),
        messages: chat.messages,
      }))
    sessionStorage.setItem(SESSION_CHATS_STORAGE_KEY, JSON.stringify(unpinned))
  }

  const loadInitialChats = async () => {
    isLoadingPinnedChats.value = true
    const sessionChats = loadSessionChats()

    try {
      const pinnedChatsResponse = await aiServices.getPinnedChats()
      const pinnedChats = pinnedChatsResponse.map((chat) => mapPinnedToChat(chat))
      chats.value = orderPinnedFirst([...pinnedChats, ...sessionChats])
    } catch {
      chats.value = sessionChats
      toast.add({
        severity: 'warn',
        summary: 'ИИ ассистенты',
        detail: 'Не удалось загрузить закрепленные чаты. Показаны локальные сессии.',
        life: 3500,
      })
    } finally {
      ensureAtLeastOneChat()
      isLoadingPinnedChats.value = false
    }
  }

  const findChatById = (id: string) => chats.value.find((chat) => chat.id === id)

  const savePinnedIfNeeded = async (chatId: string) => {
    const chat = findChatById(chatId)
    if (!chat || !chat.pinned) {
      return
    }

    try {
      await aiServices.savePinnedChat(chat.id, mapChatToPinnedPayload(chat))
    } catch {
      toast.add({
        severity: 'error',
        summary: 'ИИ ассистенты',
        detail: 'Не удалось синхронизировать закрепленный чат.',
        life: 3500,
      })
    }
  }

  onMounted(() => {
    void loadInitialChats()
  })

  watch(chats, persistSessionChats, { deep: true })

  watch(expandedChatId, (value) => {
    if (value && !isScrollLockedByModal.value) {
      previousBodyOverflow.value = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      isScrollLockedByModal.value = true
      return
    }

    if (!value && isScrollLockedByModal.value) {
      document.body.style.overflow = previousBodyOverflow.value
      isScrollLockedByModal.value = false
    }
  })

  onUnmounted(() => {
    if (isScrollLockedByModal.value) {
      document.body.style.overflow = previousBodyOverflow.value
      isScrollLockedByModal.value = false
    }
  })

  const addChat = () => {
    chats.value.push(createChat())
  }

  const removeChat = async (id: string) => {
    const target = findChatById(id)
    if (!target) {
      return
    }

    if (target.pinned) {
      try {
        await aiServices.deletePinnedChat(id)
      } catch {
        toast.add({
          severity: 'error',
          summary: 'ИИ ассистенты',
          detail: 'Не удалось удалить закрепленный чат.',
          life: 3500,
        })
      }
    }

    chats.value = chats.value.filter((chat) => chat.id !== id)
    if (expandedChatId.value === id) {
      expandedChatId.value = null
    }
    ensureAtLeastOneChat()
  }

  const togglePin = async (id: string) => {
    const target = findChatById(id)
    if (!target) {
      return
    }

    if (target.pinned) {
      try {
        await aiServices.deletePinnedChat(id)
        target.pinned = false
        chats.value = orderPinnedFirst([...chats.value])
      } catch {
        toast.add({
          severity: 'error',
          summary: 'ИИ ассистенты',
          detail: 'Не удалось открепить чат.',
          life: 3500,
        })
      }
      return
    }

    try {
      const saved = await aiServices.savePinnedChat(target.id, mapChatToPinnedPayload(target))
      target.pinned = true
      target.agent = saved.agent
      target.roleLocked = saved.roleLocked
      target.input = saved.input
      target.messages = saved.messages
      chats.value = orderPinnedFirst([...chats.value])
    } catch {
      toast.add({
        severity: 'error',
        summary: 'ИИ ассистенты',
        detail: 'Не удалось закрепить чат.',
        life: 3500,
      })
    }
  }

  const openExpanded = (id: string) => {
    expandedChatId.value = id
  }

  const closeExpanded = () => {
    expandedChatId.value = null
  }

  const setAgent = async (id: string, value: string) => {
    const chat = findChatById(id)
    if (!chat || chat.roleLocked) {
      return
    }

    if (!agentOptions.some((agent) => agent.value === value)) {
      return
    }

    chat.agent = value as AgentValue
    await savePinnedIfNeeded(chat.id)
  }

  const setInput = (id: string, value: string) => {
    const chat = findChatById(id)
    if (!chat) {
      return
    }

    chat.input = value.slice(0, CHAT_INPUT_MAX_LENGTH)
  }

  const sendMessage = async (id: string) => {
    const chat = findChatById(id)
    if (!chat || chat.isTyping) {
      return
    }

    const text = chat.input.trim()
    if (!text) {
      return
    }

    const boundedText = text.slice(0, CHAT_INPUT_MAX_LENGTH)
    chat.messages = [...chat.messages, createMessage('user', boundedText)]
    chat.input = ''
    chat.roleLocked = true
    chat.isTyping = true
    await savePinnedIfNeeded(chat.id)

    try {
      const aiResponse = await aiServices.getAssistantReply({
        chatId: chat.id,
        agent: chat.agent,
        messages: chat.messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      })

      chat.messages = [...chat.messages, createMessage('assistant', aiResponse.answer)]
    } catch {
      toast.add({
        severity: 'error',
        summary: 'ИИ ассистенты',
        detail: 'Не удалось получить ответ от модели.',
        life: 3500,
      })
    } finally {
      chat.isTyping = false
      await savePinnedIfNeeded(chat.id)
    }
  }

  const expandedChat = computed(() => chats.value.find((chat) => chat.id === expandedChatId.value))

  return {
    chats,
    expandedChat,
    isLoadingPinnedChats,
    addChat,
    removeChat,
    togglePin,
    openExpanded,
    closeExpanded,
    setAgent,
    setInput,
    sendMessage,
  }
}
