import http from '@/utils/http'

// GET /userRole/getTreeResource 获取资源树
export function getTreeResource () {
  return http({
    url: 'userRole/getTreeResource',
    method: 'GET'
  })
}

// POST /userRole/saveOrUpdateResource 添加/更新资源信息
export function saveOrUpdateResource (params) {
  return http({
    url: 'userRole/saveOrUpdateResource',
    method: 'POST',
    params
  })
}

// POST /userRole/deleteResourceById 删除资源信息
export function deleteResourceById (params) {
  return http({
    url: 'userRole/deleteResourceById',
    method: 'POST',
    params
  })
}
