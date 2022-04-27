import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import VdaListView from '../views/VdaListView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/analysis/vda',
    name: 'vdaList',
    component: VdaListView
  },
  {
    path: '/analysis/vda/:paperId',
    name: 'vdaAnalysis',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/VdaView.vue')
  },
  {
    path: '/:pathMatch(.*)',
    name: 'notFound',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
