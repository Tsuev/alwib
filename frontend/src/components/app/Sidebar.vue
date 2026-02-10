<template>
  <Sidebar
    v-model:visible="sidebarOpen"
    :pt="{
      content: { class: styles().sidebarContent() },
    }"
  >
    <aside :class="styles().aside()">
      <div :class="styles().brandRow()">
        <img src="/alwib.png" width="40" />
        <div>
          <div :class="styles().brandTitle()">Alwib</div>
          <div :class="styles().brandSubtitle()">Workspace</div>
        </div>
      </div>

      <div :class="styles().section()">
        <p :class="styles().sectionLabel()">Навигация</p>
        <RouterLink
          to="/"
          :class="styles().menuItem()"
          :exact-active-class="styles().menuItemActive()"
        >
          <i
            :class="styles().menuIconHome()"
          ></i>
          <span>Главная</span>
        </RouterLink>
      </div>

      <div :class="styles().section()">
        <p :class="styles().sectionLabel()">Модули</p>
        <RouterLink
          to="/vpn"
          :class="styles().menuItem()"
          :exact-active-class="styles().menuItemActive()"
        >
          <i
            :class="styles().menuIconShield()"
          ></i>
          <span>VPN</span>
        </RouterLink>
        <RouterLink
          to="/ai"
          :class="styles().menuItem()"
          :exact-active-class="styles().menuItemActive()"
        >
          <i
            :class="styles().menuIconComment()"
          ></i>
          <span>ИИ‑ассистенты</span>
        </RouterLink>
        <RouterLink
          to="/downloader"
          :class="styles().menuItem()"
          :exact-active-class="styles().menuItemActive()"
        >
          <i
            :class="styles().menuIconDownload()"
          ></i>
          <span>Загрузчик</span>
        </RouterLink>
      </div>

      <div :class="styles().section()">
        <p :class="styles().sectionLabel()">Сервисы</p>
        <button
          :class="styles().menuItemDisabled()"
          type="button"
          disabled
        >
          <i :class="styles().menuIconChart()"></i>
          <span>TG‑анализатор</span>
          <span
            :class="styles().badgeSoon()"
          >
            скоро
          </span>
        </button>
        <button
          :class="styles().menuItemDisabled()"
          type="button"
          disabled
        >
          <i :class="styles().menuIconSend()"></i>
          <span>Автопубликации</span>
          <span
            :class="styles().badgeSoon()"
          >
            скоро
          </span>
        </button>
      </div>

      <div :class="styles().footer()">
        <button
          @click="handleLogout"
          :class="styles().logoutButton()"
          type="button"
        >
          <i :class="styles().menuIconLogout()"></i>
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

const handleLogout = async () => {
  await logout()
  router.push('/auth')
}

const styles = tv({
  slots: {
    sidebarContent: 'p-0',
    aside: 'flex h-screen flex-col px-4 py-6',
    brandRow: 'mb-6 flex items-center gap-3 border-b border-slate-800/80 pb-5',
    brandTitle: 'text-base font-semibold text-white',
    brandSubtitle: 'text-xs uppercase tracking-[0.2em] text-slate-400',
    section: 'mb-6 flex flex-col gap-2',
    sectionLabel: 'mt-1 text-xs uppercase tracking-[0.3em] text-slate-500',
    menuItem:
      'menu-item group flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-sm leading-5 text-slate-200 transition hover:border-slate-800 hover:bg-slate-900/70 hover:text-white',
    menuItemActive:
      'border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 shadow-lg shadow-black/40 text-white',
    menuItemDisabled:
      'menu-item group flex cursor-not-allowed items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-sm leading-5 text-slate-200 opacity-60 transition',
    menuIconHome:
      'pi pi-home min-w-[20px] text-lg text-slate-400 group-hover:text-primary-300 group-[.router-link-exact-active]:text-primary-400',
    menuIconShield:
      'pi pi-shield min-w-[20px] text-lg text-slate-400 group-hover:text-primary-300 group-[.router-link-exact-active]:text-primary-400',
    menuIconComment:
      'pi pi-comment min-w-[20px] text-lg text-slate-400 group-hover:text-primary-300 group-[.router-link-exact-active]:text-primary-400',
    menuIconDownload:
      'pi pi-cloud-download min-w-[20px] text-lg text-slate-400 group-hover:text-primary-300 group-[.router-link-exact-active]:text-primary-400',
    menuIconChart: 'pi pi-chart-bar min-w-[20px] text-lg text-slate-400',
    menuIconSend: 'pi pi-send min-w-[20px] text-lg text-slate-400',
    badgeSoon:
      'ml-auto rounded-full border border-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-widest text-slate-400',
    footer: 'mt-auto',
    logoutButton:
      'menu-item group w-full cursor-pointer rounded-xl border border-transparent px-4 py-3 text-left text-sm leading-5 text-slate-300 transition hover:border-slate-800 hover:bg-slate-900/70 hover:text-white',
    menuIconLogout:
      'pi pi-sign-out min-w-[20px] text-lg text-slate-400 group-hover:text-red-400',
  },
})
</script>
