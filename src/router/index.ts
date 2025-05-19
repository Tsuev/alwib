import { createRouter, createWebHistory } from 'vue-router'
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

router.beforeEach((to, from) => {
  console.log(from)

  if (!localStorage.getItem('access_token') && to.name !== 'auth') {
    return { name: 'auth' }
  }
})

export default router
