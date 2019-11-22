import { Message } from 'element-ui'
export default class CanvasRender {
  constructor (_options) {
    // 构造方法
    this.el = _options.el ? _options.el : null
    this._id = _options.id
    this.canvasDom = null
    this.init()
  }
  init () {
    var canvas = document.getElementById(this._id)
    if (canvas.getContext) {
      let ctx = canvas.getContext('2d')
      this.canvas = ctx
      // drawing code here
    } else {
      Message({
        type: 'warning',
        message: '您的浏览器不支持canvas，请升级浏览器或跟换浏览器！'
      })
    }
  }
}
export function initCanvas (options) {
  let str = new CanvasRender(options)
  return str
}
