// 方法
// import { timestampToTime } from '@/utils/format'
// API
// import { setTime, setFan, autoFan, setLaser, setFlanSh, setOnOrOffTime, getLaserStatus } from '@/api/led/controller'
export function testStart (list) {
  console.log(list)
  testTime(list)
}
// 开灯时间
function testTime (list) {
  // let timestamp = new Date().getTime()
  // let onTime = timestampToTime(timestamp, 'hh:mm') // 开机时间
  // let offTime = timestampToTime(timestamp + 2 * 60 * 60 * 1000, 'hh:mm') // 关机时间
  list.forEach(element => {
    // setOnOrOffTime({ on: onTime, off: offTime, code: element })
    setTimeout(() => {
      // setOnOrOffTime({ on: onTime, off: offTime, code: element })
    }, 10000)
  })
}
// function testnigth (list) {
//   console.log('testnigth' + list)
// }
