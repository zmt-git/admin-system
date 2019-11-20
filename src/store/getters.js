const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  roles: state => state.user.roles,
  user: state => state.user.user,
  loadMenus: state => state.user.loadMenus,
  permission_routes: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  roadList: state => state.roadInfos.roadList,
  areaList: state => state.roadInfos.areaList,
  sensorList: state => state.roadInfos.sensorList
}
export default getters
