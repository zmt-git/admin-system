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
      <el-button type="warning" size="mini" @click="showResourceDialog"><i class="iconfont iconBtn icon-icon-35"></i>资源授权</el-button>
      <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteIds(rolesList)">批量删除</el-button>
    </el-button-group>

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

    <!-- 角色资源授权 开始 -->
    <el-dialog
      title="角色分配资源"
      :visible.sync="popoverVisible"
      width="300px">
      <span>

      </span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="popoverVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="changeRrsource">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 角色资源授权 结束 -->
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
import { pageRole, saveOrUpdateRole, isRole, deleteRoleById, assignResources } from '@/api/system/role'

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
    let validatePass = (rule, value, callback) => {
      if (this.regEnglish.test(value)) {
        callback(new Error('角色名必须为英文字母'))
      } else {
        callback()
      }
    }
    return {
      regEnglish: /z-aZ-a/,
      // 获取表格数据函数 initDataFn
      initDataFn: pageRole,

      // 编辑用户
      editDataFn: saveOrUpdateRole,

      // 新增用户
      addDataFn: saveOrUpdateRole,

      // 删除用户
      deleteDataFn: deleteRoleById,

      // 表格数据展示数据key
      columns: [
        { prop: 'name', label: '名称' },
        { prop: 'enName', label: '角色名' },
        { prop: 'createUser', label: '创建人', formatter: this.formatUsers },
        { prop: 'createTime', label: '创建时间', formatter: this.timestampToTimes },
        { prop: 'updateUser', label: '更新人', formatter: this.formatUsers },
        { prop: 'updateTime', label: '更新时间', formatter: this.timestampToTimes },
        { prop: 'description', label: '备注' }
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
            placeholder: '请输入角色名', // 提示
            callback: this.change // input框值改变时
          }
        ]
      },

      // 编辑 添加 (混入数据包含该数据 ，修改初始状态，覆盖即可)
      isAdd: false,

      // 弹出层配置文件
      Dialogoptions: {
        title: '角色', // 弹框标题
        width: '590px', // 弹框宽度
        dialogVisible: false, // 弹框默认显示，隐藏状态属性
        inline: false // 表单是否为内联
      },

      // 弹出层表单配置文件 不建议表格与弹框使用一个对象
      formLists: [
        { model: 'name', label: '名称', placeholder: '请输入名称' },
        { model: 'enName', label: '角色名', placeholder: '请输入角色名', blur: this.isOnlyCode },
        { model: 'description', label: '备注', placeholder: '请输入备注' }
      ],

      // 表单验证规则
      formAttr: {
        rules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          enName: [
            { required: true, message: '请输入角色名', trigger: 'blur' },
            { validator: validatePass, trigger: 'blur' }
          ]
        },
        labelWidth: null
      },

      // 弹出层表单数据
      dataForm: {
        'name': null,
        'enName': null,
        'description': null
      },

      // 角色分配资源
      resourcesIds: [],

      // 分配资源弹出框 显示 隐藏
      popoverVisible: false,

      // 表格数据选中list
      rolesList: [],

      // 角色id
      roleId: ''
    }
  },
  methods: {
    // 时间转化
    timestampToTimes (val, key) {
      return timestampToTime(val[key.prop])
    },

    // 表格多行选中 分配角色
    handleSelectionChange (val) {
      this.rolesList = val
      if (val.length === 1) {
        this.roleId = val[0].id
      }
    },

    // 判断角色是否唯一
    isOnlyCode (key, val) {
      isRole({ enName: val[key] })
        .then(res => {
          if (res.result === true) {
            // 提示登录账户重复
            this.$message({
              type: 'warning',
              message: '角色名重复'
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
      if (index > -1) {
        return this.allUsers[index].name
      } else {
        return null
      }
    },

    // 修改角色资源
    async changeRrsource () {
      this.resourcesIds = this.RolescheckList.join(',')
      await assignResources({ resourceIds: this.resourcesIds, roleId: this.roleId })
        .then(res => {
          this.tip('角色分配成功', 'success')
        })
        .catch(error => {
          console.error(error)
          this.tip('角色分配失败', 'error')
        })
      this.popoverVisible = false
    },

    // 显示资源授权弹框
    showResourceDialog () {
      // 判断表格是否选中
      if (this.rolesList.length === 1) {
        this.popoverVisible = true
        this.checkType = 'grounp'
        this.checkList = []
        this.checkItems = this.allGroups
        this.dialogTitle = '用户分配设备组'

        // 获取角色资源
        findUserById({ id: this.userId })
          .then(res => {
            res.result.forEach(item => {
              this.checkList.push(item)
            })
          })
          .catch(error => {
            console.log(error)
          })
      } else {
        if (this.userList.length > 1) {
          this.tip('每次只能对一个用户进行角色分配', 'info')
        } else {
          this.tip('请选中用户之后在进行分配角色', 'info')
        }
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
