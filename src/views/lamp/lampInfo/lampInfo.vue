<template>
<!-- root element -->
  <div class="textAlginLeft control">
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
      <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteIds(lampList)">批量删除</el-button>
    </el-button-group>

    <!-- 操作数据按钮 结束 -->

    <!-- 表格+分页 开始 -->
    <EleTable
      :list='list'
      :columns='columns'
      :options='options'
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

    <!-- 主控控制 开始 -->
    <DialogControl
     ref="DialogControl"
    :code='code'
     ></DialogControl>
    <!-- 主控控制 结束 -->

    <!-- 能见度表格 开始 -->
    <Visibility
      :code='code'
      ref="Visibility"
     ></Visibility>
    <!-- 能见度表格 结束 -->

    <!-- 能见度echarts 开始 -->
    <VisibilityEcharts
      :code='code'
      ref="VisibilityEcharts"
     ></VisibilityEcharts>
    <!-- 能见度echarts 结束 -->
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
import DialogControl from '../components/control/Control'
import Visibility from '../components/Visibility/Visibility'
import VisibilityEcharts from '../components/VisibilityEcharts/VisibilityEcharts'

// 方法
import { mapGetters } from 'vuex'

// API
import { pageMainControl, saveOrUpdate, deleteByIds, isCode } from '@/api/lamp/lampInfo'

export default {
  components: {
    EleTable,
    Search,
    DialogForm,
    DialogControl,
    Visibility,
    VisibilityEcharts
  },
  mixins: [tabelData],
  computed: {
    ...mapGetters(['allGroups'])
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
        { prop: 'lampNum', label: '灯数量' },
        { prop: 'latitude', label: '纬度' },
        { prop: 'longitude', label: '经度' },
        { prop: 'location', label: '安装位置' },
        { prop: 'model', label: '型号' },
        { prop: 'note', label: '备注' },
        { prop: 'visibility', label: '能见度检测仪数量' }
      ],

      // 表格操作按钮 (混入数据包含该数据 ，添加其他配置重新覆盖即可)
      operates: {
        fixed: 'right',
        width: '200px',
        list: [
          { show: true, type: 'danger', icon: 'el-icon-delete', method: this.tabelDelete, title: '删除' }, // 操作按钮 删除
          { show: true, type: 'info', icon: 'el-icon-edit', method: this.tabeledit, title: '编辑' }, // 编辑按钮
          { show: true, type: 'success', icon: 'el-icon-setting', method: this.setStatus, title: '状态设置' }, // 状态设置按钮
          { show: true, type: 'warning', iconfont: 'icon-nengjianduyi', method: this.viewVisibility, title: '能见度' }, // 能见度按钮
          { show: true, type: 'primary', iconfont: 'icon-tubiaozhexiantu', method: this.viewVisibilityEcharts, title: '能见度折线图' } // 能见度按钮
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
        title: '设备分组', // 弹框标题
        width: '590px', // 弹框宽度
        dialogVisible: false, // 弹框默认显示，隐藏状态属性
        inline: false // 表单是否为内联
      },

      // 弹出层表单配置文件 不建议表格与弹框使用一个对象
      formLists: [
        { model: 'code', label: '编码', placeholder: '请输入用户名', blur: this.isOnlyCode },
        { model: 'lampNum', label: '灯数量', placeholder: '请输入灯数量' },
        { model: 'latitude', label: '纬度', placeholder: '请输入纬度' },
        { model: 'longitude', label: '经度', placeholder: '请输入经度' },
        { model: 'location', label: '安装位置', placeholder: '请输入安装位置' },
        { model: 'model', label: '型号', placeholder: '请输入型号' },
        { model: 'note', label: '备注', placeholder: '请输入备注' },
        { model: 'groupIds', label: '设备组', placeholder: '请选择设备组（可多选）', type: 'select', multiple: true, collapseTags: true, key: 'name', value: 'id' },
        { model: 'visibility', label: '能见度检测仪数量', placeholder: '请输入能见度检测仪数量' }
      ],

      // formatTypes 表但提交数据转换
      formatTypes: this.formatTypesFn,

      // 转换参数 转换数据之前，须将此属性设置为true
      isformat: true,

      // 表单验证规则
      formAttr: {
        rules: {
          code: [
            { required: true, message: '请输入组名', trigger: 'blur' }
          ],
          lampNum: [
            { required: true, message: '请输入引导灯数量', trigger: 'blur' }
          ],
          latitude: [
            { required: true, message: '请输入纬度', trigger: 'blur' }
          ],
          longitude: [
            { required: true, message: '请输入经度', trigger: 'blur' }
          ],
          location: [
            { required: true, message: '请输入位置', trigger: 'blur' }
          ],
          model: [
            { required: true, message: '请输入型号', trigger: 'blur' }
          ],
          note: [
            { required: true, message: '请输入备注', trigger: 'blur' }
          ],
          groupIds: [
            { required: true, message: '请选择设备组', trigger: 'blur' }
          ],
          visibility: [
            { required: true, message: '请输入能见度检测仪数量', trigger: 'blur' }
          ]
        },
        labelWidth: null
      },

      // 弹出层表单数据
      dataForm: {
        'code': 'NXYDD_',
        'lampNum': null,
        'latitude': null,
        'longitude': null,
        'location': null,
        'model': null,
        'note': null,
        'visibility': null,
        'groupIds': null
      },

      // 表格选中数据
      lampList: [],

      // 删除主控key
      deleteKey: 'codes',

      // 主控状态数据
      masterInfo: {},

      // 表格操作按钮选中code
      code: null,

      // 参数改为code
      deleteVal: true
    }
  },
  methods: {
    // 表格多行选中 分配角色
    handleSelectionChange (val) {
      this.lampList = val
    },

    // 判断分组重复是否唯一
    isOnlyCode (key, val) {
      isCode({ code: val[key] })
        .then(res => {
          if (res.result === true) {
            // 提示分组重复重复
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

    // 设置状况状态
    setStatus (key, val) {
      this.code = val.code
      this.$refs.DialogControl.show()
    },

    // 查看能见度
    viewVisibility (key, val) {
      this.code = val.code
      this.$refs.Visibility.show()
    },

    // 转化表单提交数据
    formatTypesFn () {
      let arr = this.dataForm.groupIds
      arr = arr.join(',')
      let obj = JSON.parse(JSON.stringify(this.dataForm))
      obj.groupIds = arr
      return obj
    },

    // 能见度echarts
    viewVisibilityEcharts (key, val) {
      this.code = val.code
      this.$refs.VisibilityEcharts.show()
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
