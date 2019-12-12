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
      :meta='dataForm.enName'
      @confirm='confirm'
      @change='changeDia'
      @blur='blur'
      ref="DialogForm"
    ></DialogForm>
    <!-- 表格数据编辑， 添加用户弹出层 结束 -->

    <!-- 角色资源授权 开始 -->
    <el-dialog
      :visible.sync="resvisible"
      :close-on-click-modal='false'
      title="资源授权"
      width="600px"
      label-width="80px">
      <div v-text="rolenames" class="user-div"></div>
      <div style="height:1px;width: 100%;background-color: #989898;margin: 5px auto;">&nbsp;</div>
      <div class="ztree_box custom-scroll">
        <ul id="res-tree" class="ztree" style="margin-top: 5px;height:400px;overflow: auto;"></ul>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="resvisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="changeRrsource">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 角色资源授权 结束 -->
  </div>
<!-- root element -->
</template>
<script>
import 'jquery'
import 'ztree'
import 'ztree/css/metroStyle/metroStyle.css'
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
import { pageRole, saveOrUpdateRole, isRole, deleteRoleById, assignResources, getTreeResourceByRole } from '@/api/system/role'
import { getTreeResource } from '@/api/system/system'
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
    let that = this
    let validatePass = async (rule, value, callback) => {
      if (this.regEnglish.test(value)) {
        callback(new Error('角色名必须为英文字母'))
      } else {
        if (that.isAdd) {
          let result = await this.isOnlyCode(value)
          if (result) {
            callback(new Error('角色名重复'))
          }
        } else {
          if (that.editVal.enName !== value) {
            let result = await this.isOnlyCode(value)
            if (result) {
              callback(new Error('角色名重复'))
            }
          }
        }
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
        { prop: 'updateUser', label: '更新人', formatter: this.formatUpdataUsers },
        { prop: 'updateTime', label: '更新时间', formatter: this.timestampToTimes },
        { prop: 'description', label: '备注' }
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
            queryname: 'enName', // 搜索字段
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
        { model: 'enName', label: '角色名', placeholder: '请输入角色名' },
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

      // 表格数据选中list
      rolesList: [],

      // 角色id
      roleId: '',

      // ztree配置
      loading: false,
      resvisible: false,
      roleIds: '',
      rolenames: '',
      setting: {
        check: {
          enable: true
        },
        callback: {
          onClick: this.treeClick
        }
      },
      zNodes: [],
      clickId: '',
      treeNode: {},
      tree: {},
      treeArr: [],
      tree2Arr: []
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
    isOnlyCode (val) {
      isRole({ enName: val })
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
          console.log(error)
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
    },

    // 显示资源授权弹框
    showResourceDialog () {
      // 判断表格是否选中
      if (this.rolesList.length === 1) {
        this.resvisible = true
        this.init()
      } else {
        if (this.rolesList.length > 1) {
          this.tip('每次只能对一个角色进行资源授权', 'info')
        } else {
          this.tip('请选中角色之后在进行资源授权', 'info')
        }
      }
    },

    // 比较树形结构差异
    compareDiffForTree (tree2 = [], zTree, arr = []) {
      let that = this
      tree2.forEach(ele => {
        arr.push(ele.id)
        if (!!ele.children && ele.children.length > 0) {
          ele.children.forEach((item, index) => {
            arr.push(item.id)
            if (!!item.children && item.children.length > 0) {
              that.compareDiffForTree(item.children, zTree, arr)
            }
          })
        }
      })
    },

    // 初始化树形结构
    async init () {
      let that = this
      this.treeArr = []
      this.tree2Arr = []
      let arr = []
      await getTreeResource()
        .then(res => {
          arr = res.result
        }).catch(err => {
          console.log('error:' + err)
          console.log(err)
        })
      this.zNodes = []
      this.zNodes.push(...arr)
      // eslint-disable-next-line no-undef
      this.tree = $.fn.zTree.init($('#res-tree'), that.setting, that.zNodes)
      let node = this.tree.getNodeByParam('id', 0)
      this.tree.expandNode(node, true, false, false)
      let nodes = this.tree.getNodes()
      this.compareDiffForTree(nodes, this.tree, this.treeArr)
      await getTreeResourceByRole({ roleId: this.roleId })
        .then(res => {
          this.compareDiffForTree(res.result, this.tree, this.tree2Arr)
        }).catch(err => {
          console.log('error:' + err)
          console.log(err)
        })
      this.treeArr.forEach(item => {
        let node = this.tree.getNodeByParam('id', item)
        if (this.tree2Arr.includes(item)) {
          this.tree.checkNode(node, true, true, false)
        } else {
          this.tree.checkNode(node, false, true, false)
        }
        this.tree.updateNode(node)
      })
    },

    // 树形结构点击事件
    treeClick: function (event, treeId, treeNode, clickFlag) {
      this.clickId = treeNode.id
      this.treeNode = treeNode
    },

    // 授权该角色资源
    async changeRrsource () {
      // 选中
      var checkedNodes = this.tree.getCheckedNodes(true)
      var checkedIds = []
      for (var i = 0; i <= checkedNodes.length - 1; i++) {
        checkedIds.push(checkedNodes[i].id)
      }
      if (checkedNodes.length === 0) {
        this.$message.error('请选择要授权的资源')
        return
      }
      this.loading = true
      await assignResources({ resourceIds: checkedIds.join(','), roleId: this.roleId })
        .then(res => {
          this.loading = false
          this.tip('资源授权成功', 'success')
        })
        .catch(err => {
          this.tip('资源授权失败', 'error')
          console.log(err)
        })
      this.resvisible = false
    },

    // 隐藏授权资源弹框
    cancel () {
      this.resvisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.checkBox{
  padding-left: 20px;
  line-height: 30px;
}
.user-div{
  margin: 0;
  padding: 0;
  color: #3a8ee6;
}
.custom-scroll{
  height: 420px;
  line-height: 420px;
  margin-top:5px;
  padding-top: 0;
  overflow: auto;
}
</style>
