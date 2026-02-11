<template>
  <DefaultLayout :class="layout()">
    <header :class="header()">
      <h1 :class="title()">ИИ ассистенты</h1>
      <p :class="lead()">
        Создавайте несколько независимых чатов, переключайте агентов и закрепляйте нужные окна.
      </p>
    </header>

    <section :class="workspace()">
      <div :class="chatRow()">
        <article
          v-for="chat in chats"
          :key="chat.id"
          :class="[chatCard(), chat.pinned ? pinnedChatCard() : '']"
          :style="chat.pinned ? pinnedCardStyle : undefined"
        >
          <div :class="chatHeader()">
            <div :class="macButtons()">
              <Button
                type="button"
                icon="pi pi-times"
                rounded
                text
                :class="[macButton(), closeButton()]"
                aria-label="Закрыть чат"
                :pt="{ icon: { class: macIcon() } }"
                @click="removeChat(chat.id)"
              />
              <Button
                type="button"
                icon="pi pi-window-maximize"
                rounded
                text
                :class="[macButton(), expandButton()]"
                aria-label="Развернуть чат"
                :pt="{ icon: { class: macIcon() } }"
                @click="openExpanded(chat.id)"
              />
              <Button
                type="button"
                icon="pi pi-thumbtack"
                rounded
                text
                :class="[macButton(), pinButton(), chat.pinned ? macButtonActive() : '']"
                aria-label="Закрепить чат"
                :pt="{ icon: { class: macIcon() } }"
                @click="togglePin(chat.id)"
              />
            </div>

            <div :class="selectWrap()">
              <select
                :value="chat.agent"
                :class="agentSelect()"
                @change="setAgent(chat.id, ($event.target as HTMLSelectElement).value)"
              >
                <option v-for="agent in agentOptions" :key="agent.value" :value="agent.value">
                  {{ agent.label }}
                </option>
              </select>
              <i class="pi pi-chevron-down" :class="selectIcon()"></i>
            </div>
          </div>

          <div :class="chatBody()">
            <div :class="messageIncoming()">Чем помочь в этом диалоге?</div>
            <div :class="messageOutgoing()">
              Выбран агент:
              <span :class="agentBadge()">{{ getAgentLabel(chat.agent) }}</span>
            </div>
          </div>

          <div :class="chatFooter()">
            <input type="text" placeholder="Введите сообщение..." :class="chatInput()" />
            <button type="button" :class="sendButton()">
              <i class="pi pi-send"></i>
            </button>
          </div>
        </article>

        <button type="button" :class="addChatButton()" @click="addChat">
          <i class="pi pi-plus" :class="addIcon()"></i>
          <span :class="addText()">Новый чат</span>
        </button>
      </div>
    </section>

    <div v-if="expandedChat" :class="expandedOverlay()" @click="expandedChatId = null">
      <div :class="expandedPanel()" @click.stop>
        <div :class="chatHeader()">
          <div :class="macButtons()">
            <Button
              type="button"
              icon="pi pi-times"
              rounded
              text
              :class="[macButton(), closeButton()]"
              aria-label="Закрыть модальное окно"
              :pt="{ icon: { class: macIcon() } }"
              @click="expandedChatId = null"
            />
            <Button
              type="button"
              icon="pi pi-window-maximize"
              rounded
              text
              :class="[macButton(), expandButton(), macButtonActive()]"
              :pt="{ icon: { class: macIcon() } }"
            />
            <Button
              type="button"
              icon="pi pi-thumbtack"
              rounded
              text
              :class="[macButton(), pinButton(), expandedChat.pinned ? macButtonActive() : '']"
              :pt="{ icon: { class: macIcon() } }"
              @click="togglePin(expandedChat.id)"
            />
          </div>

          <div :class="selectWrap()">
            <select
              :value="expandedChat.agent"
              :class="agentSelect()"
              @change="setAgent(expandedChat.id, ($event.target as HTMLSelectElement).value)"
            >
              <option v-for="agent in agentOptions" :key="agent.value" :value="agent.value">
                {{ agent.label }}
              </option>
            </select>
            <i class="pi pi-chevron-down" :class="selectIcon()"></i>
          </div>
        </div>

        <div :class="expandedBody()">
          <div :class="messageIncoming()">Полноэкранный режим чата активен.</div>
          <div :class="messageOutgoing()">
            Агент:
            <span :class="agentBadge()">{{ getAgentLabel(expandedChat.agent) }}</span>
          </div>
        </div>

        <div :class="chatFooter()">
          <input type="text" placeholder="Введите сообщение..." :class="chatInput()" />
          <button type="button" :class="sendButton()">
            <i class="pi pi-send"></i>
          </button>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { tv } from 'tailwind-variants'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Button from 'primevue/button'

type AgentValue = 'standard' | 'marketing' | 'interview' | 'code'

type ChatItem = {
  id: string
  agent: AgentValue
  pinned: boolean
}

const PINNED_CHATS_STORAGE_KEY = 'alwib-ai-pinned-chats-v1'

const agentOptions: Array<{ label: string; value: AgentValue }> = [
  { label: 'Стандартный агент', value: 'standard' },
  { label: 'Маркетолог', value: 'marketing' },
  { label: 'Интервью-ассистент', value: 'interview' },
  { label: 'Код-ассистент', value: 'code' },
]

const chats = ref<ChatItem[]>([])
const expandedChatId = ref<string | null>(null)
const previousBodyOverflow = ref('')
const isScrollLockedByModal = ref(false)

