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

// DELETE /userRole/deleteResourceById 删除资源信息
export function deleteResourceById (params) {
  return http({
    url: 'userRole/deleteResourceById',
    method: 'DELETE',
    params
  })
}

// GET /userRole/getDeviceGroup 根据主控查找所属分组的ID和name {code： code}
export function getDeviceGroup (params) {
  return http({
    url: 'userRole/getDeviceGroup',
    method: 'GET',
    params
  })
}
