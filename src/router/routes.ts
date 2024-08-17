import { metaAccount, metaPublic } from './meta-config'
import { RouteRecordRaw } from 'vue-router'
import { RouteMeta } from './types'
import { redirectIfAuthenticated } from './middleware'

const routes :Array<RouteRecordRaw & {meta?: RouteMeta}> = [
  {
    path: '/',
    redirect: { name: 'page-home' }
  },
  {
    path: '/login',
    name: 'page-login',
    component: () => import('pages/login'),
    meta: metaPublic,
    beforeEnter: redirectIfAuthenticated
  },
  {
    path: '/home',
    name: 'page-home',
    component: () => import('pages/home'),
    meta: metaAccount
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'page-not-found',
    component: () => import('pages/ErrorNotFound.vue'),
    meta: metaPublic
  }
]

export default routes
