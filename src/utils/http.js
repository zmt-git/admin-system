import axios from 'axios'
// 包装param参数
import router from '@/router'
import { Notification, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import Config from '@/config'
const service = axios.create({
  baseURL: 'http://192.168.2.172/', // api 的 base_url
  timeout: Config.timeout // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers['token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    config.headers['Content-Type'] = 'application/json'
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    const code = parseInt(response.data.code)
    if (code === 1) {
      return response.data
    } else {
      Notification.error({
        title: response.data.msg || response.data.message,
        offset: 50
      })
      if (code === 1006) {
        router.push('/404')
      }
      if (code === 1013) {
        MessageBox.confirm(
          '登录状态已过期，您可以继续留在该页面，或者重新登录',
          '系统提示',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('LogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
            router.push('/login')
          })
        })
      }
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject('error')
    }
  },
  error => {
    let code = 0
    try {
      code = error.response.status
    } catch (e) {
      if (error.toString().indexOf('Cancel') >= 0) {
        return Promise.reject(error)
      } else if (error.toString().indexOf('timeout')) {
        Notification.error({
          title: '请求超时',
          duration: 2500,
          offset: 50
        })
        return Promise.reject(error)
      }
    }
    // 代码未修改
    if (code === 404) {
      router.push({ path: '/404' })
    } else if (code === 401) {
      router.push({ path: '/401' })
    } else {
      const errorMsg = error.response.data.errors
      if (errorMsg !== undefined) {
        errorMsg.forEach(item => {
          setTimeout(() => {
            Notification.error({
              title: item.defaultMessage || error.response.error,
              duration: 2500,
              offset: 50
            })
          }, 500)
        })
      }
    }
    return Promise.reject(error)
  }
)
export default service
