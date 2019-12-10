import { manualSwitch, setOnOrOffTime, setTime, setFlanSh, playMode } from '@/api/voice/voiceInfo'
import { timestampToTime } from '@/utils/format'

let stop = false
let info = ''
let timeout = 2 * 60 * 1000
/**
 * @param {Array} codes测试codelist
 */
export function startTest (codes) {
  stop = false
  for (let i = 0; i < codes.length; i++) {
    // model
    setOnTimes(codes[i])
  }
}
export function stopTest () {
  stop = true
}
// 设置开机时间
function setOnTimes (code) {
  let on = new Date()
  let off = new Date(new Date().getTime() + 2 * 3600 * 1000)
  if (stop) {
    return
  }
  setTimeout(function () {
    setOnOrOffTime({ on: timestampToTime(on, 'hh:mm:ss'), off: timestampToTime(off, 'hh:mm:ss'), code: code })
    console.log('测试开关机时间:开')
    powerSwitch(code)
  }, timeout)
}

// 开关
let powerSwitchArr = [1, 0, 1]
let powerSwitchIndex = 0
function powerSwitch (code) {
  if (stop) {
    return
  }
  if (powerSwitchIndex === powerSwitchArr.length) {
    playModes(code)
    powerSwitchIndex = 0
    return
  }
  setTimeout(function () {
    manualSwitch({ code: code, powerSwitch: powerSwitchArr[powerSwitchIndex] })
    powerSwitchArr[powerSwitchIndex] === 0 ? info = '关闭' : info = '开启'
    console.log('测试开关:' + info)
    powerSwitchIndex++
    powerSwitch(code)
  }, timeout)
}

// playMode
let playModetArr = [1, 0, 1]
let playModeIndex = 0
function playModes (code) {
  if (stop) {
    return
  }
  if (playModeIndex === playModetArr.length) {
    setTimes(code)
    playModeIndex = 0
    return
  }
  setTimeout(function () {
    obj.code = code
    obj.atNight = playModetArr[playModeIndex]
    playMode(obj)
    playModetArr[playModeIndex] === 0 ? info = '车辆检测播放' : info = '自动连续播放'
    console.log('测试播放模式:' + info)
    playModeIndex++
    playModes(code)
  }, timeout)
}

// 同步时间
let setTimetArr = [1, 2, 3]
let setTimeIndex = 0
function setTimes (code) {
  if (stop) {
    return
  }
  if (setTimeIndex === setTimetArr.length) {
    setFlanShs(code)
    setTimeIndex = 0
    return
  }
  setTimeout(function () {
    setTime({ code: code })
    info = setTimetArr[setTimeIndex] + '次'
    console.log('测试同步时间:' + info)
    setTimeIndex++
    setTimes(code)
  }, timeout)
}

// 播放内容
let setFlanShArr = [1, 2, 3, 4, 5, 6, 7, 8]
let setFlanShIndex = 0
let obj = { content: 1, num: 2, volume: 1, voice: 1, code: null }
function setFlanShs (code) {
  if (stop) {
    return
  }
  if (setFlanShIndex === setFlanShArr.length) {
    setOffTimes(code)
    setFlanShIndex = 0
    return
  }
  setTimeout(function () {
    obj.code = code
    obj.content = setFlanShArr[setFlanShIndex]
    obj.num = parseInt(Math.random() * 10)
    obj.volume = setFlanShArr[setFlanShIndex] >= 5 ? 0 : 1
    obj.voice = setFlanShArr[setFlanShIndex] >= 5 ? 0 : 1
    setFlanSh(obj)
    info = setFlanShArr[setFlanShIndex] + '次'
    console.log('播放方案:' + `${optionsContent[setFlanShArr[setFlanShIndex]]}|${optionsvolume[obj.volume]}|${optionsvoice[obj.voice]}|播放次数:${obj.num}`)
    setFlanShIndex++
    setFlanShs(code)
  }, timeout)
}

// 设置开机时间
function setOffTimes (code) {
  let on = new Date(new Date().getTime() - 2 * 3600 * 1000)
  let off = new Date(new Date())
  if (stop) {
    return
  }
  setTimeout(function () {
    setOnOrOffTime({ on: timestampToTime(on, 'hh:mm:ss'), off: timestampToTime(off, 'hh:mm:ss'), code: code })
    console.log('测试开关机时间:关')
    setOnTimes(code)
  }, timeout)
}
let optionsContent = {
  1: '前方出口',
  2: '冰雪天气，减速慢行',
  3: '前方大雾，减速慢行',
  4: '前方分流，靠右行驶',
  5: '前方事故，谨慎慢行',
  6: '前方拥堵，减速慢行',
  7: '雨天路滑，谨慎驾驶',
  8: '前方出口，提前变道'
}
let optionsvolume = {
  0: '音量:大',
  1: '音量:中'
}
let optionsvoice = {
  0: '声音:男',
  1: '声音: 女'
}
