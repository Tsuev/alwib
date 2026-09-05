<template>
  <div>
    <h1 :class="title()">Загрузчик контента</h1>
    <p :class="lead()">
      Вставьте ссылку на пост или видео
    </p>

    <form :class="downloadForm()" @submit.prevent="$emit('submit-download')">
      <div :class="inputShell()">
        <div :class="inputRow()">
          <InputText
            v-model="urlValue"
            type="url"
            placeholder="https://..."
            :class="urlInput()"
            :readonly="isDownloading"
          />
          <Button
            :class="downloadButton()"
            type="submit"
            icon="pi pi-download"
            :disabled="!sourceUrl.trim() || isDownloading"
            :loading="isDownloading"
            label="Скачать"
          />
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { tv } from 'tailwind-variants'

const props = defineProps<{
  sourceUrl: string
  isDownloading: boolean
}>()

const emit = defineEmits<{
  'update:source-url': [value: string]
  'submit-download': []
}>()

const urlValue = computed({
  get: () => props.sourceUrl,
  set: (value: string) => emit('update:source-url', value),
})

const styles = tv({
  slots: {
    title: ['text-center text-3xl font-semibold text-white md:text-4xl'],
    lead: ['mx-auto mt-3 max-w-2xl text-center text-sm text-slate-300 md:text-base'],
    downloadForm: ['mx-auto mt-8 w-full max-w-3xl'],
    inputShell: ['neon-input-shell rounded-2xl p-[1px]'],
    inputRow: [
      'flex items-center gap-2 rounded-2xl bg-slate-950/95 p-2',
      'ring-1 ring-slate-800/80',
    ],
    urlInput: ['w-full border-0 bg-transparent text-sm text-white placeholder:text-slate-500'],
    downloadButton: ['download-action shrink-0 rounded-xl px-5'],
  },
})

const { title, lead, downloadForm, inputShell, inputRow, urlInput, downloadButton } = styles()
</script>

<style scoped>
.neon-input-shell {
  background:
    linear-gradient(
      115deg,
      rgba(16, 185, 129, 0.9),
      rgba(6, 182, 212, 0.85),
      rgba(132, 204, 22, 0.9),
      rgba(16, 185, 129, 0.9)
    );
  background-size: 250% 250%;
  animation: neonFlow 12s linear infinite;
  box-shadow:
    0 0 8px rgba(16, 185, 129, 0.35),
    0 0 22px rgba(6, 182, 212, 0.2);
}

@keyframes neonFlow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
