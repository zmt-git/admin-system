import Vue from 'vue'
import Vuex from 'vuex'
import api from './modules/api'
import user from './modules/user'
import app from './modules/app'
import tagsView from './modules/tagsView'
import asyncRouterList from './modules/asyncRouterList'
import system from './modules/system'
import getters from './getters'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    api,
    user,
    app,
    system,
    tagsView,
    asyncRouterList
  },
  getters
})
