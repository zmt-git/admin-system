// import request from 'utils/request'
import http from '@/utils/http'

// POST /system/login PC客户登录
export function login (params) {
  return http({
    url: 'system/login',
    method: 'POST',
    params
  })
}

// GET /userRole/getRoute获取用户路由
export function loadMenus () {
  return http({
    url: `userRole/getRoute`,
    method: 'GET'
  })
}
