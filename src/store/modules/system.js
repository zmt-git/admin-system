import Vue from 'vue'
import Vuex from 'vuex'
import { findAllRole } from '@/api/system/role'
import { findAllUser } from '@/api/system/user'
Vue.use(Vuex)

export default {
  state: {
    allRoles: [],
    allUsers: []
  },
  mutations: {
    SET_ALL_ROLES (state, allRoles) {
      state.allRoles = allRoles
    },
    SET_ALL_USERS (state, allUsers) {
      state.allUsers = allUsers
    }
  },
  actions: {
    getAllRoles ({ commit }) {
      return new Promise((resolve, reject) => {
        findAllRole()
          .then(res => {
            commit('SET_ALL_ROLES', res.result)
            resolve()
          })
          .catch(error => {
            console.error('src/store/modules/system.js "getAllRoles"')
            console.error(error)
            reject(error)
          })
      })
    },
    getAllUsers ({ commit }) {
      return new Promise((resolve, reject) => {
        findAllUser()
          .then(res => {
            commit('SET_ALL_USERS', res.result)
            resolve()
          })
          .catch(error => {
            console.error('src/store/modules/system.js "getAllUsers"')
            console.error(error)
            reject(error)
          })
      })
    }
  },
  modules: {
  }
}
