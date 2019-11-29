<template>
<div class="textAlginLeft">
  <!-- 表格数据搜索 开始 -->
    <Search
    :options='searchOptions'
    @toQuery='toQuery'
    ></Search>
  <!-- 表格数据搜索 结束 -->
  <!-- 添加按钮开始 -->
  <el-button-group>
    <el-button type="success" icon="el-icon-plus" size="mini" @click="showAddDialog">添加</el-button>
    <el-button type="warning" size="mini" @click="showGrounpDialog"><i class="iconfont icon-shebeifenzuxiangqing iconBtn"></i>批量分组分配</el-button>
    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteIds(ledList)">批量删除</el-button>
  </el-button-group>
  <!-- 添加按钮结束 -->

  <!-- 表格+分页 开始 -->
  <EleTable
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

  <!-- 控制激光灯弹框  开始 -->
  <Control :code='code' ref="Control"></Control>
  <!-- 控制激光灯弹框  结束 -->

  <!-- 激光灯状态弹框  开始 -->
  <el-dialog
    title="激光灯状态"
    :visible.sync="dialogState"
    width="610px"
  >
    <EleTable
    :list='listState'
    :columns='columnsState'
    :options='optionsState'
  ></EleTable>
  </el-dialog>
  <!-- 激光灯状态弹框  结束 -->
  <!-- 分配分组 开始 -->
  <Group
    :options='groupOptions'
    :itemLists='allGroups'
    @confirmCheck='confirmCheck'
  ></Group>
  <!-- 分配分组 结束 -->
