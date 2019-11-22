import http from '@/utils/http'

// GET /userRole/findAllUser 查询所有用户
export function findAllUser () {
  return http({
    url: 'userRole/findAllUser',
    method: 'GET'
  })
}
