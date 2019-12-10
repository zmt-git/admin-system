import { updateLead, manualAuto } from '@/api/lamp/lampInfo'
let obj = {
  code: null,
  brightness: 1,
  frequency: 1,
  atNight: 0,
  wake: 0,
  voice: 0
}
let stop = false
let info = ''
let timeout = 1000 * 2 * 60
/**
 * @param {Array} codes测试codelist
 */
export function startTest (codes) {
  stop = false
  for (let i = 0; i < codes.length; i++) {
    // model
    model(codes[i])
  }
}
export function stopTest () {
  stop = true
}
let modelArr = [0, 1, 0]
let modelIndex = 0
function model (code) {
  if (stop) {
    return
  }
  if (modelIndex === modelArr.length) {
    atNight(code)
    modelIndex = 0
    return
  }
  setTimeout(function () {
    manualAuto({ code: code, model: modelArr[modelIndex] })
    modelArr[modelIndex] === 0 ? info = '手动' : info = '自动'
    console.log('测试控制模式:' + info)
    modelIndex++
    model(code)
  }, timeout)
}
// atNight
let atNightArr = [1, 0, 1]
let atNighIndex = 0
function atNight (code) {
  if (stop) {
    return
  }
  if (atNighIndex === atNightArr.length) {
    voice(code)
    atNighIndex = 0
    return
  }
  setTimeout(function () {
    obj.code = code
    obj.atNight = atNightArr[atNighIndex]
    updateLead(obj)
    atNightArr[atNighIndex] === 0 ? info = '关闭' : info = '开启'
    console.log('测试夜间状态:' + info)
    atNighIndex++
    atNight(code)
  }, timeout)
}
// voice
let voiceArr = [1, 0, 1]
let voiceIndex = 0
function voice (code) {
  if (stop) {
    return
  }
  if (voiceIndex === voiceArr.length) {
    wake(code)
    voiceIndex = 0
    return
  }
  setTimeout(function () {
    obj.code = code
    obj.voice = voiceArr[voiceIndex]
    updateLead(obj)
    voiceArr[voiceIndex] === 0 ? info = '关闭' : info = '开启'
    console.log('测试声音:' + info)
    voiceIndex++
    voice(code)
  }, timeout)
}
// wake
let wakeArr = [1, 0, 1]
let wakeIndex = 0
function wake (code) {
  if (stop) {
    return
  }
  if (wakeIndex === wakeArr.length) {
    brightness(code)
    wakeIndex = 0
    return
  }
  setTimeout(function () {
    obj.code = code
    obj.wake = wakeArr[wakeIndex]
    updateLead(obj)
    wakeArr[wakeIndex] === 0 ? info = '关闭' : info = '开启'
    console.log('测试尾迹:' + info)
    wakeIndex++
    wake(code)
  }, timeout)
}
// brightness
let brightnessArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
let brightnessIndex = 0
function brightness (code) {
  if (stop) {
    return
  }
  if (brightnessIndex === brightnessArr.length) {
    frequency(code)
    brightnessIndex = 0
    return
  }
  setTimeout(function () {
    obj.code = code
    obj.brightness = brightnessArr[brightnessIndex]
    updateLead(obj)
    info = (11 - brightnessArr[brightnessIndex]) * 10 + '%'
    console.log('测试亮度:' + info)
    brightnessIndex++
    brightness(code)
  }, timeout)
}
// frequency
let frequencyArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
let frequencyIndex = 0

function frequency (code) {
  if (stop) {
    return
  }
  if (frequencyIndex === frequencyArr.length) {
    model(code)
    frequencyIndex = 0
    return
  }
  setTimeout(function () {
    obj.code = code
    obj.frequency = frequencyArr[frequencyIndex]
    updateLead(obj)
    info = frequencyArr[frequencyIndex] * 10 + '%'
    console.log('测试频率:' + info)
    frequencyIndex++
    frequency(code)
  }, timeout)
}
