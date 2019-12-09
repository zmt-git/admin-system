<template>
  <div class="control">
    <el-dialog
      :title="'激光灯控制' + '（' + code + '）'"
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
            <el-radio-group v-model="radioTwinkle" size="small" @change="changeLed(radioTwinkle)">
              <el-radio-button :label="0">常亮</el-radio-button>
              <el-radio-button :label="1">闪烁</el-radio-button>
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
              @change="changeFan(fanVal)"
              active-text="开"
              inactive-text="关">
            </el-switch>
          </div>
          <!-- 风扇自动/手动 -->
          <div class="half">
            <span class="title">风扇模式</span>
            <el-radio-group v-model="radio1" :disabled='radio' size="small" @change="changeAuto(radio1)">
              <el-radio-button :label="1">自动</el-radio-button>
              <el-radio-button :label="0">手动</el-radio-button>
            </el-radio-group>
          </div>
        </li>
        <li class="lamp">
          <!-- 风扇调速 -->
          <span class="title">风扇转速</span>
          <div class="mySlider">
            <el-slider v-model="fanNumber" :disabled='disabled' @change="changeFanNumber"></el-slider>
          </div>
          <span class="fanNumberClass">{{`${fanNumber}%`}}</span>
        </li>
        <li style="width:100%;">
          <EleTable
            :list='listState'
            :columns='columnsState'
            :options='optionsState'
          ></EleTable>
        </li>
        <li v-show='debugShow' class="controlitem debugBox">
          <p :key="index" v-for="(item, index) in debugList">{{item}}</p>
        </li>
      </ul>
      <div class="mask" v-show="loading">
        <i style="font-size: 30px;color: #fff;" class="el-icon-loading"></i>
      </div>
  </el-dialog>
  </div>
