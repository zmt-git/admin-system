import { login } from '@/api/login/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    tokenLed: getToken('LED'),
    user: {},
    roles: [],
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
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_LOAD_MENUS: (state, loadMenus) => {
      state.loadMenus = loadMenus
    },
    SET_LED_TOKEN: (state, tokenLed) => {
      state.tokenLed = tokenLed
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
          if (res.result === '4002') {
            return res
          }
          if (res.token) {
            setToken(res.token, rememberMe)
            commit('SET_TOKEN', res.token)
            setUserInfo(res.user, commit)
            // 第一次加载菜单时用到
            commit('SET_LOAD_MENUS', true)
            // 将用户信息传递到登录页面
            resolve(that.state.user)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    // GetInfo ({ commit }) {
    //   return new Promise((resolve, reject) => {
    //     getInfo().then(res => {
    //       setUserInfo(res, commit)
    //       resolve(res)
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    Logout ({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_USER', {})
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

export const setUserInfo = (res, commit) => {
  // 如果没有任何权限，则赋予一个默认的权限，避免请求死循环
  if (res.authorities.length === 0) {
    // commit("SET_ROLES", ["ROLE_SYSTEM_DEFAULT"])
  } else {
    console.log('set roles :' + res.authorities)
    commit('SET_ROLES', res.authorities)
  }
  commit('SET_USER', res)
}

export default user
