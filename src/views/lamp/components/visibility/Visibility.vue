<template>
  <!-- root element start -->
  <div>
    <el-dialog
      :title="'能见度信息' + '(' + code + ')'"
      :append-to-body='true'
      :fullscreen='fullscreen'
      width="610px"
      :close-on-click-modal='false'
      :visible.sync="dialogVisible"
      @open="open"
      @close="close"
    >
      <span>
        <i class="zuida iconfont" :class="fullscreenIcon" :title="fullscreenTit" @click="tofullscreen"></i>

        <!-- 能见度表格信息 开始 -->
        <EleTable
          :list='list'
          :columns='columns'
          :operates='operates'
          :options="options"
        >
        </EleTable>
        <!-- 能见度表格信息 结束-->
      </span>
    </el-dialog>
  </div>
  <!-- root element start -->
</template>
<script>
// 组件
import EleTable from '@/components/EleTable/table'

// API
import { findVIS } from '@/api/lamp/lampInfo'

// 方法
import { timestampToTime } from '@/utils/format'
import wsModule, { sendType } from '@/config/ws_module'
import eventBus, { emitType } from '@/utils/eventBus'
export default {
  name: 'VisibilityEcharts',
  components: {
    EleTable
  },
  props: {
    code: {
      type: String,
      default: -1
    }
  },
  data () {
    return {
      // 全屏属性
      fullscreen: false,
      fullscreenIcon: 'icon-zuidahua',
      fullscreenTit: '最大化',
      // 弹出框 显示隐藏
      dialogVisible: false,

      // 表格显示列key
      columns: [
        { prop: 'mainControlLeadId', label: '主控ID' },
        { prop: 'address', label: '名称' },
        { prop: 'createTime', label: '更新时间', formatter: this.timestampToTimes },
        { prop: 'batteryVoltage', label: '电池电压/V' },
        { prop: 'powerVoltage', label: '供电电压/V' },
        { prop: 'cpuTemperature', label: 'CPU温度/℃' },
        { prop: 'minuteVis', label: '一分钟能见度/m' }
      ],

      // 表格操作按钮 (混入数据包含该数据 ，添加其他配置重新覆盖即可)
      operates: {
        list: []
      },

      // 表格配置
      options: {
        stripe: false, // 是否为斑马纹 table
        highlightCurrentRow: false, // 是否要高亮当前行
        loading: true, // 是否添加表格loading加载动画
        mutiSelect: false, // 是否支持列表项选中功能
        height: '20px',
        border: true,
        padding: '5px 0',
        hasPagination: false,
        size: 'mini'
      },
      // 表格数据
      list: []
    }
  },
  methods: {
    // 时间转化
    timestampToTimes (val, key) {
      return timestampToTime(val[key.prop])
    },
    // 显示弹框
    show () {
      this.dialogVisible = true
    },

    // 弹出框打开 回调 获取数据
    open () {
      // 获取数据
      findVIS({ code: this.code })
        .then(res => {
          this.list = res.result
          this.options.loading = false
        })
        .catch(error => {
          console.log(error)
          this.options.loading = false
        })
      // 监听ws
      eventBus.$emit('ws_connection', { code: this.code, type: sendType.VISIBILITYLAMPTABLE }, wsModule.START)
      eventBus.$on(emitType.lampMain, (data) => {
        this.list = data
      })
    },

    // 弹出框关闭 回调
    close () {
      eventBus.$emit('ws_close', { code: this.code, type: sendType.VISIBILITYLAMPTABLE }, wsModule.END)
      this.fullscreen = false
      this.fullscreenIcon = 'icon-zuidahua'
      this.fullscreenTit = '最大化'
    },

    // 全屏
    tofullscreen () {
      this.fullscreen = !this.fullscreen
      this.$nextTick(() => {
        if (this.fullscreen === true) {
          this.fullscreenIcon = 'icon-huanyuan'
          this.fullscreenTit = '向下还原'
        } else {
          this.fullscreenIcon = 'icon-zuidahua'
          this.fullscreenTit = '最大化'
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
