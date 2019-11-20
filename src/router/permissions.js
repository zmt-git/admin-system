import router from 'router'
import store from 'store'
import NProgress from 'nprogress'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'
import { filterAsyncRouter } from 'store/modules/asyncRouterList'
import { loadMenus } from 'api/login/login'
import 'nprogress/nprogress.css'
NProgress.configure({ showSpinner: false })

const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  // 进度条 开始
  debugger
  NProgress.start()
  // 从cookie中获取token
  const hasToken = getToken()
  if (hasToken) {
    // 用户登录过， 路径为login，重定向主页 /
    if (to.path === '/login') {
      next({ path: '/' })
      // 进度条 结束
      NProgress.done()
    } else {
      // 获取获取路由表
      const hasAsyncRouterList = store.getters.addRouters && store.getters.addRouters.lenght > 0
      if (hasAsyncRouterList) {
        next()
      } else {
        try {
          // 获取权限列表
          const list = await loadMenus()

          // vuex储存生成路由列表
          const { addRouters } = await store.dispatch('GenerateRoutes', list)

          // 路由表转化
          const asyncRouters = filterAsyncRouter(addRouters)
          console.log(asyncRouters)
          // 添加至路由
          router.addRouters(asyncRouters)

          next({ ...to, replace: true })
        } catch (error) {
          // 删除token
          await store.dispatch('resetToken')

          // 清空路由表
          await store.commit('SET_ROUTERS', [])

          // 提示出错
          Message.error(error || '异常错误')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    // 没有token
    await store.commit('resetToken')
    // 看是否为白名单
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 进度条 结束
  NProgress.done()
})
