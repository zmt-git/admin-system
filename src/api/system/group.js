import http from '@/utils/http'

// POST /userRole/saveOrUpdateGroup 添加/更新分组信息
export function saveOrUpdateGroup (params) {
  return http({
    url: 'userRole/saveOrUpdateGroup',
    method: 'POST',
    params
  })
}

// POST / userRole / pageGroup 分页查询分组
export function pageGroup (params) {
  return http({
    url: 'userRole/pageGroup',
    method: 'POST',
    params
  })
}

// GET /userRole/isGroup 查询分组是否存在
export function isGroup (params) {
  return http({
    url: 'userRole/isGroup',
    method: 'GET',
    params
  })
}

// GET /userRole/findGroupById 获取分组信息
export function findGroupById (params) {
  return http({
    url: 'userRole/findGroupById',
    method: 'GET',
    params
  })
}

// /userRole/findAllGroup 查询所有分组
export function findAllGroup (params) {
  return http({
    url: 'userRole/findAllGroup',
    method: 'GET',
    params
  })
}

// POST /userRole/deleteGroupById 删除分组信息
export function deleteGroupById (params) {
  return http({
    url: 'userRole/deleteGroupById',
    method: 'POST',
    params
  })
}

// GET /userRole/assignDevice 在分组中添加设备
export function assignDevice (params) {
  return http({
    url: 'userRole/assignDevice',
    method: 'POST',
    params
  })
}
