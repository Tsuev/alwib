<template>
  <div class="ai-expanded-overlay" :class="expandedOverlay()" @click="$emit('close')">
    <div class="ai-expanded-panel" :class="expandedPanel()" @click.stop>
      <div :class="chatHeader()">
        <div :class="macButtons()">
          <Button
            type="button"
            icon="pi pi-arrow-down-left-and-arrow-up-right-to-center"
            rounded
            text
            :class="[macButton(), expandButton(), macButtonActive()]"
            aria-label="Свернуть чат"
            :pt="{ icon: { class: macIcon() } }"
            @click="$emit('close')"
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

      <div :class="expandedBody()">
        <template v-if="chat.messages.length === 0">
          <div :class="messageIncoming()">Полноэкранный режим чата активен. Напиши первое сообщение.</div>
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
    </div>
  </div>
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
  close: []
  'toggle-pin': [id: string]
  'set-agent': [id: string, value: string]
  'set-input': [id: string, value: string]
  'send-message': [id: string]
}>()

const maxLength = CHAT_INPUT_MAX_LENGTH

const styles = tv({
  slots: {
    expandedOverlay: [
      'fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-3 md:p-6',
      'backdrop-blur-sm',
    ],
    expandedPanel: [
      'flex h-[92vh] w-full max-w-[1280px] flex-col rounded-2xl border border-slate-800',
      'bg-slate-950 p-5 shadow-2xl shadow-black/50',
    ],
    chatHeader: ['mb-3 flex items-center justify-between gap-2'],
    macButtons: ['flex items-center gap-2'],
    macButton: [
      'group !flex !h-6 !w-6 !items-center !justify-center !rounded-full !border !p-0',
      'transition focus:outline-none',
    ],
    expandButton: ['!border-amber-500/60 !bg-amber-300 hover:!bg-amber-200'],
    pinButton: ['!border-emerald-500/60 !bg-emerald-300 hover:!bg-emerald-200'],
    macButtonActive: ['ring-2 ring-white/35'],
    macIcon: ['!text-[10px] !text-slate-900 !opacity-95'],
    selectWrap: ['relative'],
    agentSelect: [
      'h-8 min-w-[220px] appearance-none rounded-lg border border-slate-800',
      'bg-slate-900 pl-3 pr-8 text-xs text-slate-200 outline-none',
      'transition focus:border-slate-700 disabled:cursor-not-allowed disabled:opacity-60',
    ],
    selectIcon: [
      'pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2',
      'text-[10px] text-slate-400',
    ],
    expandedBody: [
      'flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto rounded-xl',
      'border border-slate-800 bg-slate-900/40 p-4',
    ],
    messageIncoming: [
      'max-w-[85%] whitespace-pre-wrap rounded-xl bg-slate-800 px-3 py-2 text-xs text-slate-200 md:text-sm',
    ],
    messageOutgoing: [
      'ml-auto max-w-[85%] whitespace-pre-wrap rounded-xl bg-emerald-500/20 px-3 py-2 text-right text-xs text-emerald-200 md:text-sm',
    ],
    typingMessage: ['max-w-[25%] rounded-xl bg-slate-800 px-3 py-2 text-xs text-slate-400 italic'],
    chatFooter: ['mt-3 flex items-center gap-2 px-1'],
    chatInput: [
      'h-10 w-full rounded-lg border border-slate-800 bg-slate-900 px-3',
      'text-sm text-slate-100 outline-none placeholder:text-slate-500',
    ],
    sendButton: [
      'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-800',
      'bg-slate-900 text-slate-300 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-60',
    ],
  },
})

const {
  expandedOverlay,
  expandedPanel,
  chatHeader,
  macButtons,
  macButton,
  expandButton,
  pinButton,
  macButtonActive,
  macIcon,
  selectWrap,
  agentSelect,
  selectIcon,
  expandedBody,
  messageIncoming,
  messageOutgoing,
  typingMessage,
  chatFooter,
  chatInput,
  sendButton,
} = styles()
</script>
