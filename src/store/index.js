import Vue from 'vue'
import Vuex from 'vuex'
import api from './modules/api'
import user from './modules/user'
import app from './modules/app'
import tagsView from './modules/tagsView'
import permission from './modules/asyncMenu'
import getters from './getters'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    api,
    user,
    app,
    tagsView,
    permission
  },
  getters
})
