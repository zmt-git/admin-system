import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import NProgress from 'nprogress'
import Message from 'element-ui'
import { getToken } from '@/utils/auth'
import { filterAsyncRouter } from '@/store/modules/asyncRouterList'
import { loadMenus } from '@/api/login/login'
import 'nprogress/nprogress.css'
const Layout = () => import(/* webpackChunkName: "group-foo" */ '@/layout/index')

Vue.use(Router)
// 固定的路由表
export const fixedRouter = [
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "group-foo" */ '@/views/login/login'),
    hidden: true
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import(/* webpackChunkName: "group-foo" */ '@/views/redirect/index')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    hidden: true,
    meta: {
      title: '首页',
      icon: '&#xe608;'
    },
    children: [
      {
        path: '/index',
        component: () => import(/* webpackChunkName: "group-foo" */ '@/views/index'),
        hidden: true,
        meta: {
          title: '首页',
          icon: '&#xe608;'
        }
      }
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "group-foo" */ '@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import(/* webpackChunkName: "group-foo" */ '@/views/errorPage/401'),
    hidden: true
  }
]
const router = new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: fixedRouter
})
export default router
NProgress.configure({ showSpinner: false })

const whiteList = ['/login']
router.beforeEach(async (to, from, next) => {
  // 进度条 开始
  NProgress.start()
  // 从cookie中获取token
  const hasToken = getToken()
  if (hasToken) {
    // 用户登录过， 路径为login，重定向主页 /
    if (to.path === '/login') {
      next({ path: '/index' })
      // 进度条 结束
      NProgress.done()
    } else {
      // 获取路由表
      const hasAsyncRouter = store.getters.loadMenus
      if (hasAsyncRouter) {
        next()
        NProgress.done()
      } else {
        try {
          // 获取权限列表
          const { result } = await loadMenus()

          // vuex储存生成路由列表
          await store.dispatch('GenerateRoutes', result)

          // 路由表转化
          const asyncRouters = filterAsyncRouter(store.getters.addRouters)

          // 添加404页面
          asyncRouters.push({ path: '*', redirect: '/404', hidden: true })

          // 获取路由状态改为 以获取
          await store.commit('SET_LOAD_MENUS', true)

          // 添加至路由表
          router.addRoutes(asyncRouters)

          next({ ...to, replace: true })

          NProgress.done()
        } catch (error) {
          // 提示出错
          Message.error({
            type: 'info',
            message: error || '未知错误'
          })

          // 清空路由表
          await store.commit('SET_ROUTERS', [])

          await store.dispatch('updateLoadMenus')

          // 删除token
          await store.dispatch('Logout')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
    NProgress.done()
  }
})

router.afterEach(() => {
  // 进度条 结束
  NProgress.done()
})
