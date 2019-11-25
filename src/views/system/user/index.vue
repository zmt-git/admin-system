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

    <!-- 角色分配复选框 开始 -->
      <div></div>
    <!-- 角色分配复选框 结束 -->

    <!-- 操作数据按钮 结束 -->

    <!-- 表格+分页 开始 -->
    <EleTable
      :Radio='true'
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
import { pageUser, saveOrUpdateUser, deleteUserById, isUser, assignRoles } from '@/api/system/user'

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
      initDataFn: pageUser,

      // 编辑用户
      editDataFn: saveOrUpdateUser,

      // 新增用户
      addDataFn: saveOrUpdateUser,

      // 删除用户
      deleteDataFn: deleteUserById,

      // 表格数据展示数据key
      columns: [
        { prop: 'name', label: '用户名' },
        { prop: 'username', label: '登录名' },
        { prop: 'creatTime', label: '创建时间', formatter: this.timestampToTimes },
        { prop: 'updateTime', label: '更新时间', formatter: this.timestampToTimes },
        { prop: 'creatUserId', label: '创建人', formatter: this.formatUsers },
        { prop: 'updateUserId', label: '更新人', formatter: this.formatUsers },
        { prop: 'synopsis', label: '备注' }
      ],

      // 表格操作按钮 (混入数据包含该数据 ，添加其他配置重新覆盖即可)
      operates: {
        fixed: 'right',
        width: '200px',
        list: [
          { show: true, type: 'danger', icon: 'el-icon-delete', method: this.tabelDelete, popover: true, visible: false }, // 操作按钮 删除
          { show: true, type: 'info', icon: 'el-icon-edit', method: this.tabeledit } // 编辑按钮
        ]
      },

      // 搜索配置
      searchOptions: { // 最低能见度统计
        type: [
          {
            type: 'input', // 搜索框类型
            name: '搜索', // 搜索label
            queryname: 'username', // 搜索字段
            query: null, // v-model值
            placeholder: '请输入登录名', // 提示
            callback: this.change // input框值改变时
          }
        ]
      },

      // 编辑 添加 (混入数据包含该数据 ，修改初始状态，覆盖即可)
      isAdd: false,

      // 弹出层配置文件
      Dialogoptions: {
        title: '用户', // 弹框标题
        width: '590px', // 弹框宽度
        dialogVisible: false, // 弹框默认显示，隐藏状态属性
        inline: false // 表单是否为内联
      },

      // 弹出层表单配置文件 不建议表格与弹框使用一个对象
      formLists: [
        { model: 'name', label: '用户名', placeholder: '请输入用户名' },
        { model: 'username', label: '登录名', placeholder: '请输入登录名', blur: this.isOnlyCode },
        { model: 'password', label: '密码', placeholder: '请输入密码', type: 'password' },
        { model: 'synopsis', label: '备注', placeholder: '请输入备注' }
      ],

      // 表单验证规则
      formAttr: {
        rules: {
          name: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          username: [
            { required: true, message: '请输入登录账户', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入登录密码', trigger: 'blur' }
          ]
        },
        labelWidth: null
      },

      // 弹出层表单数据
      dataForm: {
        'id': null,
        'name': null,
        'password': null,
        'username': null,
        'synopsis': null
      },

      // 批量给用户分配角色
      roleIds: ''
    }
  },
  methods: {
    // 时间转化
    timestampToTimes (val, key) {
      return timestampToTime(val[key.prop])
    },

    // 表格多行选中 分配角色
    handleSelectionChange (val) {
      if (val.length > 0) {
        let ids = []
        val.forEach(item => {
          ids.push(item.id)
        })
        ids = ids.join(',')
        this.roleIds = ids
      }
      assignRoles({ roleIds: this.roleIds })
        .then(res => {
          this.tip('角色分配成功', 'success')
        })
        .then(error => {
          console.error(error)
          this.tip('角色分配失败', 'error')
        })
    },

    // 判断登录桩号是否唯一
    isOnlyCode (key, val) {
      isUser({ username: val[key] })
        .then(res => {
          if (res.result === true) {
            // 提示登录账户重复
            this.$message({
              type: 'warning',
              message: '登录名重复'
            })
          }
        })
        .catch(error => {
          console.error(error)
        })
    },

    // 表格转换创建人， 更新人数据
    formatUsers (val) {
      let index = this.allUsers.findIndex(item => {
        return item.id === val.id
      })
      return this.allUsers[index].name
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
