import { updateLead, manualAuto } from '@/api/lamp/lampInfo'
let stop = false
let info = ''
let timeout = 2000
/**
 * @param {Array} codes测试codelist
 */
export function startTest (codes) {
  stop = false
  for (let i = 0; i < codes.length; i++) {
    // model
    setTimeout(function () {
      modelClosure(codes[i])
    }, 500)
  }
}
export function stopTest () {
  stop = true
}
function modelClosure (code) {
  let modelArr = [0, 1, 0]
  let modelIndex = 0
  function model (code) {
    if (stop) {
      return
    }
    if (modelIndex === modelArr.length) {
      atNightClosure(code)
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
  model(code)
}

// atNight
function atNightClosure (code) {
  let atNightArr = [1, 0, 1]
  let atNighIndex = 0
  let obj = {
    code: null,
    brightness: 1,
    frequency: 1,
    atNight: 0,
    wake: 0,
    voice: 0
  }
  function atNight (code) {
    if (stop) {
      return
    }
    if (atNighIndex === atNightArr.length) {
      voiceClosure(code)
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
  atNight(code)
}
// voice
function voiceClosure (code) {
  let voiceArr = [1, 0, 1]
  let voiceIndex = 0
  let obj = {
    code: null,
    brightness: 1,
    frequency: 1,
    atNight: 0,
    wake: 0,
    voice: 0
  }
  function voice (code) {
    if (stop) {
      return
    }
    if (voiceIndex === voiceArr.length) {
      wakeClosure(code)
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
  voice(code)
}

// wake
function wakeClosure (code) {
  let wakeArr = [1, 0, 1]
  let wakeIndex = 0
  let obj = {
    code: null,
    brightness: 1,
    frequency: 1,
    atNight: 0,
    wake: 0,
    voice: 0
  }
  function wake (code) {
    if (stop) {
      return
    }
    if (wakeIndex === wakeArr.length) {
      brightnessClosure(code)
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
  wake(code)
}

// brightness
function brightnessClosure (code) {
  let brightnessArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  let brightnessIndex = 0
  let obj = {
    code: null,
    brightness: 1,
    frequency: 1,
    atNight: 0,
    wake: 0,
    voice: 0
  }
  function brightness (code) {
    if (stop) {
      return
    }
    if (brightnessIndex === brightnessArr.length) {
      frequencyClosure(code)
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
  brightness(code)
}

// frequency
function frequencyClosure (code) {
  let frequencyArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  let frequencyIndex = 0
  let obj = {
    code: null,
    brightness: 1,
    frequency: 1,
    atNight: 0,
    wake: 0,
    voice: 0
  }

  function frequency (code) {
    if (stop) {
      return
    }
    if (frequencyIndex === frequencyArr.length) {
      modelClosure(code)
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
  frequency(code)
}
