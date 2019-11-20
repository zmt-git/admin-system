const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  user: state => state.user.user,
  loadMenus: state => state.user.loadMenus,
  permission_routes: state => state.permission.routers,
  addRouters: state => state.permission.addRouters
}
export default getters
