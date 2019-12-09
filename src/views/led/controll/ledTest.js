// 方法
import { timestampToTime } from '@/utils/format'
// API
import { setTime, setFan, autoFan, setLaser, setFlanSh, setOnOrOffTime } from '@/api/led/controller'
export function testStart (list) {
  console.log(list)
  list.forEach(element => {
    setOnTime(element)
  })
}
// 初始值
let setFlanShRequest = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] // 设置屏闪
let setLaserRequest = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] // 设置亮度
let setFanRequest = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] // 风扇调速
let intervalIndex = 0 // 屏闪初始值
let intervalIndex2 = 0
// let intervalIndex3 = 0
let intervalIndex4 = 0 // 风扇开(手动)
// let onIndex = 0
// let offIndex = 0
// let intervalIndexSetFanOff = 0
// let intervalIndex5 = 0
// let intervalIndex6 = 0
// let intervalIndexFlanSh = 0
// 定义开关机时间
let timestamp = new Date().getTime()
let onTime = timestampToTime(timestamp, 'hh:mm') // 开机时间
let offTime = timestampToTime(timestamp + 2 * 60 * 60 * 1000, 'hh:mm') // 关机时间
let onTimeEnd = timestampToTime(timestamp - 2 * 60 * 60 * 1000, 'hh:mm') // 开机时间

// 开灯时间
async function setOnTime (code) {
  setTimeout(function () {
    setOnOrOffTime({ on: onTime, off: offTime, code: code })
    intervalSetTime(code)
  }, 1000)
}
// 同步时间
function intervalSetTime (code) {
  setTimeout(function () {
    setTime({ code: code }, 6000)
  })
  intervalSetFanOn(code)
}
// 风扇开(手动)
function intervalSetFanOn (code) {
  if (intervalIndex4 === setFanRequest.length) return
  setTimeout(function () {
    setFan({ onOrOff: 1, speed: setFanRequest[intervalIndex4], code: code })
  }, 3000)
  intervalSetFanOff(code)
}
// 风扇关(手动)
function intervalSetFanOff (code) {
  setTimeout(function () {
    setFan({ onOrOff: 0, speed: 0, code: code })
  }, 3000)
  intervalAutoFanOff(code)
}
// 风扇关(自动)
function intervalAutoFanOff (code) {
  setTimeout(function () {
    autoFan({ onOrOff: 0, code: code })
  }, 3000)
  intervalAutoFanOn(code)
}
// 风扇开(自动)
function intervalAutoFanOn (code) {
  setTimeout(function () {
    autoFan({ onOrOff: 1, code: code })
  }, 3000)
  interval(code)
}
// 设置屏闪(闪烁)
function interval (code) {
  if (intervalIndex === setFlanShRequest.length) return
  setTimeout(function () {
    setFlanSh({ onOrOff: 1, totalise: setFlanShRequest[intervalIndex], code: code })
  }, 120000)
  intervalOff(code)
}
// 设置屏闪(常亮)
function intervalOff (code) {
  setTimeout(function () {
    setFlanSh({ onOrOff: 0, totalise: 1, code: code })
  }, 120000)
  interval2(code)
}
// 设置亮度
function interval2 (code) {
  setTimeout(function () {
    setLaser({ laser: setLaserRequest[intervalIndex2], code: code })
  }, 120000)
  setOffTime(code)
}
// 设置关闭时间
function setOffTime (code) {
  setTimeout(function () {
    setOnOrOffTime({ code: code, on: onTimeEnd, off: onTime })
  }, 1000)
  setOnTime(code)
}
