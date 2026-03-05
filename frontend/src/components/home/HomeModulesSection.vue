<template>
  <section>
    <div :class="sectionHeader()">
      <h2 :class="sectionTitle()">Модули</h2>
      <Tag severity="secondary">MVP в работе</Tag>
    </div>
    <div :class="modulesGrid()">
      <ModuleCard
        v-for="module in modules"
        :key="module.title"
        :title="module.title"
        :description="module.description"
        :status-label="module.statusLabel"
        :status-severity="module.statusSeverity"
        :limits="module.limits"
        :action-label="module.actionLabel"
        :route="module.route"
        :disabled="module.disabled"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import ModuleCard from '@/components/app/ModuleCard.vue'
import Tag from 'primevue/tag'
import { tv } from 'tailwind-variants'

export type HomeModuleStatusSeverity = 'success' | 'info' | 'warning' | 'secondary'

export type HomeModuleConfig = {
  title: string
  description: string
  statusLabel: string
  statusSeverity: HomeModuleStatusSeverity
  limits: string[]
  actionLabel: string
  route?: string
  disabled?: boolean
}

defineProps<{
  modules: HomeModuleConfig[]
}>()

const styles = tv({
  slots: {
    sectionHeader: ['flex items-center justify-between gap-4'],
    sectionTitle: ['text-2xl font-semibold text-white'],
    modulesGrid: ['mt-5 grid gap-6 md:grid-cols-2 xl:grid-cols-3'],
  },
})

const { sectionHeader, sectionTitle, modulesGrid } = styles()
</script>
