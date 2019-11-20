import Cookies from 'js-cookie'
import Config from '@/config'

const TokenKey = Config.TokenKey

export function getToken (key) {
  if (key === undefined) {
    return Cookies.get(TokenKey)
  }
}

export function setToken (token, rememberMe, type) {
  if (rememberMe) {
    return Cookies.set(TokenKey, token, { expires: Config.tokenCookieExpires })
  } else {
    return Cookies.set(TokenKey, token)
  }
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}
