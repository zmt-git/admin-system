<template>
  <div class="control">
     <el-dialog
        title="主控设备控制"
        width="610px"
        custom-class="myDialogbtn"
        :visible.sync="dialogVisible"
        :modal="true"
        :modal-append-to-body="true"
        @open="openDialog"
        @close="closeDialog">
        <ul class="controlList">
          <li class="controlitem controlitembg">

            <!-- 手动开关 开始 -->
            <div class="Licontrolitem">
              <span class="contolItem">手动开关</span><i class="iconfont controlIcon icon-zidong"></i>
              <el-switch
                v-model="handOff"
                active-text="开"
                inactive-text="关"
                active-value="1"
                inactive-value="0"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="manual()">
              </el-switch>
            </div>
            <!-- 手动开关 结束 -->

            <!-- 同步时间 开始 -->
            <div class="Licontrolitem">
              <span class="contolItem">同步时间</span><i class="iconfont controlIcon icon-tongbu"></i>
              <el-button style="width: 80px;" plain type="primary" size="mini" @click="syncTime()">同步</el-button>
            </div>
            <!-- 同步时间 结束 -->

            <!-- 状态 开始-->
            <div class="statusBox" :class='status === 0?"isConnect":"notConnect"'>{{isConnect}}</div>
            <!-- 状态 结束-->
          </li>

          <li class="controlitem">
            <!-- 定时开关机 开始 -->
             <div class="Licontrolitem">
            <span class="contolItem">开机时间</span><i class="iconfont controlIcon icon-main_dingshikaiguanji"></i>
            <el-time-picker
              style="width: 180px"
              v-model="onTime"
              class="date-box"
              format='HH:mm:ss'
              size="small"
              placeholder="请选择开机时间"
              value-format="HH:mm:ss"
              :picker-options="{selectableRange:'00:00:00 -23:59:00'}">
            </el-time-picker>
            </div>
            <div class="Licontrolitem">
              <span class="contolItem">关机时间</span><i class="iconfont controlIcon icon-main_dingshikaiguanji"></i>
              <el-time-picker
                style="width: 180px"
                v-model="offTime"
                format='HH:mm:ss'
                size="small"
                placeholder="请选择关机时间"
                value-format="HH:mm:ss"
                :picker-options="{
                    selectableRange:'00:00:00 -23:59:00'
                }">
              </el-time-picker>
            </div>
            <el-button style="margin-top: 15px;" size="small" type="primary" @click="determine()" plain>确认选择</el-button>
          <!-- 定时开关机 结束 -->
          </li>

          <!-- 设置播放方案 开始 -->
          <div class="program">
            <li class="controlitem controlitembg">

              <!-- 播放次数 开始 -->
              <div class="Licontrolitem">
                <span class="contolItem">播放次数</span><i class="iconfont controlIcon icon-bofangcishu"></i>
                <el-select
                  style="width: 180px"
                  size="small"
                  v-model="valueNmb"
                  placeholder="请选择播放次数">
                <el-option
                    v-for="item in optionsNmb"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <!-- 播放次数 结束 -->

              <!-- 声音 开始 -->
              <div class="Licontrolitem">
                <span class="contolItem">声音</span><i class="iconfont controlIcon icon-yuyin"></i>
                <el-select
                  size="small"
                  v-model="voice"
                  placeholder="请选择男/女声"
                  style="width: 180px"
                >
                <el-option
                    @change="chooseConent()"
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <!-- 声音 结束 -->

            </li>

            <li class="controlitem controlitembg">
              <!-- 播放内容 开始 -->
              <div class="Licontrolitem">
                <span class="contolItem">播放内容</span><i class="iconfont controlIcon icon-neirong"></i>
                <el-select
                  size="small"
                  style="width: 180px"
                  v-model="valueContent"
                  placeholder="请选择播放内容"
                  >
                <el-option
                    v-for="item in optionsContent"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <!-- 播放内容 结束 -->

              <!-- 音量 开始 -->
              <div class="Licontrolitem">
                <span class="contolItem">音量</span><i class="iconfont controlIcon icon-shengyinyinliangxianxing"></i>
                <el-select
                  size="small"
                  style="width: 180px"
                  v-model="volume"
                  placeholder="请选择音量大小">
                  <el-option
                    v-for="item in optionsvolume"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <!-- 音量 开始 -->

            </li>
            <el-button plain type="primary" class="confirmBtn" size="small" @click="playNmb()">确认设置</el-button>
          </div>

          <!-- 设置播放方案 结束 -->
        </ul>
        <div class="mask" v-show="loading">
          <i style="font-size:60px" class="el-icon-loading"></i>
        </div>
    </el-dialog>
  </div>
