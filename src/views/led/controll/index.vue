<template>
<div class="textAlginLeft">
  <!-- 表格数据搜索 开始 -->
    <Search
    :options='searchOptions'
    @toQuery='toQuery'
    ></Search>
  <!-- 表格数据搜索 结束 -->
  <!-- 添加按钮开始 -->
  <el-button-group>
    <el-button type="primary" icon="el-icon-share" size="mini" @click="showAddDialog()">添加</el-button>
  </el-button-group>
  <!-- 添加按钮结束 -->

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
  <!-- 表格+分页 开始 -->
</div>
</template>

<script>
// 混入
import tabelData from '@/mixins/tabelData'
// 组件
import EleTable from '@/components/EleTable/table'
import Search from '@/components/Search/search'
// API
import { getMainControl } from '@/api/led/controller'
// 方法
import { timestampToTime } from '@/utils/format'
export default {
  components: {
    EleTable,
    Search
  },
  mixins: [tabelData],
  data () {
    return {
      // 获取数据函数 字段必须为initData
      initData: getMainControl,
      // 表格列表数据
      list: [],
      // 表格数据展示数据key
      columns: [
        { prop: 'location', label: '安装位置', align: 'center' },
        { prop: 'code', label: '灯组编号', align: 'center' },
        { prop: 'lampNum', label: '激光灯数量（个）', align: 'center' },
        { prop: 'createTime', label: '安装时间', align: 'center', formatter: this.timestampToTimes }
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
            type: 'input',
            name: '搜索',
            queryname: 'location',
            query: null,
            placeholder: '请输入安装位置',
            callback: this.change
          }
        ]
      }
    }
  },
  methods: {
    // 时间转化
    timestampToTimes (val, key) {
      return timestampToTime(val[key.prop])
    },
    // 表格多行选中
    handleSelectionChange (val) {
      console.log(val)
    }
  },
  async created () {
    // 获取用户
    await this.getTabelData(this.initData)
    console.log(this.list)
  },
  mounted () {
    console.log(this.list)
  }
}
</script>

<style scoped>

</style>
