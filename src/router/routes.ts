import { metaAccount, metaPublic } from './meta-config'
import { RouteRecordRaw } from 'vue-router'
import { RouteMeta } from './types'

const routes :Array<RouteRecordRaw & {meta?: RouteMeta}> = [
  {
    path: '/',
    redirect: { name: 'page-home' }
  },
  {
    path: '/login',
    name: 'page-login',
    component: () => import('pages/login'),
    meta: metaPublic
  },
  {
    path: '/home',
    name: 'page-home',
    component: () => import('pages/home'),
    meta: metaAccount
  }
]

export default routes
