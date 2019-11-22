<template>
  <div>
    <el-button-group>
      <el-button type="primary" icon="el-icon-share" size="mini" @click="showAddDialog()">添加</el-button>
    </el-button-group>
    <EleTable
      :list='list'
      :columns='columns'
    ></EleTable>
  </div>
</template>
<script>
import EleTable from '@/components/EleTable/table'
import { findAllRole } from '@/api/system/role'
export default {
  components: {
    EleTable
  },
  created () {
    // 获取角色
    findAllRole()
      .then(res => {
        this.list = res.result
        console.log(this.list)
      })
  },
  data () {
    return {
      // 角色列表数据
      list: [],

      // 表格数据展示数据key
      columns: [
        { prop: 'id', label: 'id' },
        { prop: 'name', label: '角色' }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
