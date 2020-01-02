/**
 * websocket地址: process.env.WS_API
 */
import { getToken } from '@/utils/auth'
import { MessageBox } from 'element-ui'
import router from '../router/index'
import store from '../store/index'
export default class WebSocketWrapper {
  constructor (_options) {
  // 构造方法
    this._options = _options || {}
    this.timeout = 1000 * 60
    this.reconnectionTime = 4000
    this.closed = true
    this.timeoutObj = null
    this.lockReconnect = true
    this.reconnect = 0
    this.timeOut = null
    this.websock = null
    this.sid_ = this._options.sid ? this._options.sid_ : null
    this.proxy = this._options.proxy ? this._options.proxy : `ws://192.168.2.172:5661`
    this.onopen_ = this._options.onopen ? this._options.onopen : this.websocketonopen
    this.onerror_ = this._options.onerror ? this._options.onerror : this.websocketonerror
    this.onmessage_ = this._options.onmessage ? this._options.onmessage : this.websocketonmessage
    this.onclose_ = this._options.onclose ? this._options.onclose : this.websocketclose
    let that = this
    this.init(that)
  }

  // 新建websocket
  init (that) {
    if (typeof (WebSocket) === 'undefined') {
      alert('您的浏览器不支持socket')
    } else {
      that.websock = new WebSocket(`${this.proxy}/?token=${getToken()}`)
      that.websock.onopen = this.onopen_.bind(that)
      that.websock.onerror = this.onerror_.bind(that)
      that.websock.onmessage = this.websocketonmessage.bind(that)
      that.websock.onclose = this.onclose_.bind(that)
    }
  }

  // 获取websocketsid
  getSid () {
    return this.sid_
  }

  // 获取消息
  websocketonmessage (agentData) {
    if (this._options.onmessage) {
      this.onmessage_(agentData)
    }
  }

  // 连接成功
  websocketonopen () {
    console.log('websocket连接成功')
    this.closed = false
    this.websocketHeartbeat()
    // 心跳检测
  }

  // websocket连接发生错误
  websocketonerror (e) {
    console.log('websocket连接发生错误')
    this.lockReconnect = false
    this.websocketReconnection()
  }

  // websocket连接关闭
  websocketclose (e) {
    console.log('websocket连接关闭')
    this.closed = true
  }

  // websocket发送消息
  websocketsend (data) {
    console.log('websocket发送消息')
  }

  // websocket重新连接
  websocketReconnection () {
    console.log('websocket重连中...')
    let that = this
    if (that.lockReconnect) {
      this.reconnect = 0
      return
    }
    if (that.Authentication()) {
      return
    }
    if (this.reconnect >= 10) {
      this.lockReconnect = true
      this.reconnect = 0
      MessageBox({ type: 'warning', message: '推送消息重连失败，导致部分功能不可用，请及时联系管理员' })
      return
    }
    this.reconnect++
    that.lockReconnect = true
    // 没连接上会一直重连，设置延迟避免请求过多
    that.timeOut && clearTimeout(that.timeOut)
    that.timeOut = setTimeout(function () {
      that.init(that)
    }, this.reconnectionTime)
  }

  // websocket心跳
  websocketHeartbeat (e) {
    console.log('websocket心跳')
    let that = this
    // 判断是否属于关闭状态
    if (that.closed) {
      return
    }
    that.timeoutObj && clearTimeout(that.timeoutObj)
    that.timeoutObj = setTimeout(function () {
      // 这里发送一个心跳，后端收到后，返回一个心跳消息，
      if (that.Authentication()) {
        return
      }
      let obj = {
        'versionNumber': '1.0', // 协议版本号
        'module': 'heart', // 命令号
        'token': getToken(), // 携带token
        'data': null// 携带数据
      }
      obj = JSON.stringify(obj)
      try {
        that.websock.send(obj)
      } catch (err) {
        console.log(err)
      }
      that.websocketHeartbeat(e)
    }, that.timeout)
  }

  Authentication () {
    if (getToken()) return false
    MessageBox.confirm('消息推送建立失败，缺少认证信息，是否重新登录获取？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        store.dispatch('Logout')
        router.push('/login')
        this.lockReconnect = false
        return true
      })
      .catch(() => {})
  }
}
