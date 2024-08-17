import { NavigationGuardNext, RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { defaultRedirect } from 'src/router/index'
import { isAuthenticated } from 'src/services/auth/auth'
import { AuthMeta } from './types'

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

  // Проверяем, требуется ли аутентификация
  const authRequired = typeof authMeta === 'object' ? authMeta.required === true : authMeta === true

  if (!authRequired) return next() // Публичный маршрут

  // Определение перенаправления
  const redirect = (): RouteLocationRaw => {
    if (typeof authMeta === 'object') {
      if (typeof authMeta.redirect === 'function') {
        return authMeta.redirect({ from, to })
      }
      return authMeta.redirect || defaultAuthRedirect
    }
    return defaultAuthRedirect
  }

  if (!isAuthenticated()) {
    const route = redirect()
    // Добавляем параметр для перенаправления после входа
    const redirectAfterLoginTo = to.fullPath

    // Обработка случая, когда route является объектом
    if (typeof route === 'object' && 'query' in route) {
      // Обновляем query в случае, если route является объектом
      const updatedRoute = { ...route } as RouteLocationRaw & { query?: Record<string, any> }
      updatedRoute.query = {
        ...(route.query || {}),
        redirect: redirectAfterLoginTo
      }
      return next(updatedRoute)
    }

    // Обработка случая, когда route является строкой
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
  if (isAuthenticated()) return next({ name: defaultRedirect() })
  next()
}
