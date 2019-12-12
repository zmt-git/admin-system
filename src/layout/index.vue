<template>
  <div class="app_wapper" ref="app_wapper">
    <el-container>
      <!-- 侧边栏 开始 -->
      <el-aside ref="el_aside" :width='width'>
        <el-menu
          mode="vertical"
          style="border-right:none;"
          :collapse="isCollapse"
          unique-opened
          class="el-menu-vertical-demo"
          :default-active="activeLink"
          background-color="#2d3a4b"
          text-color='#fff'
          active-text-color="#409EFF;">
          <!-- 菜单组件 -->
          <div class="devName"><i class="iconfont icon-pingtai"></i><span :class="platformname ? 'title' : 'noTitle'">设备管控</span></div>
          <side-menus :routes="routers"></side-menus>
        </el-menu>
      </el-aside>
      <!-- 侧边栏 结束 -->

      <!-- 展示信息 开始 -->
      <el-container ref="el_container" style="margin-left:220px">
        <div class="navbar">
          <!-- 隐藏显示侧边栏 开始 -->
          <hamburger id="hamburger-container"  class="hamburger-container" @toggleClick="toggleSideBar" />
          <!-- 隐藏显示侧边栏 结束 -->

          <!-- 面包屑 开始 -->
          <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
          <!-- 面包屑 结束 -->

          <!-- 用户信息 开始 -->
          <div class="right-menu">
            <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
              <div class="avatar-wrapper">
                <!-- <el-badge is-dot> -->
                  <svgIcon :className="'userIcon'" :iconClass='userIcon'></svgIcon>
                <!-- </el-badge> -->
              </div>
              <el-dropdown-menu slot="dropdown">
                <router-link to="/index">
                  <el-dropdown-item>
                    <i class="iconfont icon-yemian-copy-copy" aria-hidden="true"></i>首页
                  </el-dropdown-item>
                </router-link>
                <!-- <router-link to="/deviceLog/alarm">
                  <el-dropdown-item divided>
                    <el-badge :value="120" :max="99" class="item">
                      <span style="display:block;"><i class="iconfont icon-xiaoxi-"></i>消息</span>
                    </el-badge>
                  </el-dropdown-item>
                </router-link> -->
                <el-dropdown-item divided>
                  <span style="display:block;" @click="logout"><i class="iconfont icon-tuichu"></i>退出</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <!-- 用户信息 结束 -->

        </div>

        <el-main>
          <div style="width:100%;height:100%;position:relative">
            <transition name="el-fade-in-linear">
              <!-- 二级路由跳转 -->
              <router-view style="margin-top:5px;"/>
            </transition>
          </div>
        </el-main>
        <!-- 底部 -->
        <el-footer style="background-color: #2d3a4b; line-height: 50px;height: 50px;">
          <div class="page-footer" style="margin-left: 210px"></div>
        </el-footer>
      </el-container>
      <!-- 展示信息 结束 -->

    </el-container>
    <el-dialog
      width="610px"
      title="告警提示"
      :close-on-click-modal='false'
      custom-class='alarm'
      :append-to-body='true'
      :visible.sync="alarmDialogVisible"
      @open='open'
      @close='close'
    >
    <div class="voice" @click="voice">
      <i v-show="!mute" class="iconfont icon-mn_shengyin mute" title="声音"></i>
      <i v-show="mute" class="iconfont icon-jingyin1 mute" title="静音"></i>
    </div>
      <ul class="alarm">
        <li>
          <span class="alarmName">主控编码</span><span>{{alarm.code}}</span>
        </li>
        <li>
          <span class="alarmName">设备类型</span><span>{{formatType(alarm.deviceType)}}</span>
        </li>
        <li>
          <span class="alarmName">维护状态</span>
          <span class="status" :class="maintian[alarm.maintian].className">{{maintian[alarm.maintian].info}}</span>
        </li>
        <li>
          <span class="alarmName">设备状态</span>
          <span class="status" :class="deviceStatus[alarm.deviceStatus].className">{{deviceStatus[alarm.deviceStatus].info}}</span>
        </li>
        <li class="widthAll">
          <span class="alarmName">报警时间</span><span>{{formatAlarmTime(alarm.alarmTime)}}</span>
        </li>
        <li class="widthAll">
          <span class="alarmName">告警原因</span><span style="color: red">{{alarm.reason}}</span>
        </li>
        <div class="read">
          <el-checkbox v-model="alarm.read" class="tip" style="color: #000" @change='read(alarm.read)'>标记为已读状态</el-checkbox>
        </div>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-checkbox class="tip" v-model="checkedTip" @change='alarmTip'>勾选后，告警弹框将不再弹出</el-checkbox>
        <span class="more">更多告警信息请前往<span class="info" @click="toAlarm">告警信息</span>查看</span>
        <el-button type="warning" size="mini" @click="alarmDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <div class="checkedTip" ref="checkedTip" v-show="checkedTip">
      <div class="number" ref="number" @mousedown.self="getPosition" @mouseup="position">99+</div>
      <div class="message" v-show="messageShow" @click="alarmDialogVisible = true">告警信息</div>
    </div>
    <audio ref="voice" muted autoplay >
      <source src="../assets/audio/8858.wav" type="audio/mpeg">
    </audio>
  </div>
