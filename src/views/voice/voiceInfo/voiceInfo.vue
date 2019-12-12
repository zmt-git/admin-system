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
      <el-button type="success" v-hasBtn icon="el-icon-plus" size="mini" @click="showAddDialog">添加</el-button>
      <el-button type="warning" v-hasBtn size="mini" @click="showGrounpDialog"><i class="iconfont icon-shebeifenzuxiangqing iconBtn"></i>批量分组分配</el-button>
      <el-button type="danger" v-hasBtn icon="el-icon-delete" size="mini" @click="deleteIds(groupList)">批量删除</el-button>
      <el-button type="info" icon="el-icon-finished" size="mini" v-hasBtn @click="tests">{{testTit}}</el-button>
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
      :meta='dataForm.code'
      @confirm='confirm'
      @change='changeDia'
      @blur='blur'
      ref="DialogForm"
    ></DialogForm>
    <!-- 表格数据编辑， 添加用户弹出层 结束 -->

    <!-- 控制 开始 -->
      <Control ref="Control" :code='code'></Control>
    <!-- 控制 结束 -->

    <!-- 分配分组 开始 -->
    <Group
      :options='groupOptions'
      :itemLists='allGroups'
      @confirmCheck='confirmCheck'
    ></Group>
    <!-- 分配分组 结束 -->
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
import Group from '@/components/Group/Group'

// 方法
import { timestampToTime } from '@/utils/format'
import { mapGetters } from 'vuex'
import { startTest, stopTest } from './test'

// API
import { pageMainControl, saveOrUpdate, deleteByIds, isCode } from '@/api/voice/voiceInfo'
import { getDeviceGroup } from '@/api/system/system'
import { assignDevice } from '@/api/group/group'

export default {
  components: {
    EleTable,
    Search,
    DialogForm,
    Control,
    Group
  },
  mixins: [tabelData],
  computed: {
    ...mapGetters(['allRoles', 'allUsers', 'allGroups'])
  },
  created () {
    // 获取用户
    this.getTabelData(this.initDataFn)
    this.setSelectOptions(this.formLists, 'groupIds', this.allGroups)
    this.setSelectOptions(this.searchOptions.type, 'groupId', this.allGroups, 'queryname', 'options')
  },
  data () {
    let that = this
    let nameRule1 = async (rule, value, callback) => {
      let regExp = /^NXDS_[A-Z]{2,8}_[0-9]{4}$/
      if (regExp.test(value) === false) {
        callback(new Error('编码示例：“NXDS_XA_0001”'))
      } else {
        if (that.isAdd) {
          let result = await this.isOnlyCode(value)
          if (result) {
            callback(new Error('编码重复'))
          }
        } else {
          if (that.editVal.code !== value) {
            let result = await this.isOnlyCode(value)
            if (result) {
              callback(new Error('编码重复'))
            }
          }
        }
      }
    }
    return {
      // 查看分组
      getDeviceGroupFn: getDeviceGroup,

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
        // { prop: 'updateTime', label: '更新时间', formatter: this.timestampToTimes },
        // { prop: 'updateUserId', label: '更新人', formatter: this.formatUpdataUsers },
        { prop: 'note', label: '备注' },
        { prop: 'id', label: '分组', render: true, method: this.viewGroups, showList: [], loading: true, empty: false }
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
            clearable: true,
            name: '搜索', // 搜索label
            queryname: 'code', // 搜索字段
            query: null, // v-model值
            placeholder: '请输入编码', // 提示
            callback: this.change // input框值改变时
          },
          {
            type: 'select', // 搜索框类型
            name: null, // 搜索label
            clearable: true,
            options: [],
            optionskey: { label: 'name', value: 'id' },
            queryname: 'groupId', // 搜索字段
            query: null, // v-model值
            placeholder: '请选择分组', // 提示
            callback: this.onChangeSelect // input框值改变时
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
        { model: 'code', label: '编码', placeholder: '请输入编码' },
        { model: 'num', label: '数量', placeholder: '请输入数量', type: 'number' },
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
            { required: true, message: '请输入编码', trigger: 'blur' },
            { validator: nameRule1, trigger: 'blur' }
          ],
          num: [
            { required: true, message: '请输入数量', trigger: 'blur' }
          ],
          location: [
            { required: true, message: '请输入安装位置', trigger: 'blur' }
          ],
          longitude: [
            // eslint-disable-next-line no-useless-escape
            { pattern: /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/, message: '经度整数部分为0-180,小数部分为0到6位' }
          ],
          latitude: [
            // eslint-disable-next-line no-useless-escape
            { pattern: /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/, message: '纬度整数部分为0-90,小数部分为0到6位' }
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
      code: null,

      // 设备分组选中array
      radio: -1,

      // 设备分组选中array
      groupOptions: {
        type: 'radio',
        title: '设备分组',
        popoverVisible: false,
        width: '610px',
        label: 'id',
        name: 'name',
        disabled: false,
        showFooter: true
      },

      // 测试按钮
      testTit: '批量测试'
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
    isOnlyCode (val) {
      return isCode({ code: val })
        .then(res => {
          if (res.result === true) {
            // 提示重复
            this.$message({
              type: 'warning',
              message: '编码重复'
            })
            return true
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
    },

    // 设备分组
    showGrounpDialog () {
      if (this.groupList.length >= 1) {
        this.groupOptions.popoverVisible = true
        // 获取设备的分组
      } else {
        this.tip('请选中设备之后在进行分组分配', 'info')
      }
    },

    // 确定设备分组
    async confirmCheck (val) {
      let deviceList = []
      this.groupList.forEach(item => {
        deviceList.push(item.code)
      })
      deviceList = deviceList.join(',')
      let obj = {
        groupId: null,
        type: 2,
        deviceCodes: deviceList
      }
      if (this.groupOptions.type === 'radio') {
        this.radio = val
        delete obj.groupIds
        obj.groupId = this.radio
      } else {
        delete obj.groupId
        this.checkedList = val
        let arr = []
        arr = this.checkedList.join(',')
        obj.groupIds = arr
      }
      await assignDevice(obj)
        .then(res => {
          this.tip('设备批量分组成功', 'success')
        })
        .catch(err => {
          console.log(err)
          this.tip('设备批量分组失败', 'error')
        })
      this.groupOptions.popoverVisible = false
    },

    // 批量测试
    tests () {
      if (this.groupList.length <= 0) {
        this.tip('至少选择一组设备，进行批量测试', 'warning')
        return
      }
      if (this.testTit === '批量测试') {
        let arr = []
        this.testTit = '停止测试'
        this.groupList.forEach(item => {
          arr.push(item.code)
        })
        startTest(arr)
      } else {
        this.testTit = '批量测试'
        stopTest()
      }
    }
  },
  watch: {
    allGroups (newval, oldval) {
      this.setSelectOptions(this.formLists, 'groupIds', newval)
      this.setSelectOptions(this.searchOptions.type, 'groupId', newval, 'queryname', 'options')
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
