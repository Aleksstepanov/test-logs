import { NavigationGuardNext, RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { defaultRedirect } from 'src/router/index'
import { AuthMeta } from './types'
import { useAuthStore } from 'src/stores/authStore'

const defaultAuthRedirect: RouteLocationRaw = { name: 'page-login' }

/**
 * Middleware для проверки аутентификации и обработки перенаправлений
 */
export const beforeEach = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authMeta = to.meta.auth as boolean | AuthMeta | undefined

  const authRequired = typeof authMeta === 'object' ? authMeta.required === true : authMeta === true

  if (!authRequired) return next()

  const redirect = (): RouteLocationRaw => {
    if (typeof authMeta === 'object') {
      if (typeof authMeta.redirect === 'function') {
        return authMeta.redirect({ from, to })
      }
      return authMeta.redirect || defaultAuthRedirect
    }
    return defaultAuthRedirect
  }

  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    const route = redirect()
    const redirectAfterLoginTo = to.fullPath

    if (typeof route === 'object' && 'query' in route) {
      const updatedRoute = { ...route } as RouteLocationRaw & { query?: Record<string, any> }
      updatedRoute.query = {
        ...(route.query || {}),
        redirect: redirectAfterLoginTo
      }
      return next(updatedRoute)
    }

    if (typeof route === 'string') {
      return next({
        path: route,
        query: {
          redirect: redirectAfterLoginTo
        }
      })
    }

    return next(route)
  }

  next()
}

/**
 * Middleware для перенаправления аутентифицированных пользователей
 */
export const redirectIfAuthenticated = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()
  if (authStore.isAuthenticated) return next({ name: defaultRedirect() })
  next()
}
