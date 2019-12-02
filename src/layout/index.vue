<template>
  <div class="app_wapper">
    <el-container>
      <!-- 侧边栏 开始 -->
      <el-aside>
        <el-menu
          mode="vertical"
          style="border-right:none;"
          :collapse="isCollapse"
          unique-opened
          :default-active="$route.path"
          background-color="#2d3a4b"
          text-color="#fff"
          active-text-color="#409EFF;">
          <!-- 菜单组件 -->
          <div class="devName"><i class="iconfont">&#xe602;</i><span class="title">设备控制</span></div>
          <side-menus :routes="routers"></side-menus>
        </el-menu>
      </el-aside>
      <!-- 侧边栏 结束 -->

      <!-- 展示信息 开始 -->
      <el-container>
        <div class="navbar">
          <!-- 隐藏显示侧边栏 开始 -->
          <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
          <!-- 隐藏显示侧边栏 结束 -->

          <!-- 面包屑 开始 -->
          <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
          <!-- 面包屑 结束 -->

          <!-- 用户信息 开始 -->
          <div class="right-menu">
            <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
              <div class="avatar-wrapper">
                <el-badge is-dot>
                  <svgIcon :className="'userIcon'" :iconClass='userIcon'></svgIcon>
                </el-badge>
              </div>
              <el-dropdown-menu slot="dropdown">
                <router-link to="/index">
                  <el-dropdown-item>
                    <i class="iconfont icon-yemian-copy-copy" aria-hidden="true"></i>首页
                  </el-dropdown-item>
                </router-link>
                <router-link to="/deviceLog/alarm">
                  <el-dropdown-item divided>
                    <el-badge :value="120" :max="99" class="item">
                      <span style="display:block;"><i class="iconfont icon-xiaoxi-"></i>消息</span>
                    </el-badge>
                  </el-dropdown-item>
                </router-link>
                <el-dropdown-item divided>
                  <span style="display:block;" @click="logout"><i class="iconfont icon-tuichu"></i>退出</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <!-- 用户信息 结束 -->

        </div>
        <el-main>

          <!-- 二级路由跳转 -->
          <router-view style="margin-top:5px;"/>

        </el-main>
        <!-- 底部 -->
        <el-footer style="background-color: #2d3a4b; line-height: 50px;height: 50px;">
          <div class="page-footer" style="margin-left: 210px"></div>
        </el-footer>
      </el-container>
      <!-- 展示信息 结束 -->

    </el-container>
  </div>
</template>

<script>
// 依赖
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'

// 方法
import WebSocketWrapper from '@/utils/websocket'
import eventBus from '@/utils/eventBus'
import { getToken } from '@/utils/auth'
import { isJSON } from '@/utils/format'
// 组件
import sideMenus from './SideMenus'
import Hamburger from '@/components/Hamburger'
import Breadcrumb from '@/components/Breadcrumb'
import svgIcon from '@/components/SvgIcon/index'

export default {
  computed: {
    ...mapGetters(['sidebar', 'routers', 'token'])
  },
  components: {
    sideMenus,
    Breadcrumb,
    Hamburger,
    svgIcon
  },
  data () {
    return {
      userRole: 'Topest',
      isCollapse: false,
      userIcon: 'icon-chaojiguanliyuan',
      socket: null,
      ws_params: {
        versionNumber: 1.0, // 协议版本号
        module: null, // 命令号
        code: null, // 数据结果（0-成功 1-失败）
        deviceType: null, // 设备类型（0-PC，1-手机）
        token: getToken(), // 携带token
        data: {}// 携带数据
      }
    }
  },
  methods: {
    toggleSideBar () {
      // this.$store.dispatch('toggleSideBar')
      this.isCollapse = !this.isCollapse
    },
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
    onmessage (data) {
      if (isJSON(data.data)) {
        // eventBus.$emit('ws_updataStatusLed', data)
        // eventBus.$emit('ws_updataStatusLamp', data)
        // eventBus.$emit('ws_updataStatusVoice', data)
      }
    }
  },
  created () {
    // 获取角色
    this.$store.dispatch('getAllRoles')

    // 获取用户
    this.$store.dispatch('getAllUsers')

    // 获取分组
    this.$store.dispatch('findAllGroupS')

    // 创建监听
    eventBus.$on('ws_connection', (code, type) => {
      console.log('start' + code)
      this.ws_params.module = type
      this.ws_params.data = { code: code }
      let obj = JSON.parse(JSON.stringify(this.ws_params))
      obj = JSON.stringify(obj)
      this.socket.send_(obj)
    })
    eventBus.$on('ws_close', (code, type) => {
      console.log('close' + code)
      this.ws_params.module = type
      this.ws_params.data = { code: code }
      let obj = JSON.parse(JSON.stringify(this.ws_params))
      obj = JSON.stringify(obj)
      this.socket.send_(obj)
    })
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
  }
}
</script>
<style lang="scss" scoped>
  $sideBarWidth: 220px;
  .title{
    padding-left: 5px;
  }
  .devName{
    line-height: 50px;
    height: 50px;
    color:#fff;
    font-size:18px;
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
    width: $sideBarWidth !important;
    height: 100%;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
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
    overflow: auto;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 1px 10px 0 10px;
    color: #333;
    border: 1px solid #C2C2C2;
    background: #fafafa;
    border-left: 0;
    margin-left: $sideBarWidth;
    height:calc(100vh - 100px);
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
    margin-left: $sideBarWidth;
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
            background: rgba(0, 0, 0, .025)
          }
        }
      }

      .avatar-container {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #ccc;
        margin-top: 5px;
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
</style>