</div>
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
// API
import { getMainControl, saveOrUpdate, deleteByIds, isCode } from '@/api/led/controller'
import { assignDevice } from '@/api/group/group'
// 方法
import { timestampToTime } from '@/utils/format'
import { mapGetters } from 'vuex'
export default {
  components: {
    EleTable,
    Search,
    DialogForm,
    Control,
    Group
  },
  computed: {
    ...mapGetters(['allGroups'])
  },
  mixins: [tabelData],
  watch: {
    allGroups (newval, oldval) {
      this.setSelectOptions(this.formLists, 'groupIds', newval)
    }
  },
  data () {
    return {
      // 获取数据函数 字段必须为initData
      initDataFn: getMainControl,
      // 编辑用户
      editDataFn: saveOrUpdate,

      // 新增用户
      addDataFn: saveOrUpdate,

      // 删除用户
      deleteDataFn: deleteByIds,
      // 表格列表数据
      list: [],
      // 表格数据展示数据key
      columns: [
        { prop: 'location', label: '安装位置' },
        { prop: 'code', label: '灯组编号' },
        { prop: 'lampNum', label: '激光灯数量（个）' },
        { prop: 'model', label: '型号' },
        { prop: 'createTime', label: '安装时间', formatter: this.timestampToTimes },
        { prop: 'note', label: '备注' }
      ],
      // 表格操作按钮
      operates: {
        fixed: 'right',
        width: '200px',
        list: [
          { show: true, type: 'danger', title: '删除', icon: 'el-icon-delete', method: this.tabelDelete, popover: true, visible: false },
          { show: true, type: 'info', title: '编辑', icon: 'el-icon-edit', method: this.tabeledit },
          { show: true, type: 'success', title: '激光灯控制', icon: 'el-icon-setting', method: this.control },
          { show: true, type: 'warning', title: '查看激光灯状态', icon: 'el-icon-view', method: this.controlState }
        ]
      },
      // 激光灯状态表格
      listState: [], // 数据
      columnsState: [
        { prop: 'location', label: '安装位置', align: 'center' },
        { prop: 'code', label: '灯组编号', align: 'center' },
        { prop: 'lampNum', label: '激光灯数量（个）', align: 'center' },
        { prop: 'createTime', label: '安装时间', align: 'center', formatter: this.timestampToTimes }
      ],
      optionsState: {
        stripe: false, // 是否为斑马纹 table
        highlightCurrentRow: false, // 是否要高亮当前行
        loading: true, // 是否添加表格loading加载动画
        mutiSelect: false, // 是否支持列表项选中功能
        height: '20px',
        border: true,
        padding: '5px 0',
        hasPagination: false
      },
      tableLoading: ['options', 'optionsState'],
      // 搜索配置
      searchOptions: { // 最低能见度统计
        type: [
          {
            type: 'input',
            name: '搜索',
            queryname: 'code',
            query: null,
            placeholder: '请输入编码',
            callback: this.change
          }
        ]
      },
      // 编辑 添加 (混入数据包含该数据 ，修改初始状态，覆盖即可)
      isAdd: false,
      // 弹出层配置文件
      Dialogoptions: {
        title: '灯组', // 弹框标题
        width: '590px', // 弹框宽度
        dialogVisible: false, // 弹框默认显示，隐藏状态属性
        inline: false // 表单是否为内联
      },
      // 弹出层表单配置文件 不建议表格与弹框使用一个对象
      formLists: [
        { model: 'location', label: '安装位置', placeholder: '请输入安装位置' },
        { model: 'code', label: '灯组编码', placeholder: '请输入灯组编码', blur: this.onlyCode },
        { model: 'lampNum', label: '数量', placeholder: '请输入激光灯数量' },
        { model: 'model', label: '型号', placeholder: '请输入型号' },
        { model: 'longitude', label: '经度', placeholder: '请输入经度' },
        { model: 'latitude', label: '纬度', placeholder: '请输入纬度' },
        { model: 'note', label: '备注', placeholder: '请输入备注' },
        { model: 'groupIds', label: '设备分组', type: 'select', key: 'name', value: 'id', multiple: true, collapseTags: true }
      ],
      // 表单验证规则
      formAttr: {
        rules: {
          location: [
            { required: true, message: '请输入安装位置', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '请输入灯组编码', trigger: 'blur' },
            { pattern: /^NX_LASER_[0-9]{4}/, message: '编码规则为NX_LASER_xxxx' }
          ],
          lampNum: [
            { required: true, message: '请输入数量', trigger: 'blur' },
            { type: 'number', message: '必须为数字值' }
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
      // 参数改为code
      deleteVal: true,
      // 删除主控key
      deleteKey: 'codes',
      // 弹出层表单数据
      dataForm: {
        'location': null,
        'code': null,
        'lampNum': null,
        'model': null,
        'longitude': null,
        'latitude': null,
        'note': null,
        'groupIds': null
      },
      dialogState: false, // 激光灯状态
      code: '',
      ledList: [],
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
      radio: null
    }
  },
  created () {
    // 获取用户
    this.getTabelData(this.initDataFn)
  },
  methods: {
    // 显示控制弹窗
    controlState (key, val) {
      this.code = val.code
      this.dialogState = true
    },
    // 时间转化
    timestampToTimes (val, key) {
      return timestampToTime(val[key.prop])
    },
    // 表格多行选中
    handleSelectionChange (val) {
      this.ledList = val
    },
    // 判断主控是否唯一
    onlyCode (key, value) {
      console.log(value[key])
      isCode({ code: value[key] })
        .then((res) => {
          console.log(res)
          if (res.result) {
            this.tip('编码重复', 'warning')
          } else {

          }
        }).catch((err) => {
          console.log(err)
        })
    },

    // 显示控制弹框
    control (key, val) {
      this.code = val.code
      this.$refs.Control.show()
    },

    showGrounpDialog () {
      if (this.ledList.length >= 1) {
        this.groupOptions.popoverVisible = true
        // 获取设备的分组
      } else {
        this.tip('请选中设备之后在进行分组分配', 'info')
      }
    },
    // 确定设备分组
    async confirmCheck (val) {
      let deviceList = []
      this.ledList.forEach(item => {
        deviceList.push(item.code)
      })
      deviceList = deviceList.join(',')
      let obj = {
        groupId: null,
        type: 1,
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
          console.error(err)
          this.tip('设备批量分组失败', 'error')
        })
      this.groupOptions.popoverVisible = false
    }
  }
}
</script>

<style scoped>
.main {
  width: 100%;
}
.lampBox {
  width: 100%;
  margin-bottom: 10px;
}
.lamp {
  width: 100%;
  height: 70px;
  margin-right: 10px;
  /* padding: 30px 0; */
}
.lamp:last-child {
  margin-right: 0;
}
.openTime {
  display: inline-block;
}
.fanBox {
  float: left;
}
.fanBox:last-child{
  float: right;
  margin-right: 10px;
}
.rate {
  display: inline-block;
  width: 200px;
  position: relative;
  bottom: 12px;
  left: 10px;
}
.brightness{
  float: left;
}
.brightness:last-child{
  margin-left: 30px;
}
.nessLeft{
  float: left;
}
.ness{
  float: left;
}
</style>
