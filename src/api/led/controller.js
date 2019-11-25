import http from '@/utils/http'

// POST /laser/pageMainControl 查询激光灯状态
export function getMainControl (data) {
  return http({
    url: 'laser/pageMainControl',
    method: 'POST',
    data
  })
}
// GET /laser/getLaserStatus 获取当前状态
export function getLaserStatus (data) {
  return http({
    url: 'laser/getLaserStatus',
    method: 'POST',
    data
  })
}
