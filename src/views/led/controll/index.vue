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
    <el-button type="primary" icon="el-icon-share" size="mini" @click="showAddDialog()">添加</el-button>
  </el-button-group>
  <!-- 添加按钮结束 -->

  <!-- 表格+分页 开始 -->
  <EleTable
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
  <!-- 控制激光灯弹框  开始 -->
  <el-dialog
    title="激光灯控制"
    :visible.sync="dialogVisible"
    width="80%">
    <div class="main">
      <ul class="lampBox">
        <li class="lamp">
          <div class="openTime">
            <span>开关灯时间设置</span>
            <el-time-picker
              v-model="value1"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围">
            </el-time-picker>
          </div>
          <el-button type="primary" size="mini" style="display: inline-block" @click="syncTime()">同步时间</el-button>
        </li>
        <li class="lamp">
          <!-- 风扇开关 -->
          <span>风扇开关</span>
          <el-switch
            style="display: block"
            v-model="fanVal"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeFan"
            active-text="开"
            inactive-text="关">
          </el-switch>
          <!-- 风扇自动/手动 -->
          <el-radio-group v-model="radio1" size="mini" @change="changeAuto">
            <el-radio-button label="自动"></el-radio-button>
            <el-radio-button label="手动"></el-radio-button>
          </el-radio-group>
          <!-- 风扇调速 -->
          <div class="block">
            <span class="demonstration">默认</span>
            <el-slider v-model="fanNumber" :disabled='this.disabled' @change="changeFanNumber"></el-slider>
          </div>
        </li>
        <li class="lamp">

        </li>
        <li class="lamp">

        </li>
      </ul>
    </div>
  </el-dialog>
  <!-- 控制激光灯弹框  结束 -->
</div>
</template>

<script>
// 混入
import tabelData from '@/mixins/tabelData'
// 组件
import EleTable from '@/components/EleTable/table'
import Search from '@/components/Search/search'
import DialogForm from '@/components/DialogForm/DialogForm'
// API
import { getMainControl, saveOrUpdate, deleteByIds, isCode, setTime, setFan, autoFan } from '@/api/led/controller'
// 方法
import { timestampToTime } from '@/utils/format'
import { mapGetters } from 'vuex'
export default {
  components: {
    EleTable,
    Search,
    DialogForm
  },
  computed: {
    ...mapGetters(['allUsers'])
  },
  mixins: [tabelData],
  watch: {
    allUsers (newval, oldval) {
      this.selectOptions(this.formLists, 'username', newval)
    }
  },
  data () {
    return {
      fanVal: true, // 风扇开关
      onOrOff: '', // 风扇开关状态
      speed: '', // 风扇转速
      radio1: '自动', // 风扇调速
      autoFly: '', // 风扇自动/手动
      disabled: false, // 控制调速是否可用
      fanNumber: null, // 风扇速率
      valueList: [], // 打开控制弹框表格的数据
      value1: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
      userName: [],
      dialogVisible: false,
      // 获取数据函数 字段必须为initData
      initData: getMainControl,
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
        { prop: 'location', label: '安装位置', align: 'center' },
        { prop: 'code', label: '灯组编号', align: 'center' },
        { prop: 'lampNum', label: '激光灯数量（个）', align: 'center' },
        { prop: 'createTime', label: '安装时间', align: 'center', formatter: this.timestampToTimes }
      ],
      // 表格操作按钮
      operates: {
        fixed: 'right',
        width: '200px',
        list: [
          { show: true, type: 'danger', label: '删除', method: this.tabelDelete, popover: true, visible: false },
          { show: true, type: 'success', label: '编辑', method: this.tabeledit },
          { show: true, type: 'primary', label: '控制', method: this.control }
        ]
      },
      // 搜索配置
      searchOptions: { // 最低能见度统计
        type: [
          {
            type: 'input',
            name: '搜索',
            queryname: 'location',
            query: null,
            placeholder: '请输入安装位置',
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
        { model: 'createUserId', label: '用户', type: 'select', selectOptions: this.allUsers, key: 'name', value: 'id' }
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
      // 弹出层表单数据
      dataForm: {
        'location': null,
        'code': null,
        'lampNum': null,
        'model': null,
        'note': null
      }

    }
  },
  methods: {
    // 控制激光灯
    control (key, val) {
      this.valueList = val
      this.dialogVisible = true
    },
    // 同步时间
    syncTime () {
      setTime({ code: this.valueList.code })
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 控制风扇
    changeFan (data) {
      if (data) {
        this.onOrOff = 1 // 打开
      } else {
        this.onOrOff = 0
      }
      setFan({ code: this.valueList.code, onOrOff: this.onOrOff, speed: 0 })
        .then((res) => {
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 风扇自动手动
    changeAuto (data) {
      if (data === '自动') {
        this.autoFly = 1
        this.disabled = true
      } else {
        this.autoFly = 0
        this.disabled = false
      }
      autoFan({ code: this.valueList.code, onOrOff: this.autoFly })
        .then((res) => {

        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 风扇调速方法
    changeFanNumber () {
      setFan({ code: this.valueList.code, onOrOff: 1, speed: this.fanNumber })
        .then((res) => {
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 时间转化
    timestampToTimes (val, key) {
      return timestampToTime(val[key.prop])
    },
    // 表格多行选中
    handleSelectionChange (val) {
      console.log(val)
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
    }
  },
  async created () {
    // 获取用户
    await this.getTabelData(this.initData)
    console.log(this.list)
  },
  mounted () {
    console.log(this.allUsers)
    // this.allUsers.forEach(element => {
    //   this.userName = element.name
    //   console.log(this.userName)
    // })
  }
}
</script>

<style scoped>
.main {
  width: 100%;
}
.lampBox {
  width: 100%;
  height: 300px;
  margin-bottom: 10px;
}
.lamp {
  width: 100%;
  height: 25%;
  margin-right: 10px;
  /* padding: 30px 0; */
}
.lamp:last-child {
  margin-right: 0;
}
.openTime {
  display: inline-block;
}
</style>
