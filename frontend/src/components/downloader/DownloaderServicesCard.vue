<template>
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
</template>

<script setup lang="ts">
import { tv } from 'tailwind-variants'

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

const { supportBlock, supportTitle, servicesGrid, serviceChip, serviceIcon, note } = styles()
</script>
