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
      path: '/champions',
      name: 'allChampions',
      component: () => import('../views/AllChampionsView.vue'),
      meta: {
        title: 'Champions | ARAM Stats'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        title: 'About | ARAM Stats'
      }
    },
    {
      path: '/updates',
      name: 'updates',
      component: () => import('../views/UpdatesView.vue'),
      meta: {
        title: 'Updates | ARAM Stats'
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
      component: () => import('../views/ChampionView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('../components/Error.vue'),
      meta: {
        title: '404 | ARAM Stats'
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.title)  document.title = to.meta.title
  // if (to.meta.metaTags) {
  //   for (const tag of to.meta.metaTags) {
  //     let meta = document.createElement('meta')
  //     meta.name = tag.name
  //     meta.content = tag.content

  //     document.head.appendChild(meta)
  //   }
  // }
  next()
})

export default router
