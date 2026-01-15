<template>
  <div class="rounded-2xl bg-slate-900/80 p-6 shadow-lg shadow-black/20">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h3 class="text-xl font-semibold text-white">
          {{ title }}
        </h3>
        <p class="mt-2 text-sm text-slate-300">
          {{ description }}
        </p>
      </div>
      <Tag :severity="statusSeverity" class="shrink-0">{{ statusLabel }}</Tag>
    </div>

    <div class="mt-4">
      <p class="text-xs uppercase tracking-wide text-slate-400">Лимиты и условия</p>
      <ul class="mt-2 space-y-1 text-sm text-slate-100">
        <li v-for="limit in limits" :key="limit" class="flex items-start gap-2">
          <i class="pi pi-check-circle mt-0.5 text-primary-400" aria-hidden="true"></i>
          <span>{{ limit }}</span>
        </li>
      </ul>
    </div>

    <div class="mt-6">
      <RouterLink v-if="isActive" :to="route" class="w-full">
        <Button :label="actionLabel" severity="primary" class="w-full" />
      </RouterLink>
      <Button v-else :label="actionLabel" severity="secondary" class="w-full" disabled />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

interface ModuleCardProps {
  title: string
  description: string
  statusLabel: string
  statusSeverity: 'success' | 'info' | 'warning' | 'secondary'
  limits: string[]
  actionLabel: string
  route?: string
  disabled?: boolean
}

const props = defineProps<ModuleCardProps>()

const isActive = computed(() => Boolean(props.route) && !props.disabled)
</script>
