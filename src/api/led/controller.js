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
export function getLaserStatus (params) {
  return http({
    url: 'laser/getLaserStatus',
    method: 'GET',
    params
  })
}
// POST /laser/saveOrUpdate 添加/更新主控信息
export function saveOrUpdate (params) {
  return http({
    url: 'laser/saveOrUpdate',
    method: 'POST',
    params
  })
}
// POST /laser/deleteByIds 删除主控信息
export function deleteByIds (params) {
  return http({
    url: 'laser/deleteByIds',
    method: 'POST',
    params
  })
}
// GET /laser/isCode 查询主控编号是否唯一
export function isCode (params) {
  return http({
    url: 'laser/isCode',
    method: 'GET',
    params
  })
}
// GET /laser/setTime 同步单片机时间
export function setTime (params) {
  return http({
    url: 'laser/setTime',
    method: 'GET',
    params
  })
}
// GET /laser/setFan 控制设备风扇接口
export function setFan (params) {
  return http({
    url: 'laser/setFan',
    method: 'GET',
    params
  })
}
// GET /laser/autoFan 控制设备风扇自动控制接口
export function autoFan (params) {
  return http({
    url: 'laser/autoFan',
    method: 'GET',
    params
  })
}
// GET /laser/setLaser 设置亮度
export function setLaser (params) {
  return http({
    url: 'laser/setLaser',
    method: 'GET',
    params
  })
}
// GET /laser/setFlanSh 设置屏闪方案
export function setFlanSh (params) {
  return http({
    url: 'laser/setFlanSh',
    method: 'GET',
    params
  })
}
// GET /laser/setOnOrOffTime 设置工作时间
export function setOnOrOffTime (params) {
  return http({
    url: 'laser/setOnOrOffTime',
    method: 'GET',
    params
  })
}
