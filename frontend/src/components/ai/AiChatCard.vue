<template>
  <article :class="[chatCard(), chat.pinned ? pinnedChatCard() : '']" :style="chat.pinned ? pinnedCardStyle : undefined">
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
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import { tv } from 'tailwind-variants'
import { getAgentLabel, type AgentOption, type ChatItem } from '@/types/ai'

defineProps<{
  chat: ChatItem
  agentOptions: AgentOption[]
}>()

defineEmits<{
  'remove-chat': [id: string]
  'open-expanded': [id: string]
  'toggle-pin': [id: string]
  'set-agent': [id: string, value: string]
}>()

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
  agentBadge,
  chatFooter,
  chatInput,
  sendButton,
} = styles()
</script>
