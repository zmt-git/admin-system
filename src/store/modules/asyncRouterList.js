import { fixedRouter } from '@/router'
const Layout = () => import('@/layout/index')
const permission = {
  state: {
    routers: fixedRouter,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = fixedRouter.concat(routers)
    }
  },
  actions: {
    GenerateRoutes ({ commit }, asyncRouter) {
      commit('SET_ROUTERS', asyncRouter)
    }
  }
}

// 遍历后台传来的路由字符串，转换为组件对象
export const filterAsyncRouter = (routers) => {
  const accessedRouters = routers.filter(router => {
    if (router.component) {
      if (router.component === 'Layout') { // Layout组件特殊处理
        router.component = Layout
      } else {
        const component = router.component
        router.component = loadView(component)
      }
    }
    if (router.children && router.children.length) {
      router.children = filterAsyncRouter(router.children)
    }
    return true
  })
  return accessedRouters
}

// 路由懒加载
export const loadView = (view) => {
  return () => import(`@/views/${view}`)
}

export default permission
