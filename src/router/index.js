import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
// 固定的路由表
export const fixedRouter = [
  {
    path: '/login',
    component: () => import('@/views/login/login'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  }
]
export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: fixedRouter
})
