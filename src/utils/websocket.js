/**
 * websocket地址: process.env.WS_API
 */
export default class WebSocketWrapper {
  constructor (_options) {
  // 构造方法
    if (!_options || !_options.sid) return null
    this.timeout = 3000
    this.timeoutObj = null
    this.serverTimeoutObj = null
    this.lockReconnect = true
    this.timeOut = null
    this.websock = null
    this.sid_ = _options.sid
    this.onopen_ = _options.onopen ? _options.onopen : this.websocketonopen
    this.onerror_ = _options.onerror ? _options.onerror : this.websocketonerror
    this.onmessage_ = _options.onmessage
    this.onclose_ = _options.onclose ? _options.onclose : this.websocketclose
    this.send_ = _options.send ? _options.send : this.websocketsend
    let that = this
    this.init(that)
  }

  // 新建websocket
  init (that) {
    that.websock = new WebSocket(window.VUE_URLS.VUE_APP_WS_API + this.sid_)
    that.websock.onopen = this.onopen_.bind(that)
    that.websock.onerror = this.onerror_.bind(that)
    that.websock.onmessage = this.websocketonmessage.bind(that)
    that.websock.onclose = this.onclose_.bind(that)
    that.websock.onclose = this.onclose_.bind(that)
  }

  // 获取websocketsid
  getSid () {
    return this.sid_
  }

  // 获取消息
  websocketonmessage (agentData) {
    if (this.onmessage_) {
      this.onmessage_(agentData)
    }
  }

  // 连接成功
  websocketonopen () {
    console.log('websocket连接成功')
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
  }

  // websocket发送消息
  websocketsend (e) {
    console.log('websocket连接关闭')
  }

  // websocket重新连接
  websocketReconnection (e) {
    console.log('websocket重连中')
    let that = this
    if (this.lockReconnect) {
      return
    }
    this.lockReconnect = true
    // 没连接上会一直重连，设置延迟避免请求过多
    this.timeOut && clearTimeout(this.timeOut)
    this.timeOut = setTimeout(function () {
      that.init(window.VUE_URLS.VUE_APP_WS_API + this.sid_)
      this.lockReconnect = false
    }, 4000)
  }

  // websocket心跳
  websocketHeartbeat (e) {
    console.log('websocket心跳')
    console.log('start')
    var self = this
    this.timeoutObj && clearTimeout(this.timeoutObj)
    this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj)
    this.timeoutObj = setTimeout(function () {
    // 这里发送一个心跳，后端收到后，返回一个心跳消息，
      console.log('55555')
      this.websock.send('123456789')
      self.serverTimeoutObj = setTimeout(function () {
        console.log(111)
        console.log(this.websock)
        this.websock.close()
      // createWebSocket();
      }, self.timeout)
    }, this.timeout)
  }
}
