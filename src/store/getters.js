const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  user: state => state.user.user,
  loadMenus: state => state.user.loadMenus,
  routers: state => state.asyncRouterList.routers,
  addRouters: state => state.asyncRouterList.addRouters,
  allRoles: state => state.system.allRoles,
  allUsers: state => state.system.allUsers,
  allGroups: state => state.system.allGroups
}
export default getters
