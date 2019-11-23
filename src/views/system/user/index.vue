<template>
<!-- root element -->
  <div class="textAlginLeft">
    <!-- 表格数据搜索 开始 -->
      <Search
        :options='searchOptions'
       @toQuery='toQuery'
       >
      </Search>
    <!-- 表格数据搜索 结束 -->

    <!-- 操作数据按钮 开始 -->
    <el-button-group>
      <el-button type="success" icon="el-icon-plus" size="mini" @click="showAddDialog()">添加</el-button>
    </el-button-group>
    <!-- 操作数据按钮 结束 -->

    <!-- 表格+分页 开始 -->
    <EleTable
      :list='list'
      :columns='columns'
      :operates='operates'
      :total='total'
      :currentPage='currentPage'
      :page-sizes='pageSizes'
      :pageSize='pageSize'
      @handleSelectionChange='handleSelectionChange'
      @handleSizeChange='handleSizeChange'
      @handleCurrentChange='handleCurrentChange'
    ></EleTable>
    <!-- 表格+分页 结束 -->
  </div>
<!-- root element -->
</template>
<script>
// 混入
import tabelData from '@/mixins/tabelData'

// 组件
import EleTable from '@/components/EleTable/table'
import Search from '@/components/Search/search'

// 方法
import { timestampToTime } from '@/utils/format'

// API
import { pageUser } from '@/api/system/user'

export default {
  components: {
    EleTable,
    Search
  },
  mixins: [tabelData],
  created () {
    // 获取用户
    this.getTabelData(this.initData)
  },
  data () {
    return {
      // 获取数据函数 字段必须为initData
      initData: pageUser,
      // 角色列表数据 字段必须为list
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
      },

      // 搜索配置
      searchOptions: { // 最低能见度统计
        type: [
          {
            type: 'input', //
            name: '搜索',
            queryname: 'username',
            query: null,
            placeholder: '请输入用户名xxxx',
            callback: this.change
          }
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