</template>
<script>
// API
import { manualSwitch, setOnOrOffTime, setTime, setFlanSh, playMode, getMainStatus } from '@/api/voice/voiceInfo'

export default {
  props: {
    code: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      loading: true,
      custom: '', // 自定义指令
      status: '',
      isConnect: '',
      dialogVisible: false,
      handOff: null, // 手动开关
      playModel: '', // 播放模式
      offTime: '', // 关机时间
      onTime: '', // 开机时间
      volume: '', // 音量
      optionsvolume: [{
        value: 0,
        label: '大'
      }, {
        value: 1,
        label: '中'
      }],
      options: [{
        value: 0,
        label: '男声'
      }, {
        value: 1,
        label: '女声'
      }],
      voice: '', // 声音
      optionsNmb: [{
        value: 200,
        label: '循环播放'
      }, {
        value: 1,
        label: '1次'
      }, {
        value: 2,
        label: '2次'
      }, {
        value: 3,
        label: '3次'
      }, {
        value: 4,
        label: '4次'
      }, {
        value: 5,
        label: '5次'
      }, {
        value: 6,
        label: '6次'
      }, {
        value: 7,
        label: '7次'
      }, {
        value: 8,
        label: '8次'
      }, {
        value: 9,
        label: '9次'
      }, {
        value: 10,
        label: '10次'
      }],
      valueNmb: '', // 播放次数
      valueContent: '', // 播放内容
      optionsContent: [{
        value: 1,
        label: '前方出口'
      }, {
        value: 2,
        label: '冰雪天气，减速慢行'
      }, {
        value: 3,
        label: '前方大雾，减速慢行'
      }, {
        value: 4,
        label: '前方分流，靠右行驶'
      }, {
        value: 5,
        label: '前方事故，谨慎慢行'
      }, {
        value: 6,
        label: '前方拥堵，减速慢行'
      }, {
        value: 7,
        label: '雨天路滑，谨慎驾驶'
      }, {
        value: 8,
        label: '前方出口，提前变道'
      }]
    }
  },
  methods: {
    // 获取主控状态
    getMainStatusInit () {
      this.handOff = this.masterStatus.workStatus + '' // 设备开关(转为字符串)
      this.playModel = this.masterStatus.playMode + '' // 播放模式(转为字符串)
      this.onTime = this.masterStatus.onTime // 开机时间
      this.offTime = this.masterStatus.offTime // 关机时间
      this.voice = this.masterStatus.voice // 男声\女声
      this.volume = this.masterStatus.soundSize // 声音大小
      this.valueContent = this.masterStatus.con // 内容
      this.valueNmb = this.masterStatus.num // 次数
      this.status = this.masterStatus.status // 状态
      if (this.masterStatus.status === 0) {
        this.isConnect = '设备在线'
      } else {
        this.isConnect = '设备离线'
      }
    },
    manual () {
      if (this.handOff === '1') {
        manualSwitch({ code: this.code, powerSwitch: 1 })
          .then(res => {
            if (res.code === 1) {
              this.$message({
                showClose: true,
                message: '设备已打开',
                type: 'success'
              })
            }
          })
          .catch(err => console.log(err))
      } else {
        manualSwitch({ code: this.code, powerSwitch: 0 })
          .then(res => {
            if (res.code === 1) {
              this.$message({
                showClose: true,
                message: '设备已关闭',
                type: 'success'
              })
            }
          })
          .catch(err => console.log(err))
      }
    },
    // 播放模式（0：对应车辆检测播放，1：连续自动播放）
    play () {
      if (this.playModel === '1') {
        playMode({ code: this.code, playMode: 1 })
          .then(res => {
            if (res.code === 1) {
              this.$message({
                showClose: true,
                message: '切换为自动连续播放',
                type: 'success'
              })
            }
          })
          .catch(err => console.log(err))
      } else {
        playMode({ code: this.code, playMode: 0 })
          .then(res => {
            if (res.code === 1) {
              this.$message({
                showClose: true,
                message: '切换为车辆检测播放',
                type: 'success'
              })
            }
          })
          .catch(err => console.log(err))
      }
    },
    syncTime () {
      setTime({ code: this.code })
        .then(res => {
          if (res.code === 1) {
            this.$message({
              showClose: true,
              message: '同步成功',
              type: 'success'
            })
          } else {
            this.$message({
              showClose: true,
              message: res.msg
            })
          }
        })
        .catch(err => console.log(err))
    },
    // 确定时间
    determine () {
      if (this.offTime && this.onTime) {
        setOnOrOffTime({ on: this.onTime, off: this.offTime, code: this.code })
          .then(res => {
            if (res.code === 1) {
              this.$message({
                showClose: true,
                message: '设置成功',
                type: 'success'
              })
            }
          })
          .catch(err => console.log(err))
      } else {
        this.$message({
          showClose: true,
          message: '开关机时间都不能为空'
        })
      }
    },
    // 播放内容
    playNmb () {
      if (this.voice !== '' && this.valueNmb !== '' && this.volume !== '' && this.valueContent !== '') {
        setFlanSh({ code: this.code, number: 1, voice: this.voice, num: this.valueNmb, volume: this.volume, content: this.valueContent })
          .then(res => {
            if (res.code === 1) {
              this.$message({
                showClose: true,
                message: '设置成功',
                type: 'success'
              })
            } else {
              this.$message({
                showClose: true,
                message: res.msg
              })
            }
          })
          .catch(err => console.log(err))
      } else {
        this.$message({
          showClose: true,
          message: '播放方案参数任何一项不能为空'
        })
      }
    },
    show () {
      this.dialogVisible = true
    },
    formatfrequency (val) {

    },
    reset () {
      this.custom = ''
    },
    updataFormat () {

    },
    showFormat () {

    },
    updataMaster () {

    },
    openDialog () {
      this.$nextTick(async () => {
        this.code = this.code
        await getMainStatus({ code: this.code })
          .then(res => {
            this.loading = false
            this.masterStatus = res.result
          })
          .catch(err => {
            this.loading = false
            console.log(err)
          })
        this.getMainStatusInit()
        this.showFormat()
      })
    },
    closeDialog () {
      this.reset()
    }
  }
}
</script>
<style scoped>
.mask{
  position: absolute;
  left: 0;
  top: 0;
  background: #000000;
  opacity: 0.3;
  width: 100%;
  height: 100%;
  z-index: 9999;
  line-height: 28;
  text-align: center;
}
.isConnect{
  display: inline-block;
  width: 80px;
  height: 30px;
  background: #409EFF;
  line-height: 30px;
  text-align: center;
  border-radius: 6px;
  color: #fff;
}
.notConnect{
  display: inline-block;
  width: 80px;
  height: 30px;
  background: #909399;
  line-height: 30px;
  text-align: center;
  border-radius: 6px;
  color: #fff;
}
.text{
  text-align: center;
  line-height: 60px;
  font-size: 18px;
}
.volumetit{
  text-align: center;
  line-height: 60px;
  width: 80px;
  font-size: 14px;
  float: left;
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
  width: 50%;
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
  width: 300px;
  padding-top:16px;
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
.zuo{
  float: left;
  width: 60%;
  height: 100%;
}
.you{
  float: left;
  width: 40%;
  height: 100%;
}
.description{
  float: right;
  line-height: 60px;
  margin-right: 50px;
  font-size: 18px;
}
.Licontrolitem{
  float: left;
  width: 43%;
  box-sizing: border-box;
}
.controlIcon{
  margin-right: 20px;
  display: none;
}
.statusBox{
  display: inline-block;
  margin-top: 15px;
}
.program{
  position: relative;
}
.confirmBtn{
  position: absolute;
  right: 5px;
  top: 15px;
  line-height: 72px;
}
</style>
