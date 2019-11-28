<template>
  <!-- root element start -->
  <div>
    <el-dialog
      title="能见度信息"
      :append-to-body='true'
      width="610px"
      :visible.sync="dialogVisible"
      @open="open"
    >
      <span>
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
      findVIS({ code: this.code })
        .then(res => {
          this.list = res.result
          this.options.loading = false
        })
        .catch(error => {
          console.error(error)
          this.options.loading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
