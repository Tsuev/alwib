<template>
  <article
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
          @click="$emit('remove-chat', chat.id)"
        />
        <Button
          type="button"
          icon="pi pi-window-maximize"
          rounded
          text
          :class="[macButton(), expandButton()]"
          aria-label="Развернуть чат"
          :pt="{ icon: { class: macIcon() } }"
          @click="$emit('open-expanded', chat.id)"
        />
        <Button
          type="button"
          icon="pi pi-thumbtack"
          rounded
          text
          :class="[macButton(), pinButton(), chat.pinned ? macButtonActive() : '']"
          aria-label="Закрепить чат"
          :pt="{ icon: { class: macIcon() } }"
          @click="$emit('toggle-pin', chat.id)"
        />
      </div>

      <div :class="selectWrap()">
        <select
          :value="chat.agent"
          :class="agentSelect()"
          :disabled="chat.roleLocked"
          @change="$emit('set-agent', chat.id, ($event.target as HTMLSelectElement).value)"
        >
          <option v-for="agent in agentOptions" :key="agent.value" :value="agent.value">
            {{ agent.label }}
          </option>
        </select>
        <i class="pi pi-chevron-down" :class="selectIcon()"></i>
      </div>
    </div>

    <div :class="chatBody()">
      <template v-if="chat.messages.length === 0">
        <div :class="messageIncoming()">Чем помочь в этом диалоге?</div>
      </template>
      <template v-else>
        <div
          v-for="message in chat.messages"
          :key="message.id"
          :class="message.role === 'user' ? messageOutgoing() : messageIncoming()"
        >
          <AiMarkdownMessage v-if="message.role === 'assistant'" :content="message.content" />
          <template v-else>{{ message.content }}</template>
        </div>
      </template>

      <div v-if="chat.isTyping" :class="typingMessage()">Печатает...</div>
    </div>

    <div :class="chatFooter()">
      <input
        type="text"
        placeholder="Введите сообщение..."
        :maxlength="maxLength"
        :value="chat.input"
        :class="chatInput()"
        @input="$emit('set-input', chat.id, ($event.target as HTMLInputElement).value)"
        @keydown.enter.prevent="$emit('send-message', chat.id)"
      />
      <button
        type="button"
        :class="sendButton()"
        :disabled="chat.isTyping || !chat.input.trim()"
        @click="$emit('send-message', chat.id)"
      >
        <i v-if="!chat.isTyping" class="pi pi-send"></i>
        <i v-else class="pi pi-spin pi-spinner"></i>
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import { tv } from 'tailwind-variants'
import AiMarkdownMessage from '@/components/ai/AiMarkdownMessage.vue'
import { CHAT_INPUT_MAX_LENGTH, type AgentOption, type ChatItem } from '@/types/ai'

defineProps<{
  chat: ChatItem
  agentOptions: AgentOption[]
}>()

defineEmits<{
  'remove-chat': [id: string]
  'open-expanded': [id: string]
  'toggle-pin': [id: string]
  'set-agent': [id: string, value: string]
  'set-input': [id: string, value: string]
  'send-message': [id: string]
}>()

const maxLength = CHAT_INPUT_MAX_LENGTH

const pinnedCardStyle = {
  boxShadow: '0 0 15px rgba(110, 231, 183, 0.38), 0 0 8px rgba(16, 185, 129, 0.26)',
}

const styles = tv({
  slots: {
    chatCard: [
      'flex h-[430px] w-full max-w-[360px] flex-col rounded-2xl border border-slate-800/80',
      'bg-slate-950/75 px-3.5 pb-3 pt-3.5 shadow-xl shadow-black/30 backdrop-blur',
    ],
    pinnedChatCard: ['border-emerald-400/70 ring-1 ring-emerald-300/40'],
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
      'transition focus:border-slate-700 disabled:cursor-not-allowed disabled:opacity-60',
    ],
    selectIcon: [
      'pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2',
      'text-[10px] text-slate-400',
    ],
    chatBody: [
      'flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto rounded-xl',
      'border border-slate-800/80 bg-slate-900/50 p-3',
      ''
    ],
    messageIncoming: [
      'max-w-[85%] whitespace-pre-wrap rounded-xl bg-slate-800 px-3 py-2 text-xs text-slate-200',
    ],
    messageOutgoing: [
      'ml-auto max-w-[85%] whitespace-pre-wrap rounded-xl bg-emerald-500/20 px-3 py-2 text-right text-xs text-emerald-200 text-left',
    ],
    typingMessage: ['max-w-[40%] rounded-xl bg-slate-800 px-3 py-2 text-xs text-slate-400 italic'],
    chatFooter: ['mt-3 flex items-center gap-2 px-1'],
    chatInput: [
      'h-9 w-full rounded-lg border border-slate-800 bg-slate-900 px-3',
      'text-xs text-slate-100 outline-none placeholder:text-slate-500',
    ],
    sendButton: [
      'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-800',
      'bg-slate-900 text-slate-300 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-60',
    ],
  },
})

const {
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
  typingMessage,
  chatFooter,
  chatInput,
  sendButton,
} = styles()
</script>
