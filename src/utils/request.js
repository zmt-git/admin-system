import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from 'store/index.js'
import router from 'router/index.js'
import { getToken } from '@/utils/auth'

const service = axios.create({
  baseURL: '',
  timeOut: 5000
})

axios.interceptors.requset.use(
  config => {
    if (store.getters.token) {
      config.header['token'] = getToken()
    }
    return config
  },
  error => {
    console.error(error)
    return Promise.reject(error)
  }
)
axios.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 1) {
      if (res.code === 1003) {
        MessageBox.confirm('登录信息已过期，是否重新登录', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            store.dispatch('user/resetToken')
              .then(() => {
                location.reload()
              })
          })
      } else if (res.code === 400) {
        router.push('/400')
      } else if (res.code === 404) {
        router.push('/404')
      } else {
        Message({
          message: res.msg || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.error(error)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
