<template>
  <DefaultLayout :class="layout()">
    <!-- Hero / Search -->
    <section :class="hero()">
      <div :class="panel()">
        <div :class="panelHead()">
          <i class="pi pi-map-marker text-primary-400 text-3xl"></i>
          <h1 :class="title()">Проверка IP</h1>
          <p :class="lead()">
            Введите IP‑адрес, чтобы узнать страну, город,
            провайдера и координаты на карте.
          </p>
        </div>

        <form :class="searchForm()" @submit.prevent="handleLookup">
          <div :class="inputShell()">
            <div :class="inputRow()">
              <InputText
                v-model="query"
                placeholder="9.9.9.9"
                :class="queryInput()"
                :readonly="isLoading"
                autocomplete="off"
                spellcheck="false"
              />
              <Button
                type="submit"
                :class="lookupButton()"
                icon="pi pi-search"
                label="Проверить"
                :disabled="!query.trim() || isLoading"
                :loading="isLoading"
              />
            </div>
          </div>
        </form>
      </div>
    </section>

    <!-- Result -->
    <Transition name="fade-up">
      <section v-if="result" :class="resultSection()">
        <!-- Info cards grid -->
        <div :class="cardsGrid()">
          <!-- Flag + Country -->
          <div :class="card()">
            <p :class="cardLabel()">Страна</p>
            <div :class="cardValueRow()">
              <span :class="flag()">{{ result.emoji }}</span>
              <span :class="cardValue()">{{ result.country }}</span>
              <span :class="codeBadge()">{{ result.code }}</span>
            </div>
          </div>

          <!-- City -->
          <div :class="card()">
            <p :class="cardLabel()">Город</p>
            <p :class="cardValue()">{{ result.city || '—' }}</p>
          </div>

          <!-- IP -->
          <div :class="card()">
            <p :class="cardLabel()">IP‑адрес</p>
            <p :class="cardValue()">{{ result.ip }}</p>
          </div>

          <!-- Timezone -->
          <div :class="card()">
            <p :class="cardLabel()">Часовой пояс</p>
            <p :class="cardValue()">{{ result.timezone || '—' }}</p>
          </div>

          <!-- ASN name -->
          <div :class="card()">
            <p :class="cardLabel()">Провайдер / ASN</p>
            <p :class="cardValue()">{{ result.asn?.name || '—' }}</p>
          </div>

          <!-- ASN id + hosting -->
          <div :class="card()">
            <p :class="cardLabel()">ASN ID</p>
            <div :class="cardValueRow()">
              <span :class="cardValue()">AS{{ result.asn?.id || '—' }}</span>
              <span v-if="result.asn?.hosting" :class="hostingBadge()">хостинг</span>
            </div>
          </div>

          <!-- Coordinates -->
          <div :class="[card(), 'col-span-full sm:col-span-2']">
            <p :class="cardLabel()">Координаты</p>
            <p :class="cardValue()">{{ result.lat }}, {{ result.lon }}</p>
          </div>
        </div>

        <!-- Map -->
        <div :class="mapWrap()">
          <div ref="mapEl" :class="mapEl_class()"></div>
        </div>
      </section>
    </Transition>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onUnmounted } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import { ipCheckServices } from '@/services'
import type { IpCheckResult } from '@/types/ipCheck'
import { tv } from 'tailwind-variants'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icons (webpack/vite asset issue)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const toast = useToast()
const query = ref('')
const isLoading = ref(false)
const result = ref<IpCheckResult | null>(null)
const mapEl = ref<HTMLElement | null>(null)

let mapInstance: L.Map | null = null
let markerInstance: L.Marker | null = null

const initMap = (lat: number, lon: number) => {
  if (!mapEl.value) return

  if (mapInstance) {
    mapInstance.setView([lat, lon], 10)
    markerInstance?.setLatLng([lat, lon])
    return
  }

  mapInstance = L.map(mapEl.value, {
    center: [lat, lon],
    zoom: 10,
    zoomControl: true,
    attributionControl: false,
  })

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
  }).addTo(mapInstance)

  markerInstance = L.marker([lat, lon]).addTo(mapInstance)
}

