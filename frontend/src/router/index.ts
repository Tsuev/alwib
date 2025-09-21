import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

import HomeView from '../views/HomeView.vue'
import AiView from '@/views/AiView.vue'
import DownloaderView from '@/views/DownloaderView.vue'
import AuthView from '@/views/AuthView.vue'
import VpnView from '@/views/VpnView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/vpn',
      name: 'vpn',
      component: VpnView,
      meta: { requiresAuth: true },
    },
    {
      path: '/ai',
      name: 'ai',
      component: AiView,
      meta: { requiresAuth: true },
    },
    {
      path: '/downloader',
      name: 'downloader',
      component: DownloaderView,
      meta: { requiresAuth: true },
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView,
      meta: { requiresGuest: true },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // Если маршрут требует авторизации
  if (to.meta.requiresAuth) {
    if (!userStore.isAuthenticated) {
      next({ name: 'auth' })
      return
    }
  }

  // Если маршрут только для гостей (например, страница входа)
  if (to.meta.requiresGuest) {
    if (userStore.isAuthenticated) {
      next({ name: 'home' })
      return
    }
  }

  next()
})

export default router
