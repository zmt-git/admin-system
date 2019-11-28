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
      :list='list'
      :columns='columns'
      :operates='operates'
      :total='total'
      :options='options'
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

    <!-- 控制 开始 -->
      <Control ref="Control" :code='code'></Control>
    <!-- 控制 结束 -->
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
import Control from '../components/Control/Control'

// 方法
import { timestampToTime } from '@/utils/format'
import { mapGetters } from 'vuex'

// API
import { pageMainControl, saveOrUpdate, deleteByIds, isCode } from '@/api/voice/voiceInfo'

export default {
  components: {
    EleTable,
    Search,
    DialogForm,
    Control
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
      // 获取表格数据函数 initDataFn
      initDataFn: pageMainControl,

      // 编辑用户
      editDataFn: saveOrUpdate,

      // 新增用户
      addDataFn: saveOrUpdate,

      // 删除用户
      deleteDataFn: deleteByIds,

      // 表格数据展示数据key
      columns: [
        { prop: 'code', label: '编码' },
        { prop: 'num', label: '数量' },
        { prop: 'latitude', label: '纬度' },
        { prop: 'longitude', label: '经度' },
        { prop: 'model', label: '型号' },
        { prop: 'location', label: '安装位置' },
        { prop: 'createTime', label: '创建时间', formatter: this.timestampToTimes },
        { prop: 'createUserId', label: '创建人', formatter: this.formatUsers },
        { prop: 'updateTime', label: '更新时间', formatter: this.timestampToTimes },
        { prop: 'updateUserId', label: '更新人', formatter: this.formatUpdataUsers },
        { prop: 'note', label: '备注' }
      ],

      // 表格操作按钮 (混入数据包含该数据 ，添加其他配置重新覆盖即可)
      operates: {
        fixed: 'right',
        width: '200px',
        list: [
          { show: true, type: 'danger', icon: 'el-icon-delete', method: this.tabelDelete, title: '删除' }, // 操作按钮 删除
          { show: true, type: 'info', icon: 'el-icon-edit', method: this.tabeledit, title: '编辑' }, // 编辑按钮
          { show: true, type: 'success', icon: 'el-icon-setting', method: this.control, title: '设备控制' } // 设备控制
        ]
      },

      // 搜索配置
      searchOptions: { // 最低能见度统计
        type: [
          {
            type: 'input', // 搜索框类型
            name: '搜索', // 搜索label
            queryname: 'code', // 搜索字段
            query: null, // v-model值
            placeholder: '请输入编码', // 提示
            callback: this.change // input框值改变时
          }
        ]
      },

      // 编辑 添加 (混入数据包含该数据 ，修改初始状态，覆盖即可)
      isAdd: false,

      // 弹出层配置文件
      Dialogoptions: {
        title: '语音避险', // 弹框标题
        width: '610px', // 弹框宽度
        dialogVisible: false, // 弹框默认显示，隐藏状态属性
        inline: false // 表单是否为内联
      },

      // 弹出层表单配置文件 不建议表格与弹框使用一个对象=
      formLists: [
        { model: 'code', label: '编码', placeholder: '请输入编码', blur: this.isOnlyCode },
        { model: 'num', label: '数量', placeholder: '请输入数量' },
        { model: 'latitude', label: '纬度', placeholder: '请输入纬度' },
        { model: 'longitude', label: '经度', placeholder: '请输入经度' },
        { model: 'model', label: '型号', placeholder: '请输入型号' },
        { model: 'location', label: '安装位置', placeholder: '请输入安装位置' },
        { model: 'note', label: '备注', placeholder: '请输入备注' },
        { model: 'groupIds', label: '设备分组', placeholder: '请输入备注', type: 'select', key: 'name', value: 'id', multiple: true, collapseTags: true }
      ],

      // 表单验证规则
      formAttr: {
        rules: {
          code: [
            { required: true, message: '请输入编码', trigger: 'blur' }
          ],
          groupIds: [
            { required: true, message: '请选择设备分组', trigger: 'change' }
          ]
        },
        labelWidth: null
      },

      // 弹出层表单数据
      dataForm: {
        'code': null,
        'num': null,
        'latitude': null,
        'longitude': null,
        'model': null,
        'location': null,
        'note': null,
        'groupIds': null
      },

      // 表格选中数据
      groupList: [],

      // 删除key
      deleteKey: 'codes',

      // formatTypes 表但提交数据转换
      formatTypes: this.formatTypesFn,

      // 转换参数 转换数据之前，须将此属性设置为true
      isformat: true,

      // 参数改为code
      deleteVal: true,

      // 主控code
      code: null
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
      isCode({ code: val[key] })
        .then(res => {
          if (res.result === true) {
            // 提示重复
            this.$message({
              type: 'warning',
              message: '编码重复'
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
    },

    // 转化表单提交数据
    formatTypesFn () {
      let arr = this.dataForm.groupIds
      arr = arr.join(',')
      let obj = JSON.parse(JSON.stringify(this.dataForm))
      obj.groupIds = arr
      return obj
    },

    // 语音避险主控控制
    control (key, val) {
      this.code = val.code
      this.$refs.Control.show()
    }
  },
  watch: {
    allGroups (newval, oldval) {
      this.setSelectOptions(this.formLists, 'groupIds', newval)
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
