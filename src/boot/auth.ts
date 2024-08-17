import { boot } from 'quasar/wrappers'
import { useAuthStore } from 'src/stores/authStore'

export default boot(() => {
  const authStore = useAuthStore()

  authStore.checkAutoLogin()
})