const handleLookup = async () => {
  const q = query.value.trim()
  if (!q || isLoading.value) return

  isLoading.value = true
  try {
    result.value = await ipCheckServices.lookup(q)
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Проверка IP',
      detail: 'Не удалось получить информацию. Проверьте запрос.',
      life: 4000,
    })
    return
  } finally {
    isLoading.value = false
  }
}

watch(result, async (val) => {
  if (!val) return
  const lat = parseFloat(val.lat)
  const lon = parseFloat(val.lon)
  if (!isNaN(lat) && !isNaN(lon)) {
    await nextTick()
    initMap(lat, lon)
  }
})

onUnmounted(() => {
  mapInstance?.remove()
  mapInstance = null
  markerInstance = null
})

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = tv({
  slots: {
    layout: ['flex flex-col gap-10'],
    hero: ['flex justify-center'],
    panel: [
      'w-full max-w-3xl rounded-3xl border border-slate-800/80 bg-slate-950/70',
      'px-5 py-8 shadow-2xl shadow-black/40 backdrop-blur md:px-10 md:py-10',
    ],
    panelHead: ['flex flex-col items-center gap-3 text-center'],
    title: ['text-3xl font-semibold text-white md:text-4xl'],
    lead: ['max-w-xl text-sm text-slate-300 md:text-base'],
    searchForm: ['mx-auto mt-8 w-full max-w-xl'],
    inputShell: ['neon-input-shell rounded-2xl p-[1px]'],
    inputRow: [
      'flex items-center gap-2 rounded-2xl bg-slate-950/95 p-2',
      'ring-1 ring-slate-800/80',
    ],
    queryInput: ['w-full border-0 bg-transparent text-sm text-white placeholder:text-slate-500'],
    lookupButton: ['ip-lookup-btn shrink-0 rounded-xl px-5'],
    resultSection: ['flex flex-col gap-6'],
    cardsGrid: ['grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 mt-5'],
    card: [
      'flex flex-col gap-1.5 rounded-2xl border border-slate-800/80',
      'bg-slate-950/70 px-4 py-4 shadow-sm',
    ],
    cardLabel: ['text-[11px] uppercase tracking-widest text-slate-500'],
    cardValue: ['text-sm font-medium text-white break-all'],
    cardValueRow: ['flex items-center gap-2 flex-wrap'],
    flag: ['text-2xl leading-none'],
    codeBadge: [
      'rounded-md border border-slate-700 px-1.5 py-0.5 text-[10px]',
      'font-mono uppercase tracking-wide text-slate-400',
    ],
    hostingBadge: [
      'rounded-full border border-amber-700/60 bg-amber-900/30 px-2 py-0.5',
      'text-[10px] uppercase tracking-wide text-amber-400',
    ],
    mapWrap: [
      'overflow-hidden rounded-2xl border border-slate-800/80 shadow-xl shadow-black/40',
      'h-72 md:h-96',
    ],
    mapEl_class: ['h-full w-full'],
  },
})

const {
  layout,
  hero,
  panel,
  panelHead,
  title,
  lead,
  searchForm,
  inputShell,
  inputRow,
  queryInput,
  lookupButton,
  resultSection,
  cardsGrid,
  card,
  cardLabel,
  cardValue,
  cardValueRow,
  flag,
  codeBadge,
  hostingBadge,
  mapWrap,
  mapEl_class,
} = styles()
</script>

<style scoped>
/* Neon border gradient — same as Downloader */
.neon-input-shell {
  background: linear-gradient(
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
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Fade-up transition */
.fade-up-enter-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(16px);
}

/* Override Leaflet popup / tile background to match dark theme */
:deep(.leaflet-tile-pane) {
  filter: brightness(0.85) saturate(0.9);
}
:deep(.leaflet-control-zoom a) {
  background: #0f172a;
  color: #94a3b8;
  border-color: #1e293b;
}
:deep(.leaflet-control-zoom a:hover) {
  background: #1e293b;
  color: #e2e8f0;
}
</style>
