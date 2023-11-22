import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'ARAM Stats'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        title: 'About - ARAM Stats'
      }
    },
    {
      path: '/updates',
      name: 'updates',
      component: () => import('../views/UpdatesView.vue'),
      meta: {
        title: 'Updates - ARAM Stats'
      }
    },
    {
      path: '/:region/:gameName-:tagLine',
      name: 'user',
      component: () => import('../views/UserView.vue')
    },
    {
      path: '/champions/:champion',
      name: 'champions',
      component: () => import('../views/ChampionView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.title)  document.title = to.meta.title
  next()
})

export default router
