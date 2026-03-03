<template>
  <DefaultLayout :class="layout()">
    <section :class="hero()">
      <div :class="panel()">
        <h1 :class="title()">Загрузчик контента</h1>
        <p :class="lead()">
          Вставьте ссылку на пост или видео
        </p>

        <form :class="downloadForm()" @submit.prevent="handleDownload">
          <div :class="inputShell()">
            <div :class="inputRow()">
              <InputText
                v-model="sourceUrl"
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

        <div :class="supportBlock()">
          <p :class="supportTitle()">Поддерживаемые сервисы</p>

          <ul :class="servicesGrid()">
            <li v-for="service in supportedServices" :key="service.name" :class="serviceChip()">
              <img
                :src="`https://cdn.simpleicons.org/${service.iconSlug}/e2e8f0`"
                :alt="`${service.name} icon`"
                :class="serviceIcon()"
                loading="lazy"
              />
              <span>{{ service.name }}</span>
            </li>
          </ul>
          <p :class="note()">
            Некоторые сервисы могут не поддерживаться из-за ограничений.
          </p>
        </div>
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import { downloaderServices } from '@/services'
import { tv } from 'tailwind-variants'

const sourceUrl = ref('')
const isDownloading = ref(false)
const toast = useToast()

const supportedServices = [
  { name: 'YouTube', iconSlug: 'youtube' },
  { name: 'TikTok', iconSlug: 'tiktok' },
  { name: 'VK', iconSlug: 'vk' },
  { name: 'Instagram', iconSlug: 'instagram' },
  { name: 'Rutube', iconSlug: 'maildotru' },
  { name: 'OK.ru', iconSlug: 'odnoklassniki' },
  { name: 'Bilibili', iconSlug: 'bilibili' },
  { name: 'Bluesky', iconSlug: 'bluesky' },
  { name: 'Dailymotion', iconSlug: 'dailymotion' },
  { name: 'Pinterest', iconSlug: 'pinterest' },
  { name: 'Reddit', iconSlug: 'reddit' },
  { name: 'Snapchat', iconSlug: 'snapchat' },
  { name: 'SoundCloud', iconSlug: 'soundcloud' },
  { name: 'Tumblr', iconSlug: 'tumblr' },
  { name: 'Twitch', iconSlug: 'twitch' },
  { name: 'X (Twitter)', iconSlug: 'x' },
  { name: 'Vimeo', iconSlug: 'vimeo' },
  { name: 'Xiaohongshu (RedNote)', iconSlug: 'xiaohongshu' },
]

const styles = tv({
  slots: {
    layout: ['min-h-full'],
    hero: ['flex min-h-[calc(100vh-140px)] items-center justify-center'],
    panel: [
      'w-full max-w-5xl rounded-3xl border border-slate-800/80 bg-slate-950/70',
      'px-5 py-8 shadow-2xl shadow-black/40 backdrop-blur md:px-10 md:py-10',
    ],
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
    supportBlock: ['mx-auto mt-7 max-w-4xl'],
    supportTitle: ['text-center text-xs uppercase tracking-[0.22em] text-slate-400'],
    servicesGrid: ['mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4'],
    serviceChip: [
      'flex items-center gap-2 rounded-xl border border-slate-800',
      'bg-slate-900/70 px-3 py-2 text-xs text-slate-200',
    ],
    serviceIcon: ['h-3.5 w-3.5 shrink-0 opacity-90'],
    note: ['mt-4 text-center text-xs text-slate-500'],
  },
})

const {
  layout,
  hero,
  panel,
  title,
  lead,
  downloadForm,
  inputShell,
  inputRow,
  urlInput,
  downloadButton,
  supportBlock,
  supportTitle,
  servicesGrid,
  serviceChip,
  serviceIcon,
  note,
} = styles()

const handleDownload = async () => {
  const url = sourceUrl.value.trim()
  if (!url || isDownloading.value) {
    return
  }

  isDownloading.value = true

  try {
    const result = await downloaderServices.requestDownload(url)
    const apiBase = import.meta.env.VITE_API_BASE_URL || window.location.origin
    const absoluteDownloadUrl = new URL(result.downloadUrl, apiBase).toString()

    const link = document.createElement('a')
    link.href = absoluteDownloadUrl
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.setAttribute('download', result.fileName || 'content')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.add({
      severity: 'success',
      summary: 'Загрузчик контента',
      detail: 'Файл успешно отправлен на скачивание.',
      life: 3000,
    })
    sourceUrl.value = ''
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Загрузчик контента',
      detail: 'Произошла ошибка при скачивании контента.',
      life: 4000,
    })
  } finally {
    isDownloading.value = false
  }
}
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
