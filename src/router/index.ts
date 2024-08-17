import { createRouter, createWebHistory } from 'vue-router'
import { beforeEach } from './middleware'
import { isAuthenticated } from 'src/services/auth/auth'
import routes from './routes'

const router = createRouter({
  history: createWebHistory('/'),
  routes
})

router.beforeEach(beforeEach)
export default router

export const defaultRedirect = () => {
  if (!isAuthenticated) return 'page-login'
  return 'page-home'
}
