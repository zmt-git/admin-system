import request from 'src/utils/request'
// POST /system/login PC客户登录
export function login (params) {
  return request({
    url: 'system/login',
    method: 'POST',
    params
  })
}
