import { createRouter, createWebHistory } from 'vue-router'
import tokenParse from '@/helpers/tokenParse'
import services from '@/services/services'

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
    },
    {
      path: '/vpn',
      name: 'vpn',
      component: VpnView,
    },
    {
      path: '/ai',
      name: 'ai',
      component: AiView,
    },
    {
      path: '/downloader',
      name: 'downloader',
      component: DownloaderView,
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView,
    },
  ],
})

router.beforeEach(async (to) => {
  if (to?.hash.includes('access_token')) {
    const { access_token, refresh_token } = tokenParse(to?.hash)

    if (access_token && refresh_token) {
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      return { name: 'home' }
    }
  }
  if (!localStorage.getItem('access_token') && to.name !== 'auth') {
    return { name: 'auth' }
  }
})

export default router
