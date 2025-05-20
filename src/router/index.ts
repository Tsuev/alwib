import { createRouter, createWebHistory } from 'vue-router'
import tokenParse from '@/helpers/tokenParse'

import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/views/AuthView.vue'),
    },
  ],
})

router.beforeEach((to) => {
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
