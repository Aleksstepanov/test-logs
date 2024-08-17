import { RouteLocationNormalized, RouteLocationRaw, RouteMeta as VueRouteMeta } from 'vue-router'

export interface AuthMeta {
  required?: boolean;
  redirect?: RouteLocationRaw | ((context: { from: RouteLocationNormalized, to: RouteLocationNormalized }) => RouteLocationRaw);
}

export interface RouteMeta extends VueRouteMeta {
  auth?: boolean | AuthMeta;
}
