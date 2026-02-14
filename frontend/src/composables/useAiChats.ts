import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { agentOptions, type AgentValue, type ChatItem } from '@/types/ai'

const PINNED_CHATS_STORAGE_KEY = 'alwib-ai-pinned-chats-v1'

const makeChatId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

const createChat = (seed?: Partial<ChatItem>): ChatItem => ({
  id: seed?.id ?? makeChatId(),
  agent: seed?.agent ?? 'standard',
  pinned: seed?.pinned ?? false,
})

export const useAiChats = () => {
  const chats = ref<ChatItem[]>([])
  const expandedChatId = ref<string | null>(null)
  const previousBodyOverflow = ref('')
  const isScrollLockedByModal = ref(false)

  const ensureAtLeastOneChat = () => {
    if (chats.value.length === 0) {
      chats.value = [createChat()]
    }
  }

  const loadPinnedChats = () => {
    try {
      const raw = localStorage.getItem(PINNED_CHATS_STORAGE_KEY)
      if (!raw) {
        chats.value = [createChat()]
        return
      }

      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) {
        chats.value = [createChat()]
        return
      }

      const restored = parsed
        .filter((item): item is Partial<ChatItem> => Boolean(item && typeof item === 'object'))
        .map((item) =>
          createChat({
            id: typeof item.id === 'string' ? item.id : undefined,
            agent: agentOptions.some((agent) => agent.value === item.agent)
              ? (item.agent as AgentValue)
              : 'standard',
            pinned: true,
          }),
        )

      chats.value = restored.length ? restored : [createChat()]
    } catch {
      chats.value = [createChat()]
    }
  }

  const persistPinnedChats = () => {
    const pinned = chats.value
      .filter((chat) => chat.pinned)
      .map((chat) => ({ id: chat.id, agent: chat.agent, pinned: true }))
    localStorage.setItem(PINNED_CHATS_STORAGE_KEY, JSON.stringify(pinned))
  }

  onMounted(() => {
    loadPinnedChats()
  })

  watch(chats, persistPinnedChats, { deep: true })

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

  const removeChat = (id: string) => {
    chats.value = chats.value.filter((chat) => chat.id !== id)
    if (expandedChatId.value === id) {
      expandedChatId.value = null
    }
    ensureAtLeastOneChat()
  }

  const togglePin = (id: string) => {
    const target = chats.value.find((chat) => chat.id === id)
    if (!target) {
      return
    }

    const chatsWithoutTarget = chats.value.filter((chat) => chat.id !== id)
    const updatedTarget = { ...target, pinned: !target.pinned }
    const pinnedCount = chatsWithoutTarget.filter((chat) => chat.pinned).length

    if (updatedTarget.pinned) {
      chatsWithoutTarget.splice(pinnedCount, 0, updatedTarget)
      chats.value = chatsWithoutTarget
      return
    }

    chatsWithoutTarget.splice(pinnedCount, 0, updatedTarget)
    chats.value = chatsWithoutTarget
  }

  const openExpanded = (id: string) => {
    expandedChatId.value = id
  }

  const closeExpanded = () => {
    expandedChatId.value = null
  }

  const setAgent = (id: string, value: string) => {
    if (!agentOptions.some((agent) => agent.value === value)) {
      return
    }
    chats.value = chats.value.map((chat) =>
      chat.id === id ? { ...chat, agent: value as AgentValue } : chat,
    )
  }

  const expandedChat = computed(() =>
    chats.value.find((chat) => chat.id === expandedChatId.value),
  )

  return {
    chats,
    expandedChat,
    addChat,
    removeChat,
    togglePin,
    openExpanded,
    closeExpanded,
    setAgent,
  }
}
