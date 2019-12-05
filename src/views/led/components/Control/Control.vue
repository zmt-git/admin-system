<template>
  <div class="control">
    <el-dialog
      title="激光灯控制"
      :visible.sync="dialogVisible"
      :close-on-click-modal='false'
      @open='open'
      @close='close'
      width="610px">
      <div class="statusBox">
        <i class="iconfont icon-zhuangtai1 iconStyle" :class='deviceType[status].iconClass'></i>
        <span class="fontStyle" :class='deviceType[status].textClass'>{{deviceType[status].title}}</span>
      </div>
      <ul class="lampBox">
        <!-- 开关灯时间 开始 -->
        <li class="lamp">
          <div class="half">
            <span class="title">开灯时间</span>
            <el-time-picker
              style="width:170px"
              size="small"
              format="HH:mm"
              value-format="HH:mm"
              v-model="lampOn"
              @change="changeOn"
              placeholder="开灯时间">
              </el-time-picker>
          </div>
          <div class="half">
            <span class="title">关灯时间</span>
            <el-time-picker
              style="width:170px"
              size="small"
              format="HH:mm"
              value-format="HH:mm"
              v-model="lampOff"
              @change="changeOff"
              placeholder="关灯时间">
            </el-time-picker>
          </div>
          <el-button type="primary" plain size="mini" style="width: 80px;height: 32px;" @click="setTime()">设置</el-button>
        </li>
        <!-- 开关灯时间 结束 -->

        <li class="lamp lampBG">
          <!-- 亮度调节 -->
          <div class="half">
            <span class="title">亮度调节</span>
            <el-select v-model="brightness" @change="changeBrigh" size="small" style="width:170px;" placeholder="请选择">
              <el-option
                v-for="item in brightVal"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="half">
            <span class="title">同步时间</span>
            <el-button type="primary" plain size="mini" style="width: 110px;height: 32px;" @click="syncTime()">同步</el-button>
          </div>
           <!-- 调试按钮 开始 -->
              <el-button :type="debugType" class="debugging" v-hasBtn plain size="small" @click="debugging">{{debugTitle}}</el-button>
            <!-- 调试按钮 开始 -->
        </li>
        <li class="lamp">
           <!-- 闪烁方式 -->
          <div class="half">
            <span class="title">闪烁方式</span>
            <el-select v-model="scintillaMode" :disabled='disMode' @change="changeMode" size="small" style="width:170px;" placeholder="请选择">
              <el-option
                v-for="item in optionMode"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="half">
            <span class="title">闪烁控制</span>
            <el-radio-group v-model="radioTwinkle" size="small" @change="changeLed">
              <el-radio-button :label="1">常亮</el-radio-button>
              <el-radio-button :label="0">闪烁</el-radio-button>
            </el-radio-group>
          </div>
        </li>

         <li class="lamp lampBG">
          <!-- 风扇开关 -->
          <div class="half">
            <span class="title">风扇开关</span>
            <el-switch
              style="display: inline-block;margin-bottom: 5px;"
              v-model="fanVal"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value='1'
              :inactive-value='0'
              @change="changeFan"
              active-text="开"
              inactive-text="关">
            </el-switch>
          </div>
          <!-- 风扇自动/手动 -->
          <div class="half">
            <span class="title">风扇模式</span>
            <el-radio-group v-model="radio1" size="small" @change="changeAuto">
              <el-radio-button :disabled='this.radio' :label="0">自动</el-radio-button>
              <el-radio-button :disabled='this.radio' :label="1">手动</el-radio-button>
            </el-radio-group>
          </div>
        </li>
        <li class="lamp">
          <!-- 风扇调速 -->
          <span class="title">风扇转速</span>
          <div class="mySlider">
            <el-slider v-model="fanNumber" :disabled='this.disabled' @change="changeFanNumber"></el-slider>
          </div>
          <span class="fanNumberClass">{{`${fanNumber}%`}}</span>
        </li>
        <li v-show='debugShow' class="controlitem debugBox">调试</li>
      </ul>
  </el-dialog>
  </div>
