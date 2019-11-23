import http from '@/utils/http'

// POST /laser/pageMainControl 查询激光灯状态
export function getStatus () {
  return http({
    url: 'laser/pageMainControl',
    method: 'POST'
  })
}
