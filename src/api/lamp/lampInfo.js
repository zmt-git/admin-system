import http from '@/utils/http'

// POST /lead/pageMainControl 分页查询主控信息
export function pageMainControl (data) {
  return http({
    url: 'lead/pageMainControl',
    method: 'POST',
    data
  })
}

// POST /lead/deleteByIds 删除主控信息
export function deleteByIds (params) {
  return http({
    url: 'lead/deleteByIds',
    method: 'DELETE',
    params
  })
}

// POST /lead/saveOrUpdate 添加/更新主控信息
export function saveOrUpdate (params) {
  return http({
    url: 'lead/saveOrUpdate',
    method: 'POST',
    params
  })
}

// GET /lead/findAllMainControl 查询所有主控
export function findAllMainControl () {
  return http({
    url: 'lead/findAllMainControl',
    method: 'GET'
  })
}
// GET /lead/isCode 查询主控编号是否唯一
export function isCode (params) {
  return http({
    url: 'lead/isCode',
    method: 'GET',
    params
  })
}

// GET /lead/getMainStatus 获取主控当前状态
export function getMainStatus (params) {
  return http({
    url: 'lead/getMainStatus',
    method: 'GET',
    params
  })
}

// GET /lead/manualAuto 设置工作模式
export function manualAuto (params) {
  return http({
    url: `lead/manualAuto`,
    method: 'GET',
    params
  })
}
// POST / 跟新诱导灯状态
export function updateLead (params) {
  return http({
    url: 'lead/updateLead',
    method: 'POST',
    params
  })
}

// /lead/findVIS 查询四小时内的能见度变化(返回表格)
export function findVIS (params) {
  return http({
    url: 'lead/findVIS',
    method: 'GET',
    params
  })
}

// GET /lead/findVISStu 查询四小时内的能见度变化
export function findVISStu (params) {
  return http({
    url: 'lead/findVISStu',
    method: 'GET',
    params
  })
}