</template>

<script>
// 依赖
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'

// 方法
import WebSocketWrapper from '@/utils/websocket'
import eventBus, { emitType } from '@/utils/eventBus'
import { getToken, setAlarm, setVoice, getAlarm, getVoice } from '@/utils/auth'
import { isJSON, timestampToTime } from '@/utils/format'
// 组件
import sideMenus from './SideMenus'
import Hamburger from '@/components/Hamburger'
import Breadcrumb from '@/components/Breadcrumb'
import svgIcon from '@/components/SvgIcon/index'

export default {
  computed: {
    ...mapGetters(['sidebar', 'routers', 'token']),
    userIcon () {
      return 'icon-chaojiguanliyuan1'
    }
  },
  components: {
    sideMenus,
    Breadcrumb,
    Hamburger,
    svgIcon
  },
  data () {
    return {
      activeLink: null,
      userRole: 'Topest',
      isCollapse: false,
      socket: null,
      ws_params: {
        versionNumber: '1.0', // 协议版本号
        module: 'ledend', // 命令号
        // deviceType: null, // 设备类型（0-PC，1-手机）
        token: getToken(), // 携带token
        data: {}// 携带数据
      },
      alarmDialogVisible: false,
      alarm: {
        code: 'NXYDD_XZ_0004',
        deviceType: 'led',
        deviceStatus: 2,
        maintian: 0,
        reason: '电池电压过低',
        read: false,
        alarmTime: new Date().getTime()
      },
      checked: false,
      checkedTip: false,
      messageShow: true,
      mute: false,
      deviceType: {
        led: '激光灯',
        lamp: '引导灯',
        voice: '红外对射'
      },
      deviceStatus: {
        0: { value: 0, 'info': '在线', className: 'normal' },
        1: { value: 1, 'info': '离线', className: 'offline' },
        2: { value: 2, 'info': '告警', className: 'warning' },
        3: { value: 3, 'info': '升级', className: 'upgrade' }
      },
      maintian: {
        0: { value: 0, 'info': '未维护', className: 'offline' },
        1: { value: 1, 'info': '已维护', className: 'normal' }
      },
      width: '220px',
      platformname: true
    }
  },
  methods: {
    // 侧边栏显示隐藏
    toggleSideBar () {
      // this.$store.dispatch('toggleSideBar')
      this.isCollapse = !this.isCollapse
      if (this.isCollapse) {
        this.width = '70px'
        this.platformname = false
        this.$refs.el_container.$el.style.cssText = `
          margin-left: 70px;
          transition: all .28s;
        `
      } else {
        this.width = '220px'
        this.platformname = true
        this.$refs.el_container.$el.style.cssText = `
          margin-left: 220px;
          transition: all .28s;
        `
      }
    },

    // 登出
    logout () {
      this.$confirm('此操作将退出账户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$store.dispatch('Logout')
        this.$router.push(`/?redirect=${this.$route.fullPath}`)
        location.reload()
      }).catch(() => {
        Message({
          type: 'info',
          message: '已取消退出'
        })
      })
    },

    // websocket接受消息
    onmessage (data) {
      // console.log(data)
      if (isJSON(data.data)) {
        let message = JSON.parse(data.data)
        if (message.module === 'alarm') {
          if (this.checkedTip) {
            this.alarmDialogVisible = true
          }
          if (!this.mute) {
            this.$refs.voice.play()
          }
          this.alarm = message.data
        } else if (message.module === 'result') {
          // console.log('heart')
        } else {
          eventBus.$emit(emitType[message.module], message.data)
        }
      }
    },

    // 告警信息link
    toAlarm () {
      this.alarmDialogVisible = false
      this.$router.push('/deviceLog/alarm')
    },

    // 标记已读未读 TODO
    read (type) {
      if (type) {
        // 标记为已读 更新报警列表 提示数字-1， 更新数据库数据

      } else {
        // 标记为未读 更新报警列表

      }
    },

    // 改变提示位置
    changePosition (event) {
      let e = event || window.event
      if (this.positionCheck) {
        this.$refs.checkedTip.style.top = e.pageY + 'px'
        this.$refs.checkedTip.style.left = e.pageX + 'px'
      }
    },

    // 鼠标弹起
    position () {
      this.$refs.number.style.cursor = 'grab'
      this.messageShow = true
      let e = event || window.event
      this.$refs.checkedTip.style.top = e.pageY + 'px'
      this.$refs.checkedTip.style.right = -70 + 'px'
    },

    // 鼠标按下
    getPosition () {
      this.$refs.number.style.cursor = 'grabing'
      this.messageShow = false
      this.$refs.app_wapper.onmousemove = () => {
        if (!this.messageShow) {
          let e = event || window.event
          this.$refs.checkedTip.style.top = (e.pageY - 20) + 'px'
          this.$refs.checkedTip.style.right = (this.$refs.app_wapper.clientWidth - e.pageX - 20) + 'px'
        }
      }
    },

    // 静音
    voice () {
      this.mute = !this.mute
      if (this.mute) {
        this.$refs.voice.pause()
        setVoice('true')
      } else {
        this.$refs.voice.play()
        setVoice('false')
      }
    },

    // 报警弹框显示
    open () {
      // this.$refs.voice.play()
    },

    // 告警弹框隐藏
    close () {
      // this.$refs.voice.pause()
    },

    // 自动弹框
    alarmTip () {
      if (this.checkedTip) {
        setAlarm('true')
      } else {
        setAlarm('false')
      }
    },

    // 报警时间转换
    formatAlarmTime (time) {
      return timestampToTime(time)
    },

    // 设备类型转换
    formatType (type) {
      return this.deviceType[type]
    }
  },
  created () {
    this.activeLink = this.$route.path
    // 获取角色
    this.$store.dispatch('getAllRoles')

    // 获取用户
    this.$store.dispatch('getAllUsers')

    // 获取分组
    this.$store.dispatch('findAllGroupS')

    // 创建监听
    eventBus.$on('ws_connection', (infoObj, type) => {
      this.ws_params.module = type
      this.ws_params.data = infoObj
      let obj = JSON.parse(JSON.stringify(this.ws_params))
      obj = JSON.stringify(obj)
      this.socket.websock.send(obj)
      // console.log('消息已发送 连接')
      // console.log(obj)
    })
    eventBus.$on('ws_close', (infoObj, type) => {
      this.ws_params.module = type
      this.ws_params.data = infoObj
      let obj = JSON.parse(JSON.stringify(this.ws_params))
      obj = JSON.stringify(obj)
      this.socket.websock.send(obj)
      // console.log('消息已发送 断开')
      // console.log(obj)
    })
    // 初始化报警状态
    if (getVoice() === 'true') {
      this.mute = true
    } else {
      this.mute = false
    }
    if (getAlarm() === 'true') {
      this.checkedTip = true
    } else {
      this.checkedTip = false
    }
  },
  mounted () {
    // 建立websocket
    this.socket = new WebSocketWrapper({ onmessage: this.onmessage })
  },
  destroyed () {
    // 销毁监听
    this.socket.websock.close()
    eventBus.$off('ws_connection')
    eventBus.$off('ws_close')
    let arr = Object.keys(emitType)
    arr.forEach(item => {
      eventBus.$off(emitType[item])
    })
  },
  watch: {
    $route (to, from) {
      this.activeLink = to.path
    }
  }
}
</script>
<style lang="scss" scoped>
  // $sideBarWidth: 220px;
  .title{
    padding-left: 5px;
  }
  .noTitle{
    display: none;
  }
  .devName{
    line-height: 50px;
    height: 50px;
    color:rgb(255, 220, 64);
    font-size: 16px;
    text-align:left;
    background-color: #2d3a4b;
    border: 1px solid #2d3a4b;
    padding-left: 20px;
  }
  /*wapper*/
  .app_wapper {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  .app_content {
    min-height: 500px;
    margin-left: 220px;
    border: 1px solid #eee;
    box-sizing: border-box;
  }

  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 50px;
    height: 50px;
  }

  .app_wapper .el-aside,
  .slider_container .el-menu {
    padding: 0px;
    color: #333;
    transition: width .28s;
    // width: $sideBarWidth !important;
    height: 100%;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    overflow-x: hidden;
    overflow-y: auto;
    z-index: 1001;
    background-color: #2d3a4b;
  }

  .app_wapper .el-main {
    display: block;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    -ms-flex-preferred-size: auto;
    flex-basis: auto;
    transition: width .28s;
    overflow: auto;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 1px 10px 0 10px;
    color: #333;
    border: 1px solid #C2C2C2;
    background: #fafafa;
    border-left: 0;
    // margin-left: $sideBarWidth;
    height:calc(100vh - 100px);
    position: relative;
  }
  .app_wapper .el-menu-item-group__title {
    padding: 0 0 1px 20px;
    line-height: normal;
    font-size: 12px;
    color: #909399;
  }

  .app_wapper .el-submenu .el-menu-item {
    height: 40px;
    line-height: 40px;
    padding: 0 35px;
    min-width: 200px;
    text-align: left;
  }
  .page-footer {
    margin: auto 10px;
    display: block;
    color: #ffffff;
    bottom: 0;
    font-size: 12px;
  }
  .navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
    // margin-left: $sideBarWidth;
    .hamburger-container {
      line-height: 46px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background .3s;
      -webkit-tap-highlight-color:transparent;
      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }

    .breadcrumb-container {
      float: left;
    }

    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }

    .right-menu {
      float: right;
      height: 100%;
      line-height: 50px;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background .3s;

          &:hover {
            background: rgba(0, 0, 0, .1)
          }
        }
      }

      .avatar-container {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-top: 5px;
        background: rgba(0, 0, 0, .05);
        margin-right: 10px;
        padding: 0px;

        .avatar-wrapper {
          position: relative;
          height: 40px;
          line-height: 40px;

          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
  .user{
    font-size: 32px;
  }
  .userImg{
    width: 40px;
    height: 40px;
  }
  .userIcon{
    font-size: 33px;
  }
  .alarm{
    font-size: 14px;
    background: linear-gradient(#eee 50%, #fff 50%);
    background-size: 100% 100px;
    overflow: hidden;
    & li{
      font-weight: 900;
      float: left;
      width: 50%;
      line-height: 50px;
      padding: 0 10px;
      box-sizing: border-box;
      & .alarmName{
        width: 80px;
        text-align: center;
        display: inline-block;
        line-height: inherit;
      }
    }
  }
  .widthAll{
    width: 100%!important;
  }
  .more{
    font-size: 12px;
    float: left;
    line-height: 28px;
    margin-left: 10px;
    font-weight: 900;
    color: #fff;
    & .info{
      color: #409EFF;
      padding: 0 5px;
      cursor: pointer;
    }
    & .info:hover{
      text-decoration: underline;
    }
  }
  .pointer{
    cursor: pointer!important;
  }
  .read{
    float: right;
    color: #409EFF;
    line-height: 30px;
    margin-right: 10px;
  }
  .tip{
    float: left;
    font-size: 12px;
    color: #fff;
    line-height: 28px;
  }
  .checkedTip{
    overflow: hidden;
    z-index: 9999;
    position: absolute;
    right: -70px;
    -moz-user-select: none; /*火狐*/
    -webkit-user-select: none; /*webkit浏览器*/
    -ms-user-select: none; /*IE10*/
    -khtml-user-select: none; /*早期浏览器*/
    user-select: none;
    // transition: all .5s;
    top:60px;
    & .number{
      width: 40px;
      height: 40px;
      float: left;
      background: red;
      border-radius: 50%;
      font-size: 18px;
      line-height: 40px;
      color: #fff;
      cursor: grab;
    }
    & .message{
      width: 70px;
      height: 26px;
      float: left;
      font-size: 14px;
      background: red;
      line-height: 26px;
      position: relative;
      left: -6px;
      top: 7px;
      color: #fff;
      cursor: pointer;
    }
    & .message:hover{
      text-decoration: underline;
    }
  }
  .checkedTip:hover{
    right: -6px!important;
    transition: all .5s;
  }
  .voice{
    font-size: 18px;
    color: #fff;
    position: absolute;
    top: 9px;
    right: 40px;
    font-weight: 900;
    cursor: pointer;
  }
  .mute{
    font-weight: 900;
  }
  .status{
    display: inline-block;
    color: #909399;
    background: #f4f4f5;
    border-color: #d3d4d6;
    border: 1px solid #d3d4d6;
    padding: 0 10px;
    line-height: 28px;
    border-radius: 3px;
    cursor: no-drop;
  }
  .offline{
    color: #f56c6c;
    background: #fef0f0;
    border-color: #fbc4c4;
  }
  .normal{
    background-color: #f0f9eb;
    border-color: #e1f3d8;
    color: #67c23a;
  }
  .warning{
    color: #e6a23c;
    background: #fdf6ec;
    border-color: #f5dab1;
  }
  .upgrade{
    color: #909399;
    background: #f4f4f5;
    border-color: #d3d4d6;
  }
</style>
<style>
.tip .el-checkbox__label{
  font-size: 12px;
  font-weight: 900;
}
.el-menu--collapse>.SideMenus>.el-menu-item span, .el-menu--collapse>.SideMenus>.el-submenu>.el-submenu__title span {
    height: 0;
    width: 0;
    overflow: hidden;
    visibility: hidden;
    display: inline-block;
}
.el-menu--collapse>.SideMenus>.el-menu-item .el-submenu__icon-arrow, .el-menu--collapse>.SideMenus>.el-submenu>.el-submenu__title .el-submenu__icon-arrow {
    display: none;
}
</style>
