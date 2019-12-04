import Cookies from 'js-cookie'
import Config from '@/config'

const TokenKey = Config.TokenKey
const VoiceKey = Config.VoiceKey
const AlarmKey = Config.AlarmKey

export function getToken (key) {
  if (key === undefined) {
    return Cookies.get(TokenKey)
  }
}

export function setToken (token, rememberMe) {
  if (rememberMe) {
    return Cookies.set(TokenKey, token, { expires: Config.tokenCookieExpires })
  } else {
    return Cookies.set(TokenKey, token)
  }
}

export function setAlarm (alarm) {
  Cookies.set(AlarmKey, alarm)
}

export function setVoice (alarm) {
  Cookies.set(VoiceKey, alarm)
}
export function getAlarm (alarm) {
  return Cookies.get(AlarmKey)
}

export function getVoice (alarm) {
  return Cookies.get(VoiceKey)
}

export function removeToken () {
  Cookies.remove(TokenKey)
}
export function removeAlarm () {
  Cookies.remove(AlarmKey)
}
export function removeVoice () {
  Cookies.remove(VoiceKey)
}
