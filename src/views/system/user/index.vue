<template>
  <div class="textAlginLeft">
    <el-button-group>
      <el-button type="primary" icon="el-icon-share" size="mini" @click="showAddDialog()">添加</el-button>
    </el-button-group>
    <EleTable
      :list='list'
      :columns='columns'
      :operates='operates'
      :total='total'
      :currentPage='currentPage'
      :page-sizes='pageSizes'
      @handleSelectionChange='handleSelectionChange'
      @handleSizeChange='handleSizeChange'
      @handleCurrentChange='handleCurrentChange'
    ></EleTable>
  </div>
</template>
<script>
// 混入
import tabelData from '@/mixins/tabelData'

// 组件
import EleTable from '@/components/EleTable/table'

// 方法
import { timestampToTime } from '@/utils/format'

// API
import { pageUser } from '@/api/system/user'

export default {
  components: {
    EleTable
  },
  mixins: [tabelData],
  created () {
    // 获取用户
    this.getTabelData(pageUser)
  },
  data () {
    return {
      // 角色列表数据
      list: [],

      // 表格数据展示数据key
      columns: [
        { prop: 'id', label: 'id' },
        { prop: 'name', label: '用户名' },
        { prop: 'username', label: '登录名' },
        { prop: 'creatTime', label: '创建时间', formatter: this.timestampToTimes },
        { prop: 'updateTime', label: '更新时间', formatter: this.timestampToTimes },
        { prop: 'creatUserId', label: '创建人' },
        { prop: 'updateUserId', label: '更新人' },
        { prop: 'synopsis', label: '备注' }
      ],

      // 表格操作按钮
      operates: {
        fixed: 'right',
        width: '200px',
        list: [
          { show: true, type: 'danger', icon: 'el-icon-delete', method: this.tabelItem },
          { show: true, type: 'info', icon: 'el-icon-edit', method: this.tabelItem }
        ]
      }
    }
  },
  methods: {
    // 表格操作按钮
    tabelItem (val) {
      console.log(val)
    },
    // 时间转化
    timestampToTimes (val, key) {
      return timestampToTime(val[key.prop])
    },

    // 表格多行选中
    handleSelectionChange (val) {
      console.log(val)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
