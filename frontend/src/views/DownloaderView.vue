<template>
  <DefaultLayout :class="layout()">
    <section :class="hero()">
      <div :class="panel()">
        <DownloaderRequestCard
          :source-url="sourceUrl"
          :is-downloading="isDownloading"
          @update:source-url="sourceUrl = $event"
          @submit-download="handleDownload"
        />

        <DownloaderServicesCard />
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import DownloaderRequestCard from '@/components/downloader/DownloaderRequestCard.vue'
import DownloaderServicesCard from '@/components/downloader/DownloaderServicesCard.vue'
import { useToast } from 'primevue/usetoast'
import { downloaderServices } from '@/services'
import { tv } from 'tailwind-variants'

const sourceUrl = ref('')
const isDownloading = ref(false)
const toast = useToast()

const styles = tv({
  slots: {
    layout: ['min-h-full'],
    hero: ['flex min-h-[calc(100vh-140px)] items-center justify-center'],
    panel: [
      'w-full max-w-5xl rounded-3xl border border-slate-800/80 bg-slate-950/70',
      'px-5 py-8 shadow-2xl shadow-black/40 backdrop-blur md:px-10 md:py-10',
    ],
  },
})

const { layout, hero, panel } = styles()

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
