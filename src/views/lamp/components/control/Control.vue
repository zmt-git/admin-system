<template>
  <div class="tableBox">

    <!-- 主控设备控制 开始 -->
     <el-dialog
        title="主控设备控制"
        :visible.sync="dialogVisible"
        width="610px"
        custom-class="myDialogbtn"
        :modal="true"
        :close-on-click-modal='false'
        :modal-append-to-body="true"
        @open="openDialog"
        @close="closeDialog">
        <!-- 控制表单 开始 -->
      <div class="statusBox">
        <i class="iconfont icon-zhuangtai1 iconStyle" :class='deviceType[status].iconClass'></i>
        <span class="fontStyle" :class='deviceType[status].textClass'>{{deviceType[status].title}}</span>
      </div>
        <ul class="controlList">
          <li class="controlitem">

            <!-- 声音 开始 -->
            <div class="controlele">
              <span class="contolItem">
                声音
              </span>
              <i class="iconfont icon icon-shengyinyinliangxianxing"></i>
              <el-switch
                class="controlInput"
                v-model="dataForm.voice"
                active-text="开启"
                inactive-text="关闭"
                active-value="1"
                inactive-value="0"
                :disabled="leddisabled"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="updataMaster">
              </el-switch>
            </div>
            <!-- 声音 结束 -->

            <!-- 夜间状态 开始 -->
            <div class="controlele">
              <span class="contolItem">
                夜间状态
              </span>
              <i class="iconfont icon icon-yejian"></i>
              <el-switch
                class="controlInput"
                v-model="dataForm.atNight"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="开启"
                :disabled="leddisabled"
                inactive-text="关闭"
                active-value= '1'
                inactive-value="0"
                @change="updataMaster">
              </el-switch>
            </div>
            <!-- 夜间状态 结束 -->

            <!-- 调试按钮 开始 -->
              <el-button :type="debugType" class="debugging" v-hasBtn plain size="small" @click="debugging">{{debugTitle}}</el-button>
            <!-- 调试按钮 开始 -->

          </li>
          <li class="controlitem controlitembg">

            <!-- 尾迹 开始 -->
            <div class="controlele">
              <span class="contolItem">
                尾迹
              </span>
              <i class="iconfont icon icon-dingwei"></i>
              <el-switch
                v-model="dataForm.wake"
                class="controlInput"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="开启"
                inactive-text="关闭"
                active-value="1"
                inactive-value="0"
                :disabled="leddisabled"
                @change="updataMaster">
              </el-switch>
            </div>
            <!-- 尾迹 结束 -->

            <!-- 控制模式 开始 -->
            <div class="controlele">
              <span class="contolItem">
                控制模式
              </span>
              <i class="iconfont icon icon-zidong"></i>
              <el-switch
                v-model="controlModel"
                class="controlInput"
                active-text="自动"
                inactive-text="手动"
                active-color="#13ce66"
                inactive-color="#0ea6cc"
                active-value="0"
                inactive-value="1"
                @change="setLedModel">
              </el-switch>
            </div>
            <!-- 控制模式 结束 -->

          </li>
          <li class="controlitem">

            <!-- 亮度 开始 -->
            <div class="sliderName">
              <span class="contolItem">
                亮度
              </span>
              <i class="iconfont icon icon-liangdu"></i>
            </div>
            <div class="mySlider">
              <el-slider
                v-model="dataForm.brightness"
                show-stops
                :min='10'
                :max="100"
                :step="10"
                :show-tooltip="false"
                :disabled="leddisabled"
                @change="updataMaster">
              </el-slider>
            </div>
            <div class="showNumber">
              <span>{{dataForm.brightness}}%</span>
            </div>
            <!-- 亮度 结束 -->

          </li>
          <li class="controlitem controlitembg">

            <!-- 频率 开始 -->
            <div class="sliderName">
              <span class="contolItem">
                频率
              </span>
              <i class="iconfont icon icon-pinshuai"></i>
            </div>
            <div class="mySlider">
              <el-slider
                v-model="dataForm.frequency"
                :step="10"
                :max='120'
                :min='10'
                :show-tooltip="false"
                show-stops
                :disabled="leddisabled"
                @change="updataMaster">
              </el-slider>
            </div>
            <div class="showNumber">
              <span>{{dataForm.frequency}}Hz</span>
            </div>
            <!-- 频率 结束 -->

          </li>
          <li v-show='debugShow' class="controlitem debugBox">
            <p :key="index" v-for="(item, index) in debugList">{{item}}</p>
          </li>
        </ul>
        <!-- 控制表单 结束 -->
        <div class="mask" v-show="loading">
          <i style="font-size: 30px;color: #fff;" class="el-icon-loading"></i>
        </div>
    </el-dialog>
    <!-- 主控设备控制 结束 -->

  </div>
</template>
<script>
// API
import { updateLead, manualAuto, getMainStatus } from '@/api/lamp/lampInfo'

// 配置
import brightnessF from '../../config/brightness'
import { Message } from 'element-ui'
import wsModule, { sendType } from '@/config/ws_module'
// 中转
import eventBus, { emitType } from '@/utils/eventBus'

