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
      <el-button type="success" icon="el-icon-plus" size="mini" @click="showAddDialog">添加</el-button>
      <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteIds(groupList)">批量删除</el-button>
    </el-button-group>

    <!-- 操作数据按钮 结束 -->

    <!-- 表格+分页 开始 -->
    <EleTable
      :Radio='true'
      :list='list'
      :columns='columns'
      :operates='operates'
      :options='options'
      :total='total'
      :currentPage='currentPage'
      :page-sizes='pageSizes'
      :pageSize='pageSize'
      @handleSelectionChange='handleSelectionChange'
      @handleSizeChange='handleSizeChange'
      @handleCurrentChange='handleCurrentChange'
    ></EleTable>
    <!-- 表格+分页 结束 -->

    <!-- 表格数据编辑， 添加用户弹出层 开始 -->
    <DialogForm
      :options='Dialogoptions'
      :formLists='formLists'
      :dataForm='dataForm'
      :formAttr='formAttr'
      :isAdd='isAdd'
      @confirm='confirm'
      @change='changeDia'
      @blur='blur'
      ref="DialogForm"
    ></DialogForm>
    <!-- 表格数据编辑， 添加用户弹出层 结束 -->
  </div>
<!-- root element -->
</template>
<script>
// 混入
import tabelData from '@/mixins/tabelData'

// 组件
import EleTable from '@/components/EleTable/table'
import Search from '@/components/Search/search'
import DialogForm from '@/components/DialogForm/DialogForm'

// 方法
import { timestampToTime } from '@/utils/format'
import { mapGetters } from 'vuex'

// API
import { pageGroup, saveOrUpdateGroup, deleteGroupById, isGroup } from '@/api/group/group'

export default {
  components: {
    EleTable,
    Search,
    DialogForm
  },
  mixins: [tabelData],
  computed: {
    ...mapGetters(['allRoles', 'allUsers'])
  },
  created () {
    // 获取用户
    this.getTabelData(this.initDataFn)
  },
  data () {
    return {
      // 获取表格数据函数 initDataFn
      initDataFn: pageGroup,

      // 编辑用户
      editDataFn: saveOrUpdateGroup,

      // 新增用户
      addDataFn: saveOrUpdateGroup,

      // 删除用户
      deleteDataFn: deleteGroupById,

      // 表格数据展示数据key
      columns: [
        { prop: 'name', label: '组名' },
        { prop: 'createTime', label: '创建时间', formatter: this.timestampToTimes },
        { prop: 'createUser', label: '创建人', formatter: this.formatUsers },
        { prop: 'updateTime', label: '更新时间', formatter: this.timestampToTimes },
        { prop: 'updateUser', label: '更新人', formatter: this.formatUpdataUsers },
        { prop: 'synopsis', label: '备注' }
      ],

      // 表格操作按钮 (混入数据包含该数据 ，添加其他配置重新覆盖即可)
      operates: {
        fixed: 'right',
        width: '200px',
        list: [
          { show: true, type: 'danger', icon: 'el-icon-delete', method: this.tabelDelete, title: '删除' }, // 操作按钮 删除
          { show: true, type: 'info', icon: 'el-icon-edit', method: this.tabeledit, title: '编辑' } // 编辑按钮
        ]
      },

      // 搜索配置
      searchOptions: { // 最低能见度统计
        type: [
          {
            type: 'input', // 搜索框类型
            name: '搜索', // 搜索label
            queryname: 'name', // 搜索字段
            query: null, // v-model值
            placeholder: '请输入组名', // 提示
            callback: this.change // input框值改变时
          }
        ]
      },

      // 编辑 添加 (混入数据包含该数据 ，修改初始状态，覆盖即可)
      isAdd: false,

      // 弹出层配置文件
      Dialogoptions: {
        title: '设备分组', // 弹框标题
        width: '590px', // 弹框宽度
        dialogVisible: false, // 弹框默认显示，隐藏状态属性
        inline: false // 表单是否为内联
      },

      // 弹出层表单配置文件 不建议表格与弹框使用一个对象
      formLists: [
        { model: 'name', label: '组名', placeholder: '请输入用户名', blur: this.isOnlyCode },
        { model: 'synopsis', label: '备注', placeholder: '请输入备注' }
      ],

      // 表单验证规则
      formAttr: {
        rules: {
          name: [
            { required: true, message: '请输入组名', trigger: 'blur' }
          ]
        },
        labelWidth: null
      },

      // 弹出层表单数据
      dataForm: {
        'name': null,
        'synopsis': null
      },

      // 表格选中数据
      groupList: []
    }
  },
  methods: {
    // 时间转化
    timestampToTimes (val, key) {
      return timestampToTime(val[key.prop])
    },

    // 表格多行选中 分配角色
    handleSelectionChange (val) {
      this.groupList = val
    },

    // 判断分组重复是否唯一
    isOnlyCode (key, val) {
      isGroup({ name: val[key] })
        .then(res => {
          if (res.result === true) {
            // 提示分组重复重复
            this.$message({
              type: 'warning',
              message: '分组重复'
            })
          }
        })
        .catch(error => {
          console.error(error)
        })
    },

    // 表格转换创建人，
    formatUsers (val) {
      let index = this.allUsers.findIndex(item => {
        return item.id === val.createUser
      })
      if (index > -1) {
        return this.allUsers[index].name
      } else {
        return null
      }
    },

    // 更新人数据
    formatUpdataUsers (val) {
      let index = this.allUsers.findIndex(item => {
        return item.id === val.updateUser
      })
      if (index > -1) {
        return this.allUsers[index].name
      } else {
        return null
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.checkBox{
  padding-left: 20px;
  line-height: 30px;
}
</style>
