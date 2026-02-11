<template>
  <DefaultLayout :class="layout()">
    <header :class="header()">
      <h1 :class="title()">ИИ ассистенты</h1>
      <p :class="lead()">
        Создавайте несколько независимых чатов, переключайте агентов и закрепляйте нужные окна.
      </p>
    </header>

    <section :class="workspace()">
      <TransitionGroup name="chat-list" tag="div" :class="chatRow()">
        <AiChatCard
          v-for="chat in chats"
          :key="chat.id"
          :chat="chat"
          :agent-options="agentOptions"
          @remove-chat="removeChat"
          @open-expanded="openExpanded"
          @toggle-pin="togglePin"
          @set-agent="setAgent"
        />

        <AiAddChatCard key="add-chat-card" @add-chat="addChat" />
      </TransitionGroup>
    </section>

    <AiExpandedChatModal
      v-if="expandedChat"
      :chat="expandedChat"
      :agent-options="agentOptions"
      @close="closeExpanded"
      @toggle-pin="togglePin"
      @set-agent="setAgent"
    />
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AiChatCard from '@/components/ai/AiChatCard.vue'
import AiAddChatCard from '@/components/ai/AiAddChatCard.vue'
import AiExpandedChatModal from '@/components/ai/AiExpandedChatModal.vue'
import { agentOptions } from '@/components/ai/types'
import { useAiChats } from '@/composables/useAiChats'
import { tv } from 'tailwind-variants'

const { chats, expandedChat, addChat, removeChat, togglePin, openExpanded, closeExpanded, setAgent } =
  useAiChats()

const styles = tv({
  slots: {
    layout: ['flex flex-col gap-8'],
    header: ['flex flex-col gap-2'],
    title: ['text-3xl font-semibold text-white'],
    lead: ['text-slate-300'],
    workspace: ['mt-2'],
    chatRow: ['mt-4 flex flex-wrap items-start justify-center gap-4 md:justify-start'],
  },
})

const { layout, header, title, lead, workspace, chatRow } = styles()
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
</style>
