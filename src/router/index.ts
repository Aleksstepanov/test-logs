import { createRouter, createWebHistory } from 'vue-router'
import { beforeEach } from './middleware'
import routes from './routes'
import { useAuthStore } from 'src/stores/authStore'

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(beforeEach)
export default router

export const defaultRedirect = () => {
  const authStore = useAuthStore()
  if (!authStore.isAuthenticated) return 'page-login'
  return 'page-home'
}
