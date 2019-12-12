// 方法
import { timestampToTime } from '@/utils/format'
// API
import { setTime, setFan, autoFan, setLaser, setFlanSh, setOnOrOffTime } from '@/api/led/controller'
let stop = false
let info = ''
let timeout = 2000
export function testStart (codes) {
  stop = false
  for (let i = 0; i < codes.length; i++) {
    // model
    setTimeout(function () {
      setOnTimeClosure(codes[i])
    }, 500)
  }
}
export function stopTest () {
  stop = true
}
// 开灯时间
function setOnTimeClosure (code) {
  let timestamp = new Date().getTime()
  let onTime = timestampToTime(timestamp, 'hh:mm') // 开机时间
  let offTime = timestampToTime(timestamp + 2 * 60 * 60 * 1000, 'hh:mm') // 关机时间
  function setOnTime (code) {
    if (stop) {
      return
    }
    setTimeout(function () {
      setOnOrOffTime({ on: onTime, off: offTime, code: code })
      console.log('设置开关灯时间:开机')
      intervalSetTimeClosure(code)
    }, timeout)
  }
  setOnTime(code)
}

// 同步时间
function intervalSetTimeClosure (code) {
  let setTimeArr = [1, 2, 3]
  let setTimeIndex = 0
  function intervalSetTime (code) {
    if (stop) {
      return
    }
    if (setTimeIndex === setTimeArr.length) {
      setTimeIndex = 0
      intervalSetFanOffOrOnClosure(code)
      return
    }
    setTimeout(function () {
      setTime({ code: code })
      info = setTimeArr[setTimeIndex]
      console.log('同步时间:' + info + '次')
      setTimeIndex++
      intervalSetTime(code)
    }, timeout)
  }
  intervalSetTime(code)
}

// 风扇开关
function intervalSetFanOffOrOnClosure (code) {
  let SetFanOffOrOnArr = [1, 0, 1]
  let SetFanOffOrOnIndex = 0
  function intervalSetFanOffOrOn (code) {
    if (stop) {
      return
    }
    if (SetFanOffOrOnIndex === SetFanOffOrOnArr.length) {
      SetFanOffOrOnIndex = 0
      intervalSetFanOnClosure(code)
      return
    }
    setTimeout(function () {
      setFan({ onOrOff: SetFanOffOrOnArr[SetFanOffOrOnIndex], speed: 0, code: code })
      info = SetFanOffOrOnArr[SetFanOffOrOnIndex] === 0 ? '关闭' : '开启'
      console.log('风扇开关:' + info)
      SetFanOffOrOnIndex++
      intervalSetFanOffOrOn(code)
    }, timeout)
  }
  intervalSetFanOffOrOn(code)
}

// 风扇调速
function intervalSetFanOnClosure (code) {
  let setFanRequest = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] // 风扇调速
  let intervalIndex4 = 0 // 风扇开(手动)
  function intervalSetFanOn (code) {
    if (stop) {
      return
    }
    if (intervalIndex4 === setFanRequest.length) {
      intervalIndex4 = 0
      intervalAutoFanOffClosure(code)
      return
    }
    if (intervalIndex4 === setFanRequest.length) return
    setTimeout(function () {
      setFan({ onOrOff: 1, speed: setFanRequest[intervalIndex4], code: code })
      info = setFanRequest[intervalIndex4] + '%'
      console.log('风扇调速:' + info)
      intervalIndex4++
      intervalSetFanOn(code)
    }, timeout)
  }
  intervalSetFanOn(code)
}

// 风扇关(自动)
function intervalAutoFanOffClosure (code) {
  let AutoFanOffArr = [0, 1, 0]
  let AutoFanOffIndex = 0
  function intervalAutoFanOff (code) {
    if (stop) {
      return
    }
    if (AutoFanOffIndex === AutoFanOffArr.length) {
      AutoFanOffIndex = 0
      intervalOffClosure(code)
      return
    }
    setTimeout(function () {
      autoFan({ onOrOff: 0, code: code })
      info = AutoFanOffArr[AutoFanOffIndex] === 0 ? '手动' : '自动'
      console.log('风扇模式:' + info)
      AutoFanOffIndex++
      intervalAutoFanOff(code)
    }, timeout)
  }
  intervalAutoFanOff(code)
}

// 设置屏闪(常亮)
function intervalOffClosure (code) {
  let intervalOffArr = [1, 0, 1]
  let intervalOffIndex = 0
  function intervalOff (code) {
    if (stop) {
      return
    }
    if (intervalOffIndex === intervalOffArr.length) {
      intervalOffIndex = 0
      intervalClosure(code)
      return
    }
    setTimeout(function () {
      setFlanSh({ onOrOff: intervalOffArr[intervalOffIndex], totalise: 1, code: code })
      info = intervalOffArr[intervalOffIndex] === 0 ? '常亮' : '闪烁'
      console.log('闪烁控制:' + info)
      intervalOffIndex++
      intervalOff(code)
    }, 36000)
  }
  intervalOff(code)
}

// 设置屏闪(闪烁)
function intervalClosure (code) {
  let setFlanShRequest = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] // 设置屏闪
  let intervalIndex = 0 // 屏闪初始值
  function interval (code) {
    if (stop) {
      return
    }
    if (intervalIndex === setFlanShRequest.length) {
      intervalIndex = 0
      interval2Closure(code)
      return
    }
    if (intervalIndex === setFlanShRequest.length) return
    setTimeout(function () {
      setFlanSh({ onOrOff: 1, totalise: setFlanShRequest[intervalIndex], code: code })
      info = setFlanShRequest[intervalIndex]
      console.log('屏闪方案:闪烁方案' + info)
      intervalIndex++
      interval(code)
    }, 36000)
  }
  interval(code)
}

// 设置亮度
function interval2Closure (code) {
  let setLaserRequest = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] // 设置亮度
  let intervalIndex2 = 0
  function interval2 (code) {
    if (stop) {
      return
    }
    if (intervalIndex2 === setLaserRequest.length) {
      intervalIndex2 = 0
      setOffTimeClosure(code)
      return
    }
    setTimeout(function () {
      setLaser({ laser: setLaserRequest[intervalIndex2], code: code })
      info = setLaserRequest[intervalIndex2] + '%'
      console.log('激光亮度:' + info)
      intervalIndex2++
      interval2(code)
    }, 36000)
  }
  interval2(code)
}

// 设置关闭时间
function setOffTimeClosure (code) {
  let timestamp = new Date().getTime()
  let onTime = timestampToTime(timestamp - 5 * 60 * 60 * 1000, 'hh:mm') // 开机时间
  let offTime = timestampToTime(timestamp - 2 * 60 * 60 * 1000, 'hh:mm') // 关机时间
  function setOffTime (code) {
    setTimeout(function () {
      setOnOrOffTime({ code: code, on: offTime, off: onTime })
      console.log('设置开关灯时间:关机')
      setOnTimeClosure(code)
    }, timeout)
  }
  setOffTime(code)
}
