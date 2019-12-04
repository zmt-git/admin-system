/**
 * @description 系统全局配置
 */
export default {
  /**
   * @description 记住密码状态下的token在Cookie中存储的天数，默认1天
   */
  tokenCookieExpires: 1,
  /**
   * @description 记住密码状态下的密码在Cookie中存储的天数，默认1天
   */
  passCookieExpires: 1,
  /**
   * @description 此处修改网站名称
   */
  webName: 'itms',
  /**
   * @description token key请求token
   */
  TokenKey: 'ADMIN-TOEKN',
  /**
   * @description 告警声音
   */
  VoiceKey: 'ADMIN-VOICE',
  /**
   * @description 告警弹框
   */
  AlarmKey: 'ADMIN-ALARM',
  /**
   * @description 请求超时时间，毫秒（默认2分钟）
   */
  timeout: 1200000
}
