import http from '@/utils/http'

// POST /horn/pageMainControl 分页查询主控信息
export function pageMainControl (data) {
  return http({
    url: 'horn/pageMainControl',
    method: 'POST',
    data
  })
}

// POST /horn/saveOrUpdate 添加/更新主控信息
export function saveOrUpdate (params) {
  return http({
    url: 'horn/saveOrUpdate',
    method: 'POST',
    params
  })
}

// DELETE /horn/deleteByIds 删除主控信息
export function deleteByIds (params) {
  return http({
    url: 'horn/deleteByIds',
    method: 'DELETE',
    params
  })
}

// GET /horn/findAllMainControl 查询所有主控
export function findAllMainControl () {
  return http({
    url: 'horn/findAllMainControl',
    method: 'GET'
  })
}

// GET /horn/getMainControl 获取主控信息
export function getMainControl (params) {
  return http({
    url: 'horn/getMainControl',
    method: 'GET',
    params
  })
}

// GET /horn/getMainStatus 获取主控当前状态
export function getMainStatus (params) {
  return http({
    url: 'horn/getMainStatus',
    method: 'GET',
    params
  })
}

// GET /horn/isCode 查询主控编号是否唯一
export function isCode (params) {
  return http({
    url: 'horn/isCode',
    method: 'GET',
    params
  })
}

// GET /horn/manualSwitch 手动开关机
export function manualSwitch (params) {
  return http({
    url: 'horn/manualSwitch',
    method: 'GET',
    params
  })
}

// GET /horn/playMode 设置播放模式
export function playMode (params) {
  return http({
    url: 'horn/playMode',
    method: 'GET',
    params
  })
}

// GET /horn/sendMsg 发送任意指令
export function sendMsg (params) {
  return http({
    url: 'horn/sendMsg',
    method: 'GET',
    params
  })
}

// GET /horn/setFlanSh 设置播放方案
export function setFlanSh (params) {
  return http({
    url: 'horn/setFlanSh',
    method: 'GET',
    params
  })
}

// GET /horn/setOnOrOffTime 设置工作时间
export function setOnOrOffTime (params) {
  return http({
    url: 'horn/setOnOrOffTime',
    method: 'GET',
    params
  })
}

// GET /horn/setTime 设置时间
export function setTime (params) {
  return http({
    url: 'horn/setTime',
    method: 'GET',
    params
  })
}
