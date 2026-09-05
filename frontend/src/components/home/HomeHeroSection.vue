<template>
  <section :class="header()">
    <h1 :class="title()">Workspace Alwib</h1>
    <p :class="lead()">
      Единый доступ к сервисам: аналитика, автоматизация публикаций, VPN, ассистенты и витрины. В
      бесплатном режиме доступны базовые лимиты, подписка открывает расширенные квоты.
    </p>
    <div :class="tagRow()">
      <Tag severity="info">SSO + Google OAuth</Tag>
      <Tag severity="success">Единая подписка</Tag>
      <Tag severity="warning">Бесплатные лимиты</Tag>
    </div>
  </section>
</template>

<script setup lang="ts">
import Tag from 'primevue/tag'
import { tv } from 'tailwind-variants'

const styles = tv({
  slots: {
    header: ['flex flex-col gap-2'],
    title: ['text-3xl font-semibold text-white'],
    lead: ['text-slate-300'],
    tagRow: ['mt-3 flex flex-wrap gap-3'],
  },
})

const { header, title, lead, tagRow } = styles()
</script>
