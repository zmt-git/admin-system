const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  user: state => state.user.user,
  loadMenus: state => state.user.loadMenus,
  routers: state => state.asyncRouterList.routers,
  addRouters: state => state.asyncRouterList.addRouters
}
export default getters
