<template>
  <DefaultLayout :class="layout()">
    <header :class="header()">
      <h1 :class="title()">ИИ ассистенты</h1>
      <p :class="lead()">
        Создавайте несколько независимых чатов, переключайте агентов и закрепляйте нужные окна.
      </p>
    </header>

    <section ref="chatWorkspaceRef" :class="workspace()">
      <TransitionGroup name="chat-list" tag="div" :class="chatRow()" :style="chatRowStyle">
        <template v-if="isLoadingPinnedChats">
          <article v-for="index in 3" :key="`skeleton-${index}`" :class="skeletonCard()">
            <div :class="skeletonHeader()">
              <Skeleton width="90px" height="24px" />
              <Skeleton width="150px" height="30px" />
            </div>
            <div :class="skeletonBody()">
              <Skeleton width="70%" height="12px" />
              <Skeleton width="56%" height="12px" />
              <Skeleton width="82%" height="12px" />
            </div>
            <div :class="skeletonFooter()">
              <Skeleton width="100%" height="36px" />
              <Skeleton width="40px" height="36px" />
            </div>
          </article>
        </template>
        <template v-else>
          <AiChatCard
            v-for="chat in chats"
            :key="chat.id"
            :chat="chat"
            :agent-options="agentOptions"
            @remove-chat="removeChat"
            @open-expanded="openExpanded"
            @toggle-pin="togglePin"
            @set-agent="setAgent"
            @set-input="setInput"
            @send-message="sendMessage"
          />

          <AiAddChatCard key="add-chat-card" @add-chat="addChat" />
        </template>
      </TransitionGroup>
    </section>

    <Transition name="expanded-chat" appear>
      <AiExpandedChatModal
        v-if="expandedChat"
        :chat="expandedChat"
        :agent-options="agentOptions"
        @close="closeExpanded"
        @toggle-pin="togglePin"
        @set-agent="setAgent"
        @set-input="setInput"
        @send-message="sendMessage"
      />
    </Transition>
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AiChatCard from '@/components/ai/AiChatCard.vue'
import AiAddChatCard from '@/components/ai/AiAddChatCard.vue'
import AiExpandedChatModal from '@/components/ai/AiExpandedChatModal.vue'
import { agentOptions } from '@/types/ai'
import { useAiChats } from '@/composables/useAiChats'
import { tv } from 'tailwind-variants'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import Skeleton from 'primevue/skeleton'

const {
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
} = useAiChats()
const chatWorkspaceRef = ref<HTMLElement | null>(null)
const chatRowWidth = ref<number | null>(null)
let chatWorkspaceObserver: ResizeObserver | null = null

const CARD_WIDTH = 360
const MOBILE_GAP = 16
const DESKTOP_GAP = 20

const getGapSize = (width: number) => (width >= 768 ? DESKTOP_GAP : MOBILE_GAP)

const updateChatRowWidth = () => {
  const workspace = chatWorkspaceRef.value
  if (!workspace) {
    chatRowWidth.value = null
    return
  }

  const availableWidth = workspace.clientWidth
  const gap = getGapSize(window.innerWidth)
  const columns = Math.max(1, Math.floor((availableWidth + gap) / (CARD_WIDTH + gap)))
  const targetWidth = columns * CARD_WIDTH + (columns - 1) * gap

  chatRowWidth.value = Math.min(availableWidth, targetWidth)
}

onMounted(() => {
  updateChatRowWidth()

  if (chatWorkspaceRef.value) {
    chatWorkspaceObserver = new ResizeObserver(updateChatRowWidth)
    chatWorkspaceObserver.observe(chatWorkspaceRef.value)
  }

  window.addEventListener('resize', updateChatRowWidth)
})

onUnmounted(() => {
  chatWorkspaceObserver?.disconnect()
  window.removeEventListener('resize', updateChatRowWidth)
})

const chatRowStyle = computed(() => ({
  width: chatRowWidth.value ? `${chatRowWidth.value}px` : '100%',
  maxWidth: '100%',
}))

const styles = tv({
  slots: {
    layout: ['flex flex-col gap-8'],
    header: ['flex flex-col gap-2'],
    title: ['text-3xl font-semibold text-white'],
    lead: ['text-slate-300'],
    workspace: ['mt-[36px] mx-auto w-full max-w-[1940px] px-3 sm:px-4 lg:px-6'],
    chatRow: [
      'mt-4 mx-auto grid justify-start gap-x-4 gap-y-4 md:gap-x-5 md:gap-y-5',
      '[grid-template-columns:repeat(auto-fit,minmax(320px,360px))]',
    ],
    skeletonCard: [
      'flex h-[430px] w-full max-w-[360px] flex-col rounded-2xl border border-slate-800/80',
      'bg-slate-950/75 px-3.5 pb-3 pt-3.5 shadow-xl shadow-black/30 backdrop-blur',
    ],
    skeletonHeader: ['mb-3 flex items-center justify-between gap-2'],
    skeletonBody: [
      'flex min-h-0 flex-1 flex-col gap-3 overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/50 p-3',
    ],
    skeletonFooter: ['mt-3 flex items-center gap-2 px-1'],
  },
})

const {
  layout,
  header,
  title,
  lead,
  workspace,
  chatRow,
  skeletonCard,
  skeletonHeader,
  skeletonBody,
  skeletonFooter,
} = styles()
</script>

<style scoped>
.chat-list-move,
.chat-list-enter-active,
.chat-list-leave-active {
  transition: transform 260ms ease, opacity 220ms ease;
}

.chat-list-enter-from,
.chat-list-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}

.chat-list-leave-active {
  position: absolute;
}

:deep(.expanded-chat-enter-active),
:deep(.expanded-chat-leave-active) {
  transition: opacity 260ms ease;
}

:deep(.expanded-chat-enter-from),
:deep(.expanded-chat-leave-to) {
  opacity: 0;
}

:deep(.expanded-chat-enter-active .ai-expanded-panel),
:deep(.expanded-chat-leave-active .ai-expanded-panel) {
  transition: transform 280ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease;
  will-change: transform, opacity;
}

:deep(.expanded-chat-enter-from .ai-expanded-panel),
:deep(.expanded-chat-leave-to .ai-expanded-panel) {
  opacity: 0;
  transform: translateY(14px) scale(0.975);
}

@media (prefers-reduced-motion: reduce) {
  :deep(.expanded-chat-enter-active),
  :deep(.expanded-chat-leave-active),
  :deep(.expanded-chat-enter-active .ai-expanded-panel),
  :deep(.expanded-chat-leave-active .ai-expanded-panel) {
    transition: none;
  }
}
</style>