const makeChatId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

const createChat = (seed?: Partial<ChatItem>): ChatItem => ({
  id: seed?.id ?? makeChatId(),
  agent: seed?.agent ?? 'standard',
  pinned: seed?.pinned ?? false,
})

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
  chats.value = chats.value.map((chat) =>
    chat.id === id ? { ...chat, pinned: !chat.pinned } : chat,
  )
}

const openExpanded = (id: string) => {
  expandedChatId.value = id
}

const setAgent = (id: string, value: string) => {
  if (!agentOptions.some((agent) => agent.value === value)) {
    return
  }
  chats.value = chats.value.map((chat) =>
    chat.id === id ? { ...chat, agent: value as AgentValue } : chat,
  )
}

const getAgentLabel = (value: AgentValue) =>
  agentOptions.find((agent) => agent.value === value)?.label ?? 'Стандартный агент'

const expandedChat = computed(() => chats.value.find((chat) => chat.id === expandedChatId.value))
const pinnedCardStyle = {
  boxShadow: '0 0 15px rgba(110, 231, 183, 0.38), 0 0 8px rgba(16, 185, 129, 0.26)',
}

const styles = tv({
  slots: {
    layout: ['flex flex-col gap-8'],
    header: ['flex flex-col gap-2'],
    title: ['text-3xl font-semibold text-white'],
    lead: ['text-slate-300'],
    workspace: ['mt-2'],
    chatRow: ['mt-4 flex flex-wrap items-start justify-center gap-4 md:justify-start'],
    chatCard: [
      'flex h-[430px] w-full max-w-[360px] flex-col rounded-2xl border border-slate-800/80',
      'bg-slate-950/75 px-3.5 pb-3 pt-3.5 shadow-xl shadow-black/30 backdrop-blur',
    ],
    pinnedChatCard: [
      'border-emerald-400/70 ring-1 ring-emerald-300/40',
    ],
    chatHeader: ['mb-3 flex items-center justify-between gap-2'],
    macButtons: ['flex items-center gap-2'],
    macButton: [
      'group !flex !h-6 !w-6 !items-center !justify-center !rounded-full !border !p-0',
      'transition focus:outline-none',
    ],
    closeButton: ['!border-red-500/60 !bg-red-400 hover:!bg-red-300'],
    expandButton: ['!border-amber-500/60 !bg-amber-300 hover:!bg-amber-200'],
    pinButton: ['!border-emerald-500/60 !bg-emerald-300 hover:!bg-emerald-200'],
    macButtonActive: ['ring-2 ring-white/35'],
    macIcon: ['!text-[10px] !text-slate-900 !opacity-95'],
    selectWrap: ['relative'],
    agentSelect: [
      'h-8 min-w-[170px] appearance-none rounded-lg border border-slate-800',
      'bg-slate-900 pl-3 pr-8 text-xs text-slate-200 outline-none',
      'transition focus:border-slate-700',
    ],
    selectIcon: [
      'pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2',
      'text-[10px] text-slate-400',
    ],
    chatBody: [
      'flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto rounded-xl',
      'border border-slate-800/80 bg-slate-900/50 p-3',
    ],
    messageIncoming: ['max-w-[85%] rounded-xl bg-slate-800 px-3 py-2 text-xs text-slate-200'],
    messageOutgoing: [
      'ml-auto max-w-[85%] rounded-xl bg-emerald-500/20 px-3 py-2 text-right text-xs text-emerald-200',
    ],
    agentBadge: ['ml-1 font-semibold text-emerald-300'],
    chatFooter: ['mt-3 flex items-center gap-2 px-1'],
    chatInput: [
      'h-9 w-full rounded-lg border border-slate-800 bg-slate-900 px-3',
      'text-xs text-slate-100 outline-none placeholder:text-slate-500',
    ],
    sendButton: [
      'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-800',
      'bg-slate-900 text-slate-300 transition hover:text-white',
    ],
    addChatButton: [
      'flex h-[430px] w-full max-w-[360px] shrink-0 flex-col items-center justify-center rounded-2xl',
      'border border-dashed border-emerald-500/60 bg-slate-950/40 text-emerald-300',
      'transition hover:bg-slate-900/70 hover:text-emerald-200',
    ],
    addIcon: ['text-2xl'],
    addText: ['mt-3 text-center text-xs'],
    expandedOverlay: [
      'fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-3 md:p-6',
      'backdrop-blur-sm',
    ],
    expandedPanel: [
      'flex h-[92vh] w-full max-w-[1280px] flex-col rounded-2xl border border-slate-800',
      'bg-slate-950 p-5 shadow-2xl shadow-black/50',
    ],
    expandedBody: [
      'flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto rounded-xl',
      'border border-slate-800 bg-slate-900/40 p-4',
    ],
  },
})

const {
  layout,
  header,
  title,
  lead,
  workspace,
  chatRow,
  chatCard,
  pinnedChatCard,
  chatHeader,
  macButtons,
  macButton,
  closeButton,
  expandButton,
  pinButton,
  macButtonActive,
  macIcon,
  selectWrap,
  agentSelect,
  selectIcon,
  chatBody,
  messageIncoming,
  messageOutgoing,
  agentBadge,
  chatFooter,
  chatInput,
  sendButton,
  addChatButton,
  addIcon,
  addText,
  expandedOverlay,
  expandedPanel,
  expandedBody,
} = styles()
</script>
