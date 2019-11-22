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

// POST /userRole/saveOrUpdateRole 添加/更新角色信息
export function saveOrUpdateRole (params) {
  return http({
    url: 'userRole/saveOrUpdateRole',
    method: 'POST',
    params
  })
}

// GET /userRole/isRole 查询角色是否存在
export function isRole (params) {
  return http({
    url: 'userRole/isRole',
    method: 'GET',
    params
  })
}

// GET /userRole/findRoleById 获取角色信息
export function findRoleById (params) {
  return http({
    url: 'userRole/findRoleById',
    method: 'GET',
    params
  })
}

// POST /userRole/deleteRoleById 删除角色信息
export function deleteRoleById (params) {
  return http({
    url: 'userRole/deleteRoleById',
    method: 'POST',
    params
  })
}

// POST /userRole/assignResources 给角色分配资源
export function assignResources (params) {
  return http({
    url: 'userRole/assignResources',
    method: 'POST',
    params
  })
}
