import http from '@/utils/http'

// POST /userRole/saveOrUpdateGroup 添加/更新分组信息
export function saveOrUpdateGroup (params) {
  return http({
    url: 'userRole/saveOrUpdateGroup',
    method: 'POST',
    params
  })
}
