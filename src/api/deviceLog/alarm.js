import http from '@/utils/http'
// POST /horn/pageAlarm 分页查询告警历史信息
export function pageAlarm (data) {
  return http({
    url: 'horn/pageAlarm',
    method: 'POST',
    data
  })
}
// POST /horn/saveOrUpdate 分页查询告警历史信息
export function saveOrUpdate (params) {
  return http({
    url: 'horn/saveOrUpdate',
    method: 'POST',
    params
  })
}
// POST /horn/deleteByIds 分页查询告警历史信息
export function deleteByIds (params) {
  return http({
    url: 'horn/deleteByIds',
    method: 'DELETE',
    params
  })
}
