import { login } from '@/api/login/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    user: {},
    // 第一次加载菜单时用到
    loadMenus: false
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_LOAD_MENUS: (state, loadMenus) => {
      state.loadMenus = loadMenus
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      const username = userInfo.username
      const password = userInfo.password
      const rememberMe = userInfo.rememberMe
      let that = this
      return new Promise((resolve, reject) => {
        login({ username: username, password: password }).then(res => {
          if (res.result) {
            setToken(res.result, rememberMe)
            commit('SET_TOKEN', res.result)
            // 将用户信息传递到登录页面
            resolve(that.state.user)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_USER', {})
        commit('SET_LOAD_MENUS', false)
        removeToken()
        resolve()
      })
    },
    updateLoadMenus ({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD_MENUS', false)
      })
    }
  }
}

export default user
