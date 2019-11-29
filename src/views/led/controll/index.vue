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
  <el-dialog
    title="激光灯控制"
    :visible.sync="dialogVisible"
    width="610px">
    <div class="main">
      <ul class="lampBox">
        <li class="lamp">
          <div class="openTime">
            <span>开关灯时间：</span>
             <el-time-picker
                style="width:130px"
                size="mini"
                format="HH:mm"
                value-format="HH:mm"
                v-model="lampOn"
                @change="changeOn"
                placeholder="开灯时间">
              </el-time-picker>
              <el-time-picker
                style="width:130px"
                size="mini"
                format="HH:mm"
                value-format="HH:mm"
                v-model="lampOff"
                @change="changeOff"
                placeholder="关灯时间">
              </el-time-picker>
              <el-button type="success" size="mini" style="margin-right:10px;" @click="setTime()">设置</el-button>
          </div>
          <el-button type="primary" size="mini" style="display: inline-block" @click="syncTime()">同步时间</el-button>
          <el-button type="info" size="mini">在线状态</el-button>
        </li>
        <li class="lamp">
          <!-- 风扇开关 -->
          <div class="fanBox">
            <span>风扇开关：</span>
            <el-switch
              style="display: inline-block;margin-bottom: 5px;"
              v-model="fanVal"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeFan"
              active-text="开"
              inactive-text="关">
            </el-switch>
          </div>
          <!-- 风扇自动/手动 -->
          <div class="fanBox">
            <span>风扇调速：</span>
            <el-radio-group v-model="radio1" size="mini" @change="changeAuto">
              <el-radio-button :disabled='this.radio' label="0">自动</el-radio-button>
              <el-radio-button :disabled='this.radio' label="1">手动</el-radio-button>
            </el-radio-group>
            <!-- 风扇调速 -->
            <div class="block rate">
              <span class="demonstration">风扇转速：</span><span>{{`${fanNumber}%`}}</span>
              <el-slider v-model="fanNumber" :disabled='this.disabled' @change="changeFanNumber"></el-slider>
            </div>
          </div>
        </li>
        <li class="lamp">
          <div class="brightness">
            <span>激光亮度调节：</span>
            <el-select v-model="brightness" @change="changeBrigh" size="mini" style="width:100px;" placeholder="请选择">
              <el-option
                v-for="item in brightVal"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button type="success" size="mini" @click="setLed()">设置</el-button>
          </div>
          <div class="brightness">
            <!-- <div class="nessLeft">激光灯闪烁设置</div> -->
            <div class="ness">
              <div style="margin-left:10px">
                <span>闪烁控制：</span>
                <el-radio-group v-model="radioTwinkle" size="mini" @change="changeLed">
                  <el-radio-button label="0">闪烁</el-radio-button>
                  <el-radio-button label="1">常亮</el-radio-button>
                </el-radio-group>
              </div>
              <div>
                <span>闪烁方式：</span>
                <el-select v-model="scintillaMode" :disabled='disMode' @change="changeMode" size="mini" style="width:110px;margin-left:10px;" placeholder="请选择">
                <el-option
                  v-for="item in optionMode"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-button type="success" size="mini" :disabled='disMode' @click="setWinkle()">设置</el-button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </el-dialog>
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
import { getMainControl, saveOrUpdate, deleteByIds, isCode, setTime, setFan, autoFan, setLaser, setFlanSh, setOnOrOffTime, getLaserStatus } from '@/api/led/controller'
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
      mainControlStatus: {}, // 存储当前状态
      lampOn: new Date(2016, 9, 10, 18, 40),
      lampOff: new Date(2016, 9, 10, 18, 40),
      onTime: null, // 开灯时间
      offTime: null, // 关灯时间
      fanVal: true, // 风扇开关
      onOrOff: '', // 风扇开关状态
      speed: '', // 风扇转速
      radio1: null, // 风扇调速
      radioTwinkle: null, // 闪烁常亮
      autoFly: '', // 风扇自动/手动
      disabled: false, // 控制调速是否可用
      disMode: false, // 控制闪烁按钮是否可用
      radio: false, // 单选按钮
      fanNumber: null, // 风扇速率
      brightness: null, /// 激光灯亮度绑定值
      scintillaMode: null, // 闪烁方式绑定值
      ledNum: null, // 激光灯亮度值
      twinkleNum: null, // 闪烁方式1-10
      valueList: [], // 打开控制弹框表格的数据
      userName: [],
      dialogVisible: false, // 激光灯控制弹出框
      dialogState: false, // 激光灯状态
      brightVal: [{
        value: 0,
        label: '0%'
      }, {
        value: 10,
        label: '10%'
      }, {
        value: 20,
        label: '20%'
      }, {
        value: 30,
        label: '30%'
      }, {
        value: 40,
        label: '40%'
      }, {
        value: 50,
        label: '50%'
      }, {
        value: 60,
        label: '60%'
      }, {
        value: 70,
        label: '70%'
      }, {
        value: 80,
        label: '80%'
      }, {
        value: 90,
        label: '90%'
      }, {
        value: 100,
        label: '100%'
      }],
      optionMode: [
        {
          value: 1,
          label: '闪烁方式一'
        }, {
          value: 2,
          label: '闪烁方式二'
        }, {
          value: 3,
          label: '闪烁方式三'
        }, {
          value: 4,
          label: '闪烁方式四'
        }, {
          value: 5,
          label: '闪烁方式五'
        }, {
          value: 6,
          label: '闪烁方式六'
        }, {
          value: 7,
          label: '闪烁方式七'
        }, {
          value: 8,
          label: '闪烁方式八'
        }, {
          value: 9,
          label: '闪烁方式九'
        }, {
          value: 10,
          label: '闪烁方式十'
        }
      ],
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
          { show: true, type: 'danger', title: '删除', icon: 'el-icon-delete', method: this.tabelDelete, popover: true, visible: false },
          { show: true, type: 'info', title: '编辑', icon: 'el-icon-edit', method: this.tabeledit },
          { show: true, type: 'primary', title: '激光灯控制', icon: 'el-icon-s-operation', method: this.control },
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
        mutiSelect: true, // 是否支持列表项选中功能
        height: '20px',
        border: true,
        padding: '5px 0',
        hasPagination: false
      },
      tableLoading: 'optionsState',
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
      }

    }
  },
  methods: {
    // 控制激光灯
    control (key, val) {
      this.valueList = val
      this.dialogVisible = true
      this.getStatus()
    },
    controlState (key, val) {
      this.dialogState = true
    },
    // 开关灯设置
    changeOn (data) {
      this.onTime = data
    },
    changeOff (data) {
      this.offTime = data
    },
    setTime () {
      setOnOrOffTime({ code: this.valueList.code, on: this.onTime, off: this.offTime })
        .then((res) => {
          this.tip('时间设置成功', 'success')
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 同步时间
    syncTime () {
      setTime({ code: this.valueList.code })
        .then((res) => {
          this.tip('时间同步成功', 'success')
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 控制风扇
    changeFan (data) {
      if (data) {
        this.onOrOff = 1 // 打开
        this.radio = false
        this.disabled = false
        this.fanVal = true
      } else {
        this.onOrOff = 0
        this.radio = true
        this.disabled = true
        this.fanVal = false
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
      if (data === '0') {
        this.autoFly = 1
        this.disabled = true
      } else {
        this.autoFly = 0
        this.disabled = false
      }
      // 自动
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
    // 激光灯亮度调节
    changeBrigh (data) {
      this.ledNum = data
    },
    setLed () {
      setLaser({ code: this.valueList.code, laser: this.ledNum })
        .then((res) => {
          this.tip('亮度设置成功', 'success')
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 设置激光灯闪烁或者常亮
    changeLed (data) {
      if (data === '1') {
        this.disMode = true
        setFlanSh({ code: this.valueList.code, onOrOff: 0, totalise: 1 })
          .then((res) => {
            this.tip('常亮设置成功', 'success')
          })
      } else {
        this.disMode = false
      }
    },
    changeMode (data) {
      this.twinkleNum = data
    },
    setWinkle () {
      setFlanSh({ code: this.valueList.code, onOrOff: 1, totalise: this.twinkleNum })
        .then((res) => {
          this.tip('闪烁方案设置成功', 'success')
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
    },
    // 获取当前状态
    getStatus () {
      getLaserStatus({ code: this.valueList.code })
        .then((res) => {
          this.mainControlStatus = res.result.mainControlStatus
          console.log(this.mainControlStatus)
          this.onTime = this.mainControlStatus.onTime // 开灯时间
          this.offTime = this.mainControlStatus.offTime // 关灯时间
          this.brightness = this.mainControlStatus.brightness // 激光灯亮度
          this.onOrOff = '0' // 风扇开关状态
          console.log(this.onOrOff)
        })
        .catch((err) => {
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