export default {
  props: {
    code: {
      type: String,
      default: () => {}
    }
  },
  computed: {
    leddisabled () {
      if (this.controlModel === '0') {
        return true
      } else {
        return false
      }
    }
  },
  data () {
    return {
      loading: false,
      debugList: [],
      debugType: 'primary',
      debugTitle: '调试',
      debugShow: false,
      dialogVisible: false,
      dataForm: {
        code: null,
        brightness: null,
        frequency: null,
        atNight: 0,
        wake: 0,
        voice: 0
      },
      controlModel: 0,
      submitForm: {
        code: null,
        brightness: null,
        frequency: null,
        atNight: null,
        wake: null,
        voice: null
      },
      masterInfo: {},
      status: 1,
      deviceType: {
        0: { value: 0, title: '设备正常', iconClass: 'iconsuccess', textClass: 'success' },
        1: { value: 0, title: '设备离线', iconClass: 'icondanger', textClass: 'danger' },
        2: { value: 0, title: '设备告警', iconClass: 'iconwarning', textClass: 'warning' },
        3: { value: 0, title: '设备升级', iconClass: 'iconinfo', textClass: 'info' }
      }
    }
  },
  methods: {
    // 显示弹框
    show () {
      this.dialogVisible = true
    },

    // 重置数据
    reset () {
      this.dataForm.code = this.code
      this.dataForm.brightness = 0
      this.dataForm.frequency = 0
      this.dataForm.atNight = 0
      this.dataForm.wake = 0
      this.dataForm.voice = 0
      this.controlModel = 0
      this.status = 1
    },

    // 更新状态前，进行数据转换
    updataFormat () {
      for (let key in this.dataForm) {
        if (key === 'brightness') {
          this.submitForm[key] = this.dataForm[key] / 10
        } else if (key === 'frequency') {
          this.submitForm[key] = brightnessF[this.dataForm[key] / 10]
        } else {
          this.submitForm[key] = this.dataForm[key]
        }
      }
      this.submitForm.code = this.code
    },

    // 弹框表单 数据转换
    showFormat () {
      this.dataForm.code = this.masterInfo.mianControlLeadCode
      this.dataForm.brightness = this.masterInfo.brightness * 10
      this.dataForm.frequency = this.masterInfo.frequency * 10
      this.dataForm.atNight = this.masterInfo.nightMode.toString()
      this.dataForm.wake = this.masterInfo.wake.toString()
      this.dataForm.voice = this.masterInfo.voice.toString()
      this.controlModel = this.masterInfo.controlMode.toString()
      this.status = this.masterInfo.status // 状态
      if (this.masterInfo.status === 0) {
        this.isConnect = '设备在线'
      } else {
        this.isConnect = '设备离线'
      }
    },

    // 更新引导灯主控状态
    async updataMaster () {
      this.updataFormat()
      await updateLead(this.submitForm)
        .then(res => {
          this.tip('设备状态修改成功', 'success')
        })
        .catch(err => {
          console.log(err)
          this.tip('设备状态修改失败', 'error')
        })
      this.getMainStatu()
    },

    // 设置工作模式
    async setLedModel (model) {
      await manualAuto({ code: this.code, model: this.controlModel })
        .then(res => {
          this.tip('工作模式修改成功', 'success')
        })
        .catch(err => {
          console.log(err)
          this.tip('工作模式修改失败', 'error')
        })
      this.getMainStatu()
    },

    // 弹框显示回调
    openDialog () {
      eventBus.$emit('ws_connection', { code: this.code, type: sendType.LAMPMAIN }, wsModule.START)
      eventBus.$on(emitType.lampMain, (data) => {
        this.masterInfo = data
        this.showFormat()
      })
      eventBus.$on(emitType.debug, (data) => {
        this.debugList.unshift(data)
      })
      this.$nextTick(() => {
        this.getMainStatu()
      })
    },

    // 弹框关闭回调
    closeDialog () {
      this.reset()
      this.debugType = 'primary'
      this.debugList = []
      this.debugShow = false
      this.debugTitle = '调试'
      eventBus.$emit('ws_close', { code: this.code, type: sendType.DEBUG }, wsModule.END)
      eventBus.$emit('ws_close', { code: this.code, type: sendType.LAMPMAIN }, wsModule.END)
    },

    async getMainStatu () {
      this.loading = true
      await getMainStatus({ code: this.code })
        .then(res => {
          this.masterInfo = res.result
          this.showFormat()
        })
        .catch(err => {
          this.tip('获取主控状态失败', 'error')
          console.log(err)
        })
      this.loading = false
    },

    // 提示函数
    tip (msg, type) {
      Message({
        duration: 3000,
        message: msg,
        type: type
      })
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
    }
  }
}
</script>
<style scoped>
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
.tableBox{
  width: 100%;
  padding:10px;
  box-sizing: border-box;
}
.controlitem{
  height: 60px;
  width: 100%;
  overflow: hidden;
  background: #ffffff;
}
.controlitembg{
  background: #eeeeee;
}
.controlele{
  width: 43%;
  float: left;
  line-height: 60px;
  box-sizing: border-box;
}
.contolItem{
  display: inline-block;
  width: 80px;
  text-align: center;
  font-size: 14px;
  color:#000000;
  line-height: 60px;
}

.icon{
  padding-right:21px;
  font-size: 18px;
}
.sliderName{
  width: 125px;
  height: 100%;
  float: left;
}
.mySlider{
  width: 323px;
  padding-top:10px;
  float: left;
}
.showNumber{
  height: 100%;
  width: 100px;
  float: left;
}
.showNumber{
  line-height: 60px;
  margin-left: 19px;
}
.controlInput{
  margin-bottom: 4px;
}
</style>
