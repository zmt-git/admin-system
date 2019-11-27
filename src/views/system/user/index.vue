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
      <el-button type="warning" size="mini" @click="showGrounpDialog"><i class="iconfont icon-shebeifenzuxiangqing iconBtn"></i>设备组分配</el-button>
      <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteIds(userList)">批量删除</el-button>
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
      :title="dialogTitle"
      :visible.sync="popoverVisible"
      :width="checkType === 'grounp' ? '500px' : '300px'">
      <span>
        <el-checkbox-group
          v-model="checkList"
          text-color='#fff'
          fill='#00b333'
        >
          <div class="checkBox" :class="checkType === 'grounp' ? 'inlineBlock' : null" :key='index' v-for="(item, index) in checkItems">
            <el-checkbox :label="item.id">{{item.name}}</el-checkbox>
          </div>
        </el-checkbox-group>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="popoverVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmCheck(checkType)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 角色分配复选框 结束 -->
    <template>
  <el-time-picker
    is-range
    v-model="value1"
    range-separator="至"
    start-placeholder="开始时间"
    end-placeholder="结束时间"
    placeholder="选择时间范围">
  </el-time-picker>
  <el-time-picker
    is-range
    arrow-control
    v-model="value2"
    range-separator="至"
    start-placeholder="开始时间"
    end-placeholder="结束时间"
    placeholder="选择时间范围">
  </el-time-picker>
</template>
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
import { pageUser, saveOrUpdateUser, deleteUserById, isUser, assignRoles, getUserGroup, getUserRole, assignGroup } from '@/api/system/user'

export default {
  components: {
    EleTable,
    Search,
    DialogForm
  },
  mixins: [tabelData],
  computed: {
    ...mapGetters(['allRoles', 'allUsers', 'allGroups'])
  },
  created () {
    // 获取用户
    this.getTabelData(this.initDataFn)
  },
  data () {
    return {
      value1: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
      value2: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
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
        { prop: 'name', label: '名称' },
        { prop: 'username', label: '用户名' },
        { prop: 'creatUserId', label: '创建人', formatter: this.formatUsers },
        { prop: 'creatTime', label: '创建时间', formatter: this.timestampToTimes },
        { prop: 'updateUserId', label: '更新人', formatter: this.formatUpdataUsers },
        { prop: 'updateTime', label: '更新时间', formatter: this.timestampToTimes },
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
            queryname: 'username', // 搜索字段
            query: null, // v-model值
            placeholder: '请输入用户名', // 提示
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
        { model: 'name', label: '名称', placeholder: '请输入名称' },
        { model: 'username', label: '用户名', placeholder: '请输入用户名', blur: this.isOnlyCode },
        { model: 'password', label: '密码', placeholder: '请输入密码', type: 'password' },
        { model: 'synopsis', label: '备注', placeholder: '请输入备注' }
      ],

      // 表单验证规则
      formAttr: {
        rules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
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

      // 给用户分配设备组
      grounpIds: [],

      // 分配角色Popover 弹出框 显示 隐藏
      popoverVisible: false,

      // 复选框选中Array
      checkList: [],

      // 复选框循环数据
      checkItems: [],

      // 复选框title
      dialogTitle: '',

      // 复选框类型
      checkType: null,

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

    // 表格转换创建人，
    formatUsers (val) {
      let index = this.allUsers.findIndex(item => {
        return item.id === val.creatUserId
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
        return item.id === val.updateUserId
      })
      if (index > -1) {
        return this.allUsers[index].name
      } else {
        return null
      }
    },

    // 修改用户角色， 设备分组
    async confirmCheck () {
      console.log(this.checkList)
      let arr = []
      // this.checkList.forEach(item => {
      //   arr.push(item.id)
      // })
      if (this.checkType === 'role') {
        this.roleIds = arr
        await assignRoles({ roleIds: this.roleIds, userId: this.userId })
          .then(res => {
            this.tip('角色分配成功', 'success')
          })
          .catch(error => {
            console.error(error)
            this.tip('角色分配失败', 'error')
          })
      } else if (this.checkType === 'grounp') {
        this.grounpIds = arr.join(',')
        await assignGroup({ groupIds: this.grounpIds, userId: this.userId })
          .then(res => {
            this.tip('设备组分配成功', 'success')
          })
          .catch(error => {
            console.error(error)
            this.tip('设备组分配失败', 'error')
          })
      }
      this.popoverVisible = false
    },

    // 显示角色弹框
    showRoleDialog () {
      // 判断表格是否选中
      if (this.userList.length === 1) {
        this.popoverVisible = true
        this.checkType = 'role'
        this.checkList = []
        this.checkItems = this.allRoles
        this.dialogTitle = '用户分配角色'
        // 获取用户角色信息
        getUserRole({ userId: this.userId })
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
    },

    // 用户分组分配
    showGrounpDialog () {
      // 判断表格是否选中
      if (this.userList.length === 1) {
        this.popoverVisible = true
        this.checkType = 'grounp'
        this.checkList = []
        this.checkItems = this.allGroups
        this.dialogTitle = '用户分配设备组'

        // 获取用户分组信息
        getUserGroup({ id: this.userId })
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
.inlineBlock{
  display: inline-block;
}
</style>
