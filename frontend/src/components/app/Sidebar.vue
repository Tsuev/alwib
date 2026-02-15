<template>
  <Sidebar
    v-model:visible="sidebarOpen"
    :pt="{
      content: { class: 'p-0' },
    }"
  >
    <aside
      class="flex h-screen flex-col px-4 py-6"
    >
      <div class="mb-6 flex items-center gap-3 border-b border-slate-800/80 pb-5">
        <img src="/alwib.png" width="40" />
        <div>
          <div class="text-base font-semibold text-white">Alwib</div>
          <div class="text-xs uppercase tracking-[0.2em] text-slate-400">Workspace</div>
        </div>
      </div>

      <div class="mb-6 flex flex-col gap-2">
        <p class="mt-1 text-xs uppercase tracking-[0.3em] text-slate-500">Навигация</p>
        <RouterLink
          to="/"
          class="menu-item group flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-sm leading-5 text-slate-200 transition hover:border-slate-800 hover:bg-slate-900/70 hover:text-white"
          exact-active-class="border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 shadow-lg shadow-black/40 text-white"
        >
          <i
            class="pi pi-home min-w-[20px] text-lg text-slate-400 group-hover:text-primary-300 group-[.router-link-exact-active]:text-primary-400"
          ></i>
          <span>Главная</span>
        </RouterLink>
      </div>

      <div class="mb-6 flex flex-col gap-2">
        <p class="mt-1 text-xs uppercase tracking-[0.3em] text-slate-500">Модули</p>
        <RouterLink
          to="/vpn"
          class="menu-item group flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-sm leading-5 text-slate-200 transition hover:border-slate-800 hover:bg-slate-900/70 hover:text-white"
          exact-active-class="border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 shadow-lg shadow-black/40 text-white"
        >
          <i
            class="pi pi-shield min-w-[20px] text-lg text-slate-400 group-hover:text-primary-300 group-[.router-link-exact-active]:text-primary-400"
          ></i>
          <span>VPN</span>
        </RouterLink>
        <RouterLink
          to="/ai"
          class="menu-item group flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-sm leading-5 text-slate-200 transition hover:border-slate-800 hover:bg-slate-900/70 hover:text-white"
          exact-active-class="border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 shadow-lg shadow-black/40 text-white"
        >
          <i
            class="pi pi-comment min-w-[20px] text-lg text-slate-400 group-hover:text-primary-300 group-[.router-link-exact-active]:text-primary-400"
          ></i>
          <span>ИИ‑ассистенты</span>
        </RouterLink>
        <RouterLink
          to="/downloader"
          class="menu-item group flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-sm leading-5 text-slate-200 transition hover:border-slate-800 hover:bg-slate-900/70 hover:text-white"
          exact-active-class="border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 shadow-lg shadow-black/40 text-white"
        >
          <i
            class="pi pi-cloud-download min-w-[20px] text-lg text-slate-400 group-hover:text-primary-300 group-[.router-link-exact-active]:text-primary-400"
          ></i>
          <span>Загрузчик</span>
        </RouterLink>
      </div>

      <div class="mb-6 flex flex-col gap-2">
        <p class="mt-1 text-xs uppercase tracking-[0.3em] text-slate-500">Сервисы</p>
        <button
          class="menu-item group flex cursor-not-allowed items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-sm leading-5 text-slate-200 opacity-60 transition"
          type="button"
          disabled
        >
          <i class="pi pi-chart-bar min-w-[20px] text-lg text-slate-400"></i>
          <span>TG‑анализатор</span>
          <span
            class="ml-auto rounded-full border border-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-widest text-slate-400"
          >
            скоро
          </span>
        </button>
        <button
          class="menu-item group flex cursor-not-allowed items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-sm leading-5 text-slate-200 opacity-60 transition"
          type="button"
          disabled
        >
          <i class="pi pi-send min-w-[20px] text-lg text-slate-400"></i>
          <span>Автопубликации</span>
          <span
            class="ml-auto rounded-full border border-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-widest text-slate-400"
          >
            скоро
          </span>
        </button>
      </div>

      <div class="mt-auto">
        <button
          @click="handleLogout"
          class="menu-item group w-full cursor-pointer rounded-xl border border-transparent px-4 py-3 text-left text-sm leading-5 text-slate-300 transition hover:border-slate-800 hover:bg-slate-900/70 hover:text-white"
          type="button"
        >
          <i class="pi pi-sign-out min-w-[20px] text-lg text-slate-400 group-hover:text-red-400"></i>
          <span>Выйти</span>
        </button>
      </div>
    </aside>
  </Sidebar>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import Sidebar from 'primevue/sidebar'
import { useUiStore } from '@/stores/uiStore'
import { storeToRefs } from 'pinia'
import { useBreakpoints } from '@/composables/useBreakpoints'

const { logout } = useAuth()
const router = useRouter()
const uiStore = useUiStore()
const { sidebarOpen } = storeToRefs(uiStore)
useBreakpoints()

const handleLogout = async () => {
  await logout()
  router.push('/auth')
}
</script>
