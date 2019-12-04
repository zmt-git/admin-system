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
      <el-button type="success" size="mini" v-hasBtn @click="allread"><i class="iconfont icon-zhanneixinyidu iconBtn"></i>一键已读</el-button>
      <el-button type="info" size="mini" v-hasBtn @click="allmaintain"><i class="iconfont icon-techreport- iconBtn"></i>一键维护</el-button>
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
  </div>
<!-- root element -->
</template>
<script>
// 混入
import tabelData from '@/mixins/tabelData'

// 组件
import EleTable from '@/components/EleTable/table'
import Search from '@/components/Search/search'

// 方法
import { timestampToTime } from '@/utils/format'
import { mapGetters } from 'vuex'

// API
import { pageMainControl, saveOrUpdate, deleteByIds } from '@/api/voice/voiceInfo'

export default {
  components: {
    EleTable,
    Search
  },
  mixins: [tabelData],
  computed: {
    ...mapGetters(['allRoles', 'allUsers', 'allGroups'])
  },
  created () {
    // 获取用户
    this.list = this.obj
    this.options.loading = false
    // this.getTabelData(this.initDataFn)
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
        { prop: 'code', label: '设备编码', width: '130px' },
        { prop: 'deviceType', label: '设备类型', width: '130px', formatter: this.formatterType },
        { prop: 'alarmTime', label: '报警时间', formatter: this.timestampToTimes, width: '140px' },
        { prop: 'resion', label: '报警原因' },
        { prop: 'deviceStatus', label: '主控状态', render: true, nopopover: true, title: '告警', type: 'danger', width: '70px', typeLists: { 0: { value: 0, title: '正常', type: 'success' }, 1: { value: 1, title: '离线', type: 'danger' }, 2: { value: 2, title: '告警', type: 'warning' }, 3: { value: 3, title: '升级', type: 'info' } } },
        { prop: 'maintain', label: '维护状态', render: true, nopopover: true, width: '80px', typeLists: { 0: { value: 0, title: '未维护', type: 'danger' }, 1: { value: 1, title: '已维护', type: 'success' } }, method: this.maintain },
        { prop: 'read', label: '消息状态', render: true, nopopover: true, width: '70px', typeLists: { 0: { value: 0, title: '未读', type: 'danger' }, 1: { value: 1, title: '已读', type: 'success' } }, method: this.readMessage }
      ],

      // 表格操作按钮 (混入数据包含该数据 ，添加其他配置重新覆盖即可)
      operates: {
        fixed: 'right',
        width: '130px',
        list: [
          // { show: true, type: 'danger', icon: 'el-icon-delete', method: this.tabelDelete, title: '删除' } // 操作按钮 删除
          // { show: true, type: 'info', icon: 'el-icon-edit', method: this.tabeledit, title: '编辑' }, // 编辑按钮
          // { show: true, type: 'success', iconfont: 'icon-techreport-', method: this.maintain, title: '维护' } // 编辑按钮
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

      // 表格选中数据
      alarmList: [],

      // 删除key
      deleteKey: 'codes',

      // 转换参数 转换数据之前，须将此属性设置为true
      isformat: true,

      // 参数改为code
      deleteVal: true,

      // 主控code
      code: null,

      // 设备类型
      deviceType: {
        led: '激光灯',
        lamp: '引导灯',
        voice: '红外对射'
      },
      obj: [
        { code: 'xxxxxxxxx', deviceType: 'led', resion: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', deviceStatus: 0, maintain: 1, read: 1 },
        { code: 'xxxxxxxxx', deviceType: 'led', resion: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', deviceStatus: 1, maintain: 0, read: 0 },
        { code: 'xxxxxxxxx', deviceType: 'led', resion: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', deviceStatus: 2, maintain: 0, read: 0 },
        { code: 'xxxxxxxxx', deviceType: 'led', resion: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', deviceStatus: 3, maintain: 0, read: 0 },
        { code: 'xxxxxxxxx', deviceType: 'led', resion: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', deviceStatus: 2, maintain: 0, read: 0 }
      ]
    }
  },
  methods: {
    // 时间转化
    timestampToTimes (val, key) {
      return timestampToTime(val[key.prop])
    },

    // 表格多行选中 分配角色
    handleSelectionChange (val) {
      this.alarmList = val
    },

    // 一键已读 TODO
    allread () {
      if (this.alarmList.length <= 0) {
        this.tip('至少选中一条数据，才能进行操作', 'info')
      } else {
        this.tip('操作成功', 'success')
      }
    },

    // 一键维护 TODO
    allmaintain () {
      if (this.alarmList.length <= 0) {
        this.tip('至少选中一条数据，才能进行操作', 'info')
      } else {
        this.tip('操作成功', 'success')
      }
    },

    // 设备维护 TODO
    maintain (key, row) {
      // 点击转换状态
      if (row[key]) {
        this.$set(this.obj[0], 'maintain', 0)
      } else {
        this.$set(this.obj[0], 'maintain', 1)
      }
    },

    // 消息已读 未读 TODO
    readMessage (key, row) {
      // 点击标记为已读
      if (row[key]) {
        this.$set(this.obj[0], 'read', 0)
      } else {
        this.$set(this.obj[0], 'read', 1)
      }
    },

    formatterType (val, key) {
      return this.deviceType[val[key.prop]]
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
