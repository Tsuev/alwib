<template>
  <div :class="styles().card()">
    <div :class="styles().cardHeader()">
      <div>
        <h3 :class="styles().title()">
          {{ title }}
        </h3>
        <p :class="styles().description()">
          {{ description }}
        </p>
      </div>
      <Tag :severity="statusSeverity" :class="styles().statusTag()">{{ statusLabel }}</Tag>
    </div>

    <div :class="styles().limits()">
      <p :class="styles().limitsTitle()">Лимиты и условия</p>
      <ul :class="styles().limitsList()">
        <li v-for="limit in limits" :key="limit" :class="styles().limitItem()">
          <i :class="styles().limitIcon()" aria-hidden="true"></i>
          <span>{{ limit }}</span>
        </li>
      </ul>
    </div>

    <div :class="styles().actions()">
      <RouterLink v-if="isActive" :to="routeTarget" :class="styles().actionLink()">
        <Button :label="actionLabel" severity="primary" :class="styles().actionButton()" />
      </RouterLink>
      <Button v-else :label="actionLabel" severity="secondary" :class="styles().actionButton()" disabled />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import { tv } from 'tailwind-variants'

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
const routeTarget = computed(() => props.route ?? '/')

const styles = tv({
  slots: {
    card: 'rounded-2xl bg-slate-900/80 p-6 shadow-lg shadow-black/20',
    cardHeader: 'flex items-start justify-between gap-4',
    title: 'text-xl font-semibold text-white',
    description: 'mt-2 text-sm text-slate-300',
    statusTag: 'shrink-0',
    limits: 'mt-4',
    limitsTitle: 'text-xs uppercase tracking-wide text-slate-400',
    limitsList: 'mt-2 space-y-1 text-sm text-slate-100',
    limitItem: 'flex items-start gap-2',
    limitIcon: 'pi pi-check-circle mt-0.5 text-primary-400',
    actions: 'mt-6',
    actionLink: 'w-full',
    actionButton: 'w-full',
  },
})
</script>
