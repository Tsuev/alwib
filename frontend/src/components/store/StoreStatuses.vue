<template>
  <section :class="panel()">
    <div :class="statusesHeader()">
      <h2 :class="sectionTitle()">Статусы товаров</h2>
      <span :class="limitBadge()">{{ statuses.length }} / 10</span>
    </div>

    <!-- Existing statuses -->
    <div v-if="statuses.length" :class="statusList()">
      <div v-for="st in statuses" :key="st.id" :class="statusItem()">
        <Badge :value="st.label" :severity="st.severity as BadgeSeverity" />
        <button :class="statusDeleteBtn()" @click="handleDeleteStatus(st.id)">
          <i class="pi pi-times text-xs"></i>
        </button>
      </div>
    </div>
    <p v-else :class="emptyHint()">Статусов пока нет. Создайте первый ниже.</p>

    <!-- Add status form -->
    <div v-if="statuses.length < 10" :class="statusForm()">
      <InputText
        v-model="newStatusLabel"
        placeholder="Название статуса"
        maxlength="30"
        :class="statusInput()"
      />
      <Select
        v-model="newStatusSeverity"
        :options="severityOptions"
        option-label="label"
        option-value="value"
        placeholder="Цвет"
        :class="statusSelect()"
      >
        <template #option="{ option }">
          <Badge :value="option.label" :severity="option.value as BadgeSeverity" />
        </template>
        <template #value="{ value }">
          <Badge
            v-if="value"
            :value="severityOptions.find((o) => o.value === value)?.label ?? value"
            :severity="value as BadgeSeverity"
          />
          <span v-else class="text-slate-400">Цвет</span>
        </template>
      </Select>
      <Button
        label="Добавить"
        icon="pi pi-plus"
        size="small"
        :disabled="!newStatusLabel.trim() || !newStatusSeverity || statusAdding"
        :loading="statusAdding"
        @click="handleAddStatus"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Badge from 'primevue/badge'
import { useToast } from 'primevue/usetoast'
import { useStoreStore } from '@/stores/storeStore'
import type { BadgeSeverity } from '@/types/store'
import { tv } from 'tailwind-variants'

const store = useStoreStore()
const toast = useToast()

const statuses = computed(() => store.store?.statuses ?? [])

const severityOptions = [
  { label: 'Зеленый', value: 'success' },
  { label: 'Голубой', value: 'info' },
  { label: 'Оранжевый', value: 'warn' },
  { label: 'Красный', value: 'danger' },
  { label: 'Темный', value: 'secondary' },
  { label: 'Белый', value: 'contrast' },
]

const newStatusLabel = ref('')
const newStatusSeverity = ref('')
const statusAdding = ref(false)

const handleAddStatus = async () => {
  if (!newStatusLabel.value.trim() || !newStatusSeverity.value) return
  statusAdding.value = true
  try {
    await store.createStatus({ label: newStatusLabel.value.trim(), severity: newStatusSeverity.value })
    newStatusLabel.value = ''
    newStatusSeverity.value = ''
    toast.add({ severity: 'success', summary: 'Статус', detail: 'Статус добавлен', life: 3000 })
  } catch {
    toast.add({ severity: 'error', summary: 'Статус', detail: 'Не удалось добавить статус', life: 4000 })
  } finally {
    statusAdding.value = false
  }
}

const handleDeleteStatus = async (id: number) => {
  try {
    await store.deleteStatus(id)
    toast.add({ severity: 'success', summary: 'Статус', detail: 'Статус удалён', life: 3000 })
  } catch {
    toast.add({ severity: 'error', summary: 'Статус', detail: 'Не удалось удалить статус', life: 4000 })
  }
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = tv({
  slots: {
    panel: [
      'rounded-3xl border border-slate-800/80 bg-slate-950/70 flex-1',
      'px-6 py-6 shadow-xl shadow-black/30 backdrop-blur',
    ],
    sectionTitle: ['text-lg font-semibold text-white mb-4'],
    statusesHeader: ['flex items-center justify-between mb-4'],
    limitBadge: ['text-xs text-slate-400 border border-slate-700 rounded-full px-2 py-0.5'],
    statusList: ['flex flex-wrap gap-2 mb-4'],
    statusItem: ['flex items-center gap-1'],
    statusDeleteBtn: [
      'p-1 rounded-full text-slate-500 hover:text-red-400 hover:bg-red-900/20',
      'transition-colors duration-150',
    ],
    emptyHint: ['text-sm text-slate-500 mb-4'],
    statusForm: ['flex flex-wrap items-center gap-2 pt-4 border-t border-slate-800/60'],
    statusInput: ['flex-1 min-w-36'],
    statusSelect: ['w-44'],
  },
})

const {
  panel, sectionTitle, statusesHeader, limitBadge, statusList, statusItem,
  statusDeleteBtn, emptyHint, statusForm, statusInput, statusSelect,
} = styles()
</script>
