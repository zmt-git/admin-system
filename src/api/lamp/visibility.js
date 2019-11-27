import http from '@/utils/http'

// GET / userRole / findAllRole 查询所有角色
export function findAllRole () {
  return http({
    url: 'userRole/findAllRole',
    method: 'GET'
  })
}
