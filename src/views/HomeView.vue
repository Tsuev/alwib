<template>
  <DefaultLayout class="grid gap-[30px] grid-cols-1 grid-rows-5">
    <Block>
      <template #header>
        <h2 class="text-2xl font-bold">VPN</h2>
      </template>
      <div class="analytics mt-5">
        <div class="mt-2">Статус — <Tag>Онлайн</Tag></div>
        <div class="mt-2">Потрачено трафика — <Tag severity="info">1.5 GB</Tag></div>
        <div class="mt-2">Дата окончания — <Tag severity="info">Неограничено</Tag></div>
      </div>
    </Block>
    <Block>
      <template #header>
        <h2 class="text-2xl font-bold">ИИ</h2>
      </template>
      <div class="analytics mt-5">
        <div class="mt-2">Потрачено токенов — <Tag severity="info">4825</Tag></div>
        <div class="mt-2">Количество запросов — <Tag severity="info">2003</Tag></div>
      </div>
    </Block>
    <Block>
      <template #header>
        <h2 class="text-2xl font-bold">Загрузчик</h2>
      </template>
      <div class="analytics mt-5">
        <div class="mt-2">Скачано материала — <Tag severity="info">13</Tag></div>
      </div>
    </Block>
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Block from '@/components/app/Block.vue'
import Tag from 'primevue/tag'
</script>

<style lang="scss"></style>
