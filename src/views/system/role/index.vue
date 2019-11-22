<template>
  <div class="textAlginLeft">
    <el-button-group>
      <el-button type="success" icon="el-icon-plus" size="mini" @click="showAddDialog()">添加角色</el-button>
    </el-button-group>
    <EleTable
      :list='list'
      :columns='columns'
      :operates='operates'
    ></EleTable>
  </div>
</template>
<script>
import EleTable from '@/components/EleTable/table'
import { pageRole } from '@/api/system/role'
import { timestampToTime } from '@/utils/format'
export default {
  components: {
    EleTable
  },
  created () {
    // 获取角色
    pageRole()
      .then(res => {
        this.list = res.result.records
      })
  },
  data () {
    return {
      // 角色列表数据
      list: [],

      // 表格数据展示数据key
      columns: [
        { prop: 'id', label: 'id' },
        { prop: 'name', label: '角色' },
        { prop: 'createUser', label: '创建人' },
        { prop: 'createTime', label: '创建时间', formatter: this.timestampToTimes },
        { prop: 'description', label: '备注' }
      ],

      // 表格操作按钮
      operates: {
        fixed: 'right',
        width: '120px',
        list: [
          { show: true, type: 'danger', icon: 'el-icon-delete', method: this.tabelItem },
          { show: true, type: 'info', icon: 'el-icon-edit', method: this.tabelItem }
        ]
      }
    }
  },
  methods: {
    // 表格数据选中行数据
    tabelItem (key, val) {
      console.log(val)
    },

    // 时间转化
    timestampToTimes (val, key) {
      return timestampToTime(val[key.prop])
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
