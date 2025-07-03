<template>
   <Block class="h-[250px]">
      <template #header>
        <h2 class="text-2xl font-bold">VPN</h2>
      </template>
      <div class="analytics mt-5">
        <div class="mt-2">Статус — <Tag>Онлайн</Tag></div>
        <div class="mt-2">Потрачено трафика — <Tag severity="info">1.5 GB</Tag></div>
        <div class="mt-2">Дата окончания — <Tag severity="info">Неограничено</Tag></div>
      </div>
    </Block>
</template>

<script setup lang="ts">
import Tag from 'primevue/tag'
import Block from '@/components/app/Block.vue'

defineProps<{
  status: boolean;
  traffic: number;
  date: string;
}>()
</script>
