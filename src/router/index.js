import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/:region/:username',
      name: 'user',
      component: () => import('../views/UserView.vue')
    },
    // {
    //   path: '/:region/username',
    //   name: 'userCall',
    //   component: () => import('../components/User/UserCall.vue')
    // }
  ]
})

export default router
