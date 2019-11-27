import http from '@/utils/http'

// GET /lead/getLeadStatus 根据主控code获取所有诱导灯当前状态
export function getLeadStatus (params) {
  return http({
    url: 'lead/getLeadStatus',
    method: 'GET',
    params
  })
}
