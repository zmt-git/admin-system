/**
 * @fmt:时间格式（yyyy-MM-dd hh:mm:ss）
 * type：(yyyy-MM-dd, hh:mm:ss, hh:mm, yyyy-MM-dd hh:mm:ss）可选值，默认值为yyyy-MM-dd hh:mm:ss
 */
export function formatTime (fmt, type, time) {
  let date = new Date()
  if (time === undefined) {
    date = new Date()
  } else if (time === null) {
    return null
  } else {
    date = new Date(time)
  }
  if (type === undefined || type === null) {
    type = 'yyyy-MM-dd hh:mm:ss'
  }
  var first
  var o = {
    'M+': date.getMonth() + 1, // 月
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分钟
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒数
  }
  // 年可以不区分大小写
  if (/(y+)/ig.test(fmt)) {
    first = RegExp.$1
    // 以年份替换格式符
    fmt = fmt.replace(first, (date.getFullYear() + '').substr(4 - first.length))
    for (var key in o) {
      if (new RegExp('(' + key + ')').test(fmt)) {
        first = RegExp.$1
        fmt = fmt.replace(first, ('0' + o[key]).substr(('' + o[key]).length - 1))
      }
    }
  }
  if (o['m+'] < 10) {
    o['m+'] = '0' + o['m+']
  }
  switch (type) {
    case 'hh:mm' : return `${o['h+']}:${o['m+']}`
    case 'yyyy-MM-dd hh:mm:ss' : return fmt
    case 'yyyy-MM-dd' : return fmt.split(' ')[0]
    case 'hh:mm:ss' : return `${o['h+']}:${o['m+']}:${o['s+']}`
    default : return fmt
  }
}
/**
 * @相差时间
 */
export function continueTime (startDate, endDate) {
  let startTime = new Date(startDate)
  let endTime = new Date(endDate)
  let continueTimes = endTime.getTime() - startTime.getTime()
  let days = Math.floor(continueTimes / (24 * 3600 * 1000))
  let leave1 = continueTimes % (24 * 3600 * 1000)
  let hours = Math.floor(leave1 / (3600 * 1000))
  let leave2 = leave1 % (3600 * 1000)
  let minutes = Math.floor(leave2 / (60 * 1000))
  let leave3 = leave1 % (60 * 1000)
  let seconds = Math.floor(leave3 / 1000)
  let time
  if (days) {
    time = days + '天' + hours + '时' + minutes + '分' + seconds + '秒'
  } else {
    time = hours + '时' + minutes + '分' + seconds + '秒'
  }
  return time
}
/**
 * @判断是否为JSONstring
 */
export function isJSON (str) {
  if (typeof str === 'string') {
    try {
      let obj = JSON.parse(str)
      if (typeof obj === 'object' && obj) {
        return true
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  }
}
/**
 *
 *
 * @param {*} timestamps 时间戳
 * @returns yyy-MM-dd mm:HH:ss
 */
export function timestampToTime (timestamp, type) {
  if (!timestamp) {
    return ''
  }
  if (timestamp.length === 10) {
    timestamp = timestamp * 1000
  }
  var date = new Date(timestamp) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + '-'
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' '
  let h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':'
  let m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':'
  let s = date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds()
  if (type === undefined) {
    return Y + M + D + h + m + s
  } else if (type === 'hh:mm') {
    m = m.slice(0, -1)
    return h + m
  } else if (type === 'hh:mm:ss') {
    return h + m + s
  } else {
    return Y + M + D + h + m + s
  }
}
/**
 *
 *
 * @param {*} timestamps 时间戳
 * @returns yyy-MM-dd mm:HH:ss
 */
export function timeTotimestamp (time, type) {
  let timestamp = new Date(time).getTime()
  return timestamp
}
