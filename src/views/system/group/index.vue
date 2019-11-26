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
      <el-button type="primary" icon="el-icon-set-up" size="mini" @click="showRoleDialog">分配角色</el-button>
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

    <!-- 角色分配复选框 开始 -->
    <el-dialog
      title="用户分配角色"
      :visible.sync="popoverVisible"
      width="300px">
      <span>
        <el-checkbox-group
          v-model="RolescheckList"
          text-color='#fff'
          fill='#00b333'
        >
          <div class="checkBox" :key='index' v-for="(item, index) in allRoles">
            <el-checkbox :label="item.id">{{item.name}}</el-checkbox>
          </div>
        </el-checkbox-group>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="popoverVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="changeRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 角色分配复选框 结束 -->
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
import { pageUser, saveOrUpdateUser, deleteUserById, isUser, assignRoles, findUserById } from '@/api/system/user'

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

      // 给用户分配角色
      roleIds: [],

      // 分配角色Popover 弹出框 显示 隐藏
      popoverVisible: false,

      // 复选框选中角色Array
      RolescheckList: [],

      // 表格数据选中list
      userList: []
    }
  },
  methods: {
    // 时间转化
    timestampToTimes (val, key) {
      return timestampToTime(val[key.prop])
    },

    // 表格多行选中 分配角色
    handleSelectionChange (val) {
      this.userList = val
      if (val.length === 1) {
        this.userId = val[0].id
      }
    },

    // 判断登录账号是否唯一
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
    },

    // 修改用户角色
    async changeRole () {
      this.roleIds = this.RolescheckList.join(',')
      await assignRoles({ roleIds: this.roleIds, userId: this.userId })
        .then(res => {
          this.tip('角色分配成功', 'success')
        })
        .catch(error => {
          console.error(error)
          this.tip('角色分配失败', 'error')
        })
      this.popoverVisible = false
    },

    // 显示角色弹框
    showRoleDialog () {
      // 判断表格是否选中
      if (this.userList.length === 1) {
        this.popoverVisible = true
        this.RolescheckList = []
        // 获取用户角色信息
        findUserById({ id: this.userId })
          .then(res => {
            res.result.forEach(item => {
              this.RolescheckList.push(item)
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
