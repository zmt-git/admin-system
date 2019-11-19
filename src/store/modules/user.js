import Vue from 'vue'
import Vuex from 'vuex'
import { login } from 'src/api/login/login'
import { saveToken } from 'src/utils/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: '',
    role: ''
  },
  mutations: {
    SET_USER (state, user) {
      state.user = user
    },
    SET_ROLE (state, role) {
      state.role = role
    }
  },
  actions: {
    Login ({ commit }, loginInfo) {
      const { username, password } = loginInfo
      // eslint-disable-next-line no-new
      new Promise((resolve, reject) => {
        login({ username: username, password: password })
          .then(res => {
            if (res.token) {
              saveToken(res.token)
            }
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
  }
})
