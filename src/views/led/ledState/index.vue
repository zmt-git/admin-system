<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="请选择激光灯组">
      <el-select v-model="form.region" placeholder="请选择激光灯组">
        <el-option label="区域一" value="shanghai"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <!-- 表格+分页 开始 -->
  <!-- <EleTable
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
  ></EleTable> -->
  <!-- 表格+分页 结束 -->
</template>
<script>
// // 混入
// import tabelData from '@/mixins/tabelData'
// // 组件
// import EleTable from '@/components/EleTable/table'
// // 方法
// // import { timestampToTime } from '@/utils/format'
// // API
// import { getMainControl, getLaserStatus } from '@/api/led/controller'
// export default {
//   components: {
//     EleTable
//   },
//   mixins: [tabelData],
//   data () {
//     return {
//       // 获取数据函数 字段必须为initData
//       initData: getMainControl,
//       ledList: [],
//       form: {
//         region: ''
//       },
//       // 表格列表数据
//       list: [],
//       // 表格数据展示数据key
//       columns: [
//         { prop: 'code', label: '灯号', align: 'center' },
//         { prop: 'version', label: '版本号', align: 'center' },
//         { prop: 'version', label: '风扇状态', align: 'center' },
//         { prop: 'fanAuto', label: '风扇自动调速状态', align: 'center' },
//         { prop: 'fanSpeed', label: '风扇转速 ', align: 'center' },
//         { prop: 'version', label: '激光灯开关状态', align: 'center' },
//         { prop: 'brightness', label: '激光灯亮度', align: 'center' },
//         { prop: 'version', label: '版本号', align: 'center' },
//         { prop: 'flicker', label: '闪烁开关', align: 'center' },
//         { prop: 'flickerMode', label: '闪烁方案', align: 'center' },
//         { prop: 'cpuTemperature', label: 'CPU温度', align: 'center' }
//       ]
//     }
//   },
//   methods: {
//     // 表格多行选中
//     handleSelectionChange (val) {
//       console.log(val)
//     }
//   },
//   created () {
//     this.getTabelData(this.initData)
//     console.log(this.getTabelData(this.initData))
//   }
// }
</script>
