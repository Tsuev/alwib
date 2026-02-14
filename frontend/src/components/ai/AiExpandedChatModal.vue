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

      <div :class="expandedBody()">
        <div :class="messageIncoming()">Полноэкранный режим чата активен.</div>
        <div :class="messageOutgoing()">
          Агент:
          <span :class="agentBadge()">{{ getAgentLabel(chat.agent) }}</span>
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
  close: []
  'toggle-pin': [id: string]
  'set-agent': [id: string, value: string]
}>()

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
    expandedBody: [
      'flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto rounded-xl',
      'border border-slate-800 bg-slate-900/40 p-4',
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
  expandedOverlay,
  expandedPanel,
  chatHeader,
  macButtons,
  macButton,
  expandButton,
  macButtonActive,
  macIcon,
  selectWrap,
  agentSelect,
  selectIcon,
  expandedBody,
  messageIncoming,
  messageOutgoing,
  agentBadge,
  chatFooter,
  chatInput,
  sendButton,
} = styles()
</script>
