import http from '@/utils/http'

// GET / userRole / findAllRole 查询所有角色
export function findAllRole () {
  return http({
    url: 'userRole/findAllRole',
    method: 'GET'
  })
}
// /userRole/pageRole 分页查询角色 5659
export function pageRole (params) {
  return http({
    url: 'userRole/pageRole',
    method: 'POST',
    params
  })
}
