<template>
  <Sidebar
    v-model:visible="sidebarOpen"
    blockScroll
    :pt="{
      content: { class: sidebarContent() },
    }"
  >
    <aside :class="aside()">
      <div :class="brandRow()">
        <img src="/alwib.png" width="40" />
        <div>
          <div :class="brandTitle()">Alwib</div>
          <div :class="brandSubtitle()">Workspace</div>
        </div>
      </div>

      <div :class="section()">
        <p :class="sectionLabel()">Навигация</p>
        <RouterLink
          to="/"
          :class="menuItem()"
          :exact-active-class="menuItemActive()"
          @click="closeSidebar"
        >
          <i :class="menuIconHome()"></i>
          <span>Главная</span>
        </RouterLink>
      </div>

      <div :class="section()">
        <p :class="sectionLabel()">Модули</p>
        <RouterLink
          to="/vpn"
          :class="menuItem()"
          :exact-active-class="menuItemActive()"
          @click="closeSidebar"
        >
          <i :class="menuIconShield()"></i>
          <span>VPN</span>
        </RouterLink>
        <RouterLink
          to="/ai"
          :class="menuItem()"
          :exact-active-class="menuItemActive()"
          @click="closeSidebar"
        >
          <i :class="menuIconComment()"></i>
          <span>ИИ‑ассистенты</span>
        </RouterLink>
        <RouterLink
          to="/downloader"
          :class="menuItem()"
          :exact-active-class="menuItemActive()"
          @click="closeSidebar"
        >
          <i :class="menuIconDownload()"></i>
          <span>Загрузчик</span>
        </RouterLink>
        <RouterLink
          to="/ip-check"
          :class="menuItem()"
          :exact-active-class="menuItemActive()"
          @click="closeSidebar"
        >
          <i :class="menuIconIp()"></i>
          <span>Проверка IP</span>
        </RouterLink>
      </div>

      <div :class="section()">
        <p :class="sectionLabel()">Сервисы</p>
        <button :class="menuItemDisabled()" type="button" disabled>
          <i :class="menuIconChart()"></i>
          <span>TG‑анализатор</span>
          <span :class="badgeSoon()"> скоро </span>
        </button>
        <button :class="menuItemDisabled()" type="button" disabled>
          <i :class="menuIconSend()"></i>
          <span>Автопубликации</span>
          <span :class="badgeSoon()"> скоро </span>
        </button>
      </div>

      <div :class="footer()">
        <button @click="handleLogout" :class="logoutButton()" type="button">
          <i :class="menuIconLogout()"></i>
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
import { tv } from 'tailwind-variants'

const { logout } = useAuth()
const router = useRouter()
const uiStore = useUiStore()
const { sidebarOpen } = storeToRefs(uiStore)
useBreakpoints()

const closeSidebar = () => {
  uiStore.setSidebarOpen(false)
}

const handleLogout = async () => {
  closeSidebar()
  await logout()
  router.push('/auth')
}

const styles = tv({
  slots: {
    sidebarContent: ['h-full overflow-y-auto p-0'],
    aside: ['flex min-h-full flex-col px-4 py-6'],
    brandRow: ['mb-6 flex items-center gap-3 border-b border-slate-800/80 pb-5'],
    brandTitle: ['text-base font-semibold text-white'],
    brandSubtitle: ['text-xs uppercase tracking-[0.2em] text-slate-400'],
    section: ['mb-6 flex flex-col gap-2'],
    sectionLabel: ['mt-1 text-xs uppercase tracking-[0.3em] text-slate-500'],
    menuItem: [
      'menu-item group flex items-center gap-3 rounded-xl border',
      'border-transparent px-4 py-3 text-sm leading-5 text-slate-200',
      'transition hover:border-slate-800 hover:bg-slate-900/70',
      'hover:text-white',
    ],
    menuItemActive: [
      'border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 shadow-lg shadow-black/40 text-white',
    ],
    menuItemDisabled: [
      'menu-item group flex cursor-not-allowed items-center gap-3 rounded-xl',
      'border border-transparent px-4 py-3 text-sm leading-5 text-slate-200',
      'opacity-60 transition',
    ],
    menuIconHome: [
      'pi pi-home min-w-[20px] text-lg text-slate-400 group-hover:text-primary-300 group-[.router-link-exact-active]:text-primary-400',
    ],
    menuIconShield: [
      'pi pi-shield min-w-[20px] text-lg text-slate-400 group-hover:text-primary-300 group-[.router-link-exact-active]:text-primary-400',
    ],
    menuIconComment: [
      'pi pi-comment min-w-[20px] text-lg text-slate-400 group-hover:text-primary-300 group-[.router-link-exact-active]:text-primary-400',
    ],
    menuIconDownload: [
      'pi pi-cloud-download min-w-[20px] text-lg text-slate-400 group-hover:text-primary-300 group-[.router-link-exact-active]:text-primary-400',
    ],
    menuIconIp: [
      'pi pi-globe min-w-[20px] text-lg text-slate-400 group-hover:text-primary-300 group-[.router-link-exact-active]:text-primary-400',
    ],
    menuIconChart: ['pi pi-chart-bar min-w-[20px] text-lg text-slate-400'],
    menuIconSend: ['pi pi-send min-w-[20px] text-lg text-slate-400'],
    badgeSoon: [
      'ml-auto rounded-full border border-slate-800 px-2 py-0.5 text-[10px]',
      'uppercase tracking-widest text-slate-400',
    ],
    footer: ['mt-auto pb-2 pt-4'],
    logoutButton: [
      'menu-item group w-full cursor-pointer rounded-xl border flex items-center gap-3',
      'border-transparent px-4 py-3 text-left text-sm leading-5',
      'text-slate-300 transition hover:border-slate-800 hover:bg-slate-900/70',
      'hover:text-white',
    ],
    menuIconLogout: ['pi pi-sign-out min-w-[20px] text-lg text-slate-400 group-hover:text-red-400'],
  },
})

const {
  sidebarContent,
  aside,
  brandRow,
  brandTitle,
  brandSubtitle,
  section,
  sectionLabel,
  menuItem,
  menuItemActive,
  menuItemDisabled,
  menuIconHome,
  menuIconShield,
  menuIconComment,
  menuIconDownload,
  menuIconIp,
  menuIconChart,
  menuIconSend,
  badgeSoon,
  footer,
  logoutButton,
  menuIconLogout,
} = styles()
</script>