</template>
<script>
import { setTime, setFan, autoFan, setLaser, setFlanSh, setOnOrOffTime, getLaserStatus } from '@/api/led/controller'
// 组件
import EleTable from '@/components/EleTable/table'
// 混入
import tabelData from '@/mixins/tabelData'
// import eventBus from '@/utils/eventBus'
import eventBus, { emitType } from '@/utils/eventBus'
import wsModule, { sendType } from '@/config/ws_module'
export default {
  name: 'LedControl',
  components: {
    EleTable
  },
  mixins: [tabelData],
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
      debugList: [],
      mainControlStatus: {}, // 存储当前状态
      lampOn: null,
      lampOff: null,
      onTime: null, // 开灯时间
      offTime: null, // 关灯时间
      fanVal: 0, // 风扇开关
      onOrOff: '', // 风扇开关状态
      speed: '', // 风扇转速
      radio1: null, // 风扇调速
      radioTwinkle: null, // 闪烁常亮
      autoFly: '', // 风扇自动/手动
      loading: false,
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
      // innerVisible: false, // 内层弹出框
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
      // 激光灯状态表格
      listState: [], // 数据
      columnsState: [
        { prop: 'code', label: '灯组编号', align: 'center' },
        { prop: 'version', label: '版本号', align: 'center' },
        { prop: 'fanStatus', label: '风扇状态', align: 'center' },
        { prop: 'fanAuto', label: '风扇自动调速状态', align: 'center' },
        { prop: 'fanSpeed', label: '风扇转速', align: 'center' },
        { prop: 'flicker', label: '闪烁开关', align: 'center' },
        { prop: 'flickerMode', label: '闪烁方案', align: 'center' },
        { prop: 'cpuTemperature', label: 'CPU温度', align: 'center' }
      ],
      optionsState: {
        stripe: false, // 是否为斑马纹 table
        highlightCurrentRow: false, // 是否要高亮当前行
        loading: true, // 是否添加表格loading加载动画
        mutiSelect: false, // 是否支持列表项选中功能
        height: '20px',
        border: true,
        padding: '5px 0',
        hasPagination: false
      },
      tableLoading: ['options', 'optionsState']
    }
  },
  methods: {
    // 显示弹框
    show () {
      this.dialogVisible = true
    },

    // 弹框打开回调 获取状态
    open () {
      eventBus.$emit('ws_connection', { code: this.code, type: sendType.LEDMAIN }, wsModule.START)
      eventBus.$on(emitType.ledMain, (data) => {
        this.mainControlStatus = data
        this.foramtBtn()
      })
      eventBus.$on(emitType.debug, (data) => {
        this.debugList.unshift(data)
      })
      this.getStatus()
    },

    // 弹框关闭回调
    close () {
      eventBus.$emit('ws_close', { code: this.code, type: sendType.LEDMAIN }, wsModule.END)
      this.debugType = 'primary'
      this.debugShow = false
      this.debugList = []
      this.debugTitle = '调试'
      eventBus.$emit('ws_close', { code: this.code, type: sendType.DEBUG }, wsModule.END)
    },

    // 调试 TODO
    debugging () {
      this.debugShow = true
      if (this.debugTitle === '调试') {
        this.debugType = 'danger'
        this.debugTitle = '暂停调试'
        eventBus.$emit('ws_connection', { code: this.code, type: sendType.DEBUG }, wsModule.START)
      } else {
        this.debugType = 'primary'
        this.debugTitle = '调试'
        eventBus.$emit('ws_close', { code: this.code, type: sendType.DEBUG }, wsModule.END)
      }
    },

    // 获取当前状态
    async getStatus () {
      this.loading = true
      await getLaserStatus({ code: this.code })
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
      this.loading = false
    },

    // 更新按钮
    foramtBtn () {
      this.lampOn = this.mainControlStatus.onTime // 开灯时间
      this.lampOff = this.mainControlStatus.offTime // 关灯时间
      this.brightness = this.mainControlStatus.brightness // 激光灯亮度
      this.fanVal = this.mainControlStatus.fanStatus // 风扇开关
      if (this.fanVal === 0) {
        this.radio = true
        this.disabled = true
      } else {
        this.disabled = false
        this.radio = false
      }
      this.radio1 = this.mainControlStatus.fanAuto // 风扇模式
      if (this.radio1 === 1) {
        this.disabled = true
      } else {
        this.disabled = false
      }
      this.fanNumber = this.mainControlStatus.fanSpeed // 风扇转速
      this.scintillaMode = this.mainControlStatus.flickerMode // 闪烁
      this.radioTwinkle = this.mainControlStatus.flicker // 闪烁控制
      if (this.radioTwinkle === 1) {
        this.disMode = false
      } else {
        this.disMode = true
      }
      this.status = this.mainControlStatus.status // 状态
      if (this.mainControlStatus.status === 0) {
        this.isConnect = '设备在线'
      } else {
        this.isConnect = '设备离线'
      }
    },

    // 时间设置
    async setTime () {
      await setOnOrOffTime({ code: this.code, on: this.lampOn, off: this.lampOff })
        .then((res) => {
          this.tip('时间设置成功', 'success')
        })
        .catch((err) => {
          this.tip('时间设置失败', 'error')
          console.log(err)
        })
      this.getStatus()
    },

    // 同步时间
    async syncTime () {
      await setTime({ code: this.code })
        .then((res) => {
          this.tip('时间同步成功', 'success')
        })
        .catch((err) => {
          this.tip('时间同步失败', 'error')
          console.log(err)
        })
      this.getStatus()
    },

    // 控制风扇
    async changeFan (data) {
      if (data === 1) {
        this.onOrOff = 1 // 打开
        this.radio = false
        this.disabled = false
      } else {
        this.onOrOff = 0
        this.radio = true
        this.disabled = true
      }
      await setFan({ code: this.code, onOrOff: this.onOrOff, speed: 0 })
        .then((res) => {
          this.tip('风扇设置开关成功', 'success')
        })
        .catch((err) => {
          this.tip('风扇设置开关失败', 'error')
          console.log(err)
        })
      this.getStatus()
    },

    // 风扇自动手动
    async changeAuto (data) {
      if (data === 0) {
        this.autoFly = 0
        this.disabled = false
      } else {
        this.autoFly = 1
        this.disabled = true
      }
      // 自动
      await autoFan({ code: this.code, onOrOff: this.autoFly })
        .then((res) => {
          this.tip('风扇控制模式设置成功', 'success')
        })
        .catch((err) => {
          this.tip('风扇控制模式设置失败', 'error')
          console.log(err)
        })
      this.getStatus()
    },

    // 风扇调速方法
    async changeFanNumber () {
      await setFan({ code: this.code, onOrOff: 1, speed: this.fanNumber })
        .then((res) => {
          this.tip('风扇转速设置成功', 'success')
        })
        .catch((err) => {
          this.tip('风扇转速设置失败', 'error')
          console.log(err)
        })
      this.getStatus()
    },

    // 激光灯亮度调节
    async changeBrigh (data) {
      this.ledNum = data
      await setLaser({ code: this.code, laser: this.ledNum })
        .then((res) => {
          this.tip('亮度设置成功', 'success')
        })
        .catch((err) => {
          this.tip('亮度设置失败', 'error')
          console.log(err)
        })
      this.getStatus()
    },

    // 设置激光灯闪烁或者常亮
    async changeLed (data) {
      if (data === 1) {
        this.disMode = false
      } else {
        this.disMode = true
      }
      await setFlanSh({ code: this.code, onOrOff: this.radioTwinkle, totalise: 1 })
        .then((res) => {
          this.scintillaMode = 1
          this.tip('常亮设置成功', 'success')
        })
        .catch((err) => {
          console.log(err)
          this.tip('常亮设置失败', 'error')
        })
      this.getStatus()
    },

    // 控制模式
    async changeMode (data) {
      this.twinkleNum = data
      await setFlanSh({ code: this.code, onOrOff: 1, totalise: this.twinkleNum })
        .then((res) => {
          this.tip('闪烁方案设置成功', 'success')
        })
        .catch((err) => {
          console.log(err)
          this.tip('闪烁方案设置失败', 'error')
        })
      this.getStatus()
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
.mask{
  position: absolute;
  left: 0;
  bottom: 0;
  background: #000000;
  opacity: 0.3;
  width: 100%;
  height: calc(100% - 44px);
  z-index: 9999;
  line-height: 18;
  text-align: center;
}
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
</style>