</template>
<script>
import { setTime, setFan, autoFan, setLaser, setFlanSh, setOnOrOffTime, getLaserStatus } from '@/api/led/controller'
import eventBus from '@/utils/eventBus'
export default {
  name: 'LedControl',
  props: {
    code: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      debugType: 'primary',
      debugTitle: '调试',
      debugShow: false,
      mainControlStatus: {}, // 存储当前状态
      lampOn: null,
      lampOff: null,
      onTime: null, // 开灯时间
      offTime: null, // 关灯时间
      fanVal: false, // 风扇开关
      onOrOff: '', // 风扇开关状态
      speed: '', // 风扇转速
      radio1: null, // 风扇调速
      radioTwinkle: null, // 闪烁常亮
      autoFly: '', // 风扇自动/手动

      disabled: false, // 控制调速是否可用
      disMode: false, // 控制闪烁按钮是否可用
      radio: false, // 单选按钮
      fanNumber: null, // 风扇速率
      brightness: null, /// 激光灯亮度绑定值
      scintillaMode: null, // 闪烁方式绑定值
      ledNum: null, // 激光灯亮度值
      twinkleNum: null, // 闪烁方式1-10
      userName: [],
      dialogVisible: false, // 激光灯控制弹出框
      brightVal: [
        {
          value: 0,
          label: '0%'
        }, {
          value: 10,
          label: '10%'
        }, {
          value: 20,
          label: '20%'
        }, {
          value: 30,
          label: '30%'
        }, {
          value: 40,
          label: '40%'
        }, {
          value: 50,
          label: '50%'
        }, {
          value: 60,
          label: '60%'
        }, {
          value: 70,
          label: '70%'
        }, {
          value: 80,
          label: '80%'
        }, {
          value: 90,
          label: '90%'
        }, {
          value: 100,
          label: '100%'
        }],
      optionMode: [
        {
          value: 1,
          label: '闪烁方式一'
        }, {
          value: 2,
          label: '闪烁方式二'
        }, {
          value: 3,
          label: '闪烁方式三'
        }, {
          value: 4,
          label: '闪烁方式四'
        }, {
          value: 5,
          label: '闪烁方式五'
        }, {
          value: 6,
          label: '闪烁方式六'
        }, {
          value: 7,
          label: '闪烁方式七'
        }, {
          value: 8,
          label: '闪烁方式八'
        }, {
          value: 9,
          label: '闪烁方式九'
        }, {
          value: 10,
          label: '闪烁方式十'
        }
      ],
      status: 1,
      deviceType: {
        0: { value: 0, title: '设备正常', iconClass: 'iconsuccess', textClass: 'success' },
        1: { value: 0, title: '设备离线', iconClass: 'icondanger', textClass: 'danger' },
        2: { value: 0, title: '设备告警', iconClass: 'iconwarning', textClass: 'warning' },
        3: { value: 0, title: '设备升级', iconClass: 'iconinfo', textClass: 'info' }
      },
      debugMsg: null
    }
  },
  methods: {
    // 显示弹框
    show () {
      this.dialogVisible = true
    },

    // 弹框打开回调 获取状态
    open () {
      eventBus.$emit('ws_connection', this.code, module.START)
      eventBus.$on('updataledStatus', (data) => {
        this.mainControlStatus = data
        this.foramtBtn()
      })
      eventBus.$on('WS_debugging', (data) => {
        this.debugMsg = data
      })
      this.getStatus()
    },

    // 弹框关闭回调
    close () {
      eventBus.$emit('ws_close', this.code, module.END)
      this.debugType = 'primary'
      this.debugShow = false
      this.debugTitle = '调试'
      eventBus.$emit('ws_close', this.code, module.DEBUG)
    },

    // 调试 TODO
    debugging () {
      this.debugShow = !this.debugShow
      if (this.debugShow) {
        this.debugType = 'danger'
        this.debugTitle = '暂停调试'
        eventBus.$emit('ws_connection', this.code, module.DEBUG)
      } else {
        this.debugType = 'primary'
        this.debugTitle = '调试'
        eventBus.$emit('ws_close', this.code, module.DEBUG)
      }
    },

    // 获取当前状态
    getStatus () {
      getLaserStatus({ code: this.code })
        .then((res) => {
          this.mainControlStatus = res.result.mainControlStatus
          this.foramtBtn()
        })
        .catch((err) => {
          console.log(err)
          this.$message({
            message: '获取主控状态失败',
            type: 'error'
          })
        })
    },

    // 更新按钮
    foramtBtn () {
      this.lampOn = this.mainControlStatus.onTime // 开灯时间
      this.lampOff = this.mainControlStatus.offTime // 关灯时间
      this.brightness = this.mainControlStatus.brightness // 激光灯亮度
      this.fanVal = this.mainControlStatus.fanStatus // 风扇开关
      this.radio1 = this.mainControlStatus.fanAuto // 风扇模式
      this.fanNumber = this.mainControlStatus.fanSpeed // 风扇转速
      this.scintillaMode = this.mainControlStatus.flickerMode // 闪烁
      this.radioTwinkle = this.mainControlStatus.flicker // 闪烁控制
      this.status = this.mainControlStatus.status // 状态
      if (this.mainControlStatus.status === 0) {
        this.isConnect = '设备在线'
      } else {
        this.isConnect = '设备离线'
      }
    },

    // 开关灯设置
    changeOn (data) {
      this.onTime = data
    },

    changeOff (data) {
      this.offTime = data
    },

    // 时间设置
    setTime () {
      setOnOrOffTime({ code: this.code, on: this.onTime, off: this.offTime })
        .then((res) => {
          this.tip('时间设置成功', 'success')
        })
        .catch((err) => {
          this.tip('时间设置失败', 'error')
          console.log(err)
        })
    },

    // 同步时间
    syncTime () {
      setTime({ code: this.code })
        .then((res) => {
          this.tip('时间同步成功', 'success')
        })
        .catch((err) => {
          this.tip('时间同步失败', 'error')
          console.log(err)
        })
    },

    // 控制风扇
    changeFan (data) {
      if (data) {
        this.onOrOff = 1 // 打开
        this.radio = false
        this.disabled = false
        this.fanVal = true
      } else {
        this.onOrOff = 0
        this.radio = true
        this.disabled = true
        this.fanVal = false
      }
      setFan({ code: this.code, onOrOff: this.onOrOff, speed: 0 })
        .then((res) => {
          this.tip('风扇设置开关成功', 'success')
        })
        .catch((err) => {
          this.tip('风扇设置开关失败', 'error')
          console.log(err)
        })
    },

    // 风扇自动手动
    changeAuto (data) {
      if (data === '0') {
        this.autoFly = 1
        this.disabled = true
      } else {
        this.autoFly = 0
        this.disabled = false
      }
      // 自动
      autoFan({ code: this.code, onOrOff: this.autoFly })
        .then((res) => {
          this.tip('风扇控制模式设置成功', 'success')
        })
        .catch((err) => {
          this.tip('风扇控制模式设置失败', 'error')
          console.log(err)
        })
    },

    // 风扇调速方法
    changeFanNumber () {
      setFan({ code: this.code, onOrOff: 1, speed: this.fanNumber })
        .then((res) => {
          this.tip('风扇转速设置成功', 'success')
        })
        .catch((err) => {
          this.tip('风扇转速设置失败', 'error')
          console.log(err)
        })
    },

    // 激光灯亮度调节
    changeBrigh (data) {
      this.ledNum = data
      setLaser({ code: this.code, laser: this.ledNum })
        .then((res) => {
          this.tip('亮度设置成功', 'success')
        })
        .catch((err) => {
          this.tip('亮度设置失败', 'error')
          console.log(err)
        })
    },

    // 设置激光灯闪烁或者常亮
    changeLed (data) {
      if (data === '1') {
        this.disMode = true
      } else {
        this.disMode = false
      }
      setFlanSh({ code: this.code, onOrOff: 0, totalise: 1 })
        .then((res) => {
          this.tip('常亮设置成功', 'success')
        })
        .catch((err) => {
          console.log(err)
          this.tip('常亮设置失败', 'error')
        })
    },

    // 控制模式
    changeMode (data) {
      this.twinkleNum = data
      setFlanSh({ code: this.code, onOrOff: 1, totalise: this.twinkleNum })
        .then((res) => {
          this.tip('闪烁方案设置成功', 'success')
        })
        .catch((err) => {
          console.log(err)
          this.tip('闪烁方案设置失败', 'error')
        })
    },

    tip (message, type) {
      this.$message({
        type: type,
        message: message
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.lampBox {
  width: 100%;
  overflow: hidden;
}
.lamp {
  width: 100%;
  height: 60px;
  line-height: 60px;
  margin-right: 10px;
  /* padding: 30px 0; */
}
.lampBG{
  background: #eeeeee;
}
.lamp:last-child {
  margin-right: 0;
}
.half {
  display: inline-block;
  width: 43%;
  box-sizing: border-box;
}
.half2 {
  display: inline-block;
  width: 50%;
  box-sizing: border-box;
}
.fanBox {
  float: left;
}
.fanBox:last-child{
  float: right;
  margin-right: 10px;
}
.rate {
  display: inline-block;
  width: 200px;
  position: relative;
  bottom: 12px;
  left: 10px;
}
.brightness{
  float: left;
}
.brightness:last-child{
  margin-left: 30px;
}
.nessLeft{
  float: left;
}
.ness{
  float: left;
}
.title{
  width: 80px;
  text-align: center;
  float: left;
}
.mySlider{
  width: 410px;
  padding-top:12px;
  float: left;
}
.fanNumberClass{
  margin-left: 5px;
}
.debugBox{
  background: #000000;
  color: #fff;
  font-size: 12px;
  padding: 0 10px;
  overflow: auto;
}
</style>
