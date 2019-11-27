<template>
  <div class="textAlginLeft">
    <div>

      <!-- 选择主控 开始 -->
      <el-form ref="form" :model="masterForm" :rules="masterrules" style="float:left;" size="small" label-position="right" label-width="70px" >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="请选择主控设备" prop="masterControl" label-width="121px">
              <el-select v-model="masterForm.masterControl" clearable placeholder="请选择亮度" style="width:153px" @change="changeMater">
                <el-option
                  v-for="(item,index) in masterOptions"
                  :key="index"
                  :label="item.code"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 选择主控 结束 -->

    <!-- 引导灯状态表格 开始 -->
    <el-table
      :data="tableData"
      border ref="multipleTable" v-loading="loading" v-show="!loading" tooltip-effect="dark"
      size="small" v-cloak style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column
        fixed
        width="60"
        prop="code"
        label="灯号">
      </el-table-column>
      <el-table-column
        prop="nightMod"
        :formatter="nightModFormatter"
        label="夜间状态">
      </el-table-column>
      <el-table-column
        :formatter="wakeFormatter"
        prop="wake"
        label="尾迹状态">
      </el-table-column>
      <el-table-column
        :formatter="voiceFormatter"
        prop="voice"
        label="声音状态">
      </el-table-column>
      <el-table-column
        :formatter="brightnessFormatter"
        prop="brightness"
        label="亮度">
      </el-table-column>
      <el-table-column
        :formatter="frequencyFormatter"
        prop="frequency"
        label="频率">
      </el-table-column>
      <el-table-column
        prop="createTime"
        width='140'
        :formatter="createTimeFormatter"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="batteryVoltage"
        label="电池电压/V">
        <template slot-scope="scope">
          <span v-if="scope.row.batteryVoltage > 10.8">{{scope.row.batteryVoltage}}</span>
          <span v-else style="color: red">{{scope.row.batteryVoltage}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="sunVoltage"
        :formatter="VoltageFormatter"
        label="太阳能电压/V">
      </el-table-column>
      <el-table-column
        prop="cpuTemperature"
        label="CPU温度/℃">
      </el-table-column>
    </el-table>
    <!-- 引导灯状态表格 结束 -->

    <!-- 引导灯状态表格分页开始 开始 -->
     <el-row>
      <el-col :span="12">
        <el-pagination
          @size-change="sizeChange"
          @current-change="pageChange"
          :currentPageNo="0"
          :page-sizes="[15, 20, 50, 100]"
          :page-size="size"
          layout="total, prev, pager, next, sizes"
          :total=total>
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 引导灯状态表格分页开始 结束 -->

  </div>
</template>
<script>
// API
import { getLeadStatus } from '@/api/lamp/lampStatus'
import { findAllMainControl } from '@/api/lamp/lampInfo'

// 方法
import { timestampToTime } from '@/utils/format'
export default {
  data () {
    return {
      time: '5',
      nightlist: [],
      daylist: [],
      model: '1',
      totallist: [],
      page: 0,
      size: 15,
      total: 0,
      delLoading: false,
      setWaningInfo: {},
      statusInfo: {},
      masterrules: {
        masterControl: [{ required: true, message: '请选择主控设备', trigger: 'change' }]
      },
      masterForm: { masterControl: null },
      masterOptions: [],
      loading: false,
      multipleSelection: [],
      tableData: []
    }
  },
  created () {
    findAllMainControl()
      .then(res => {
        this.masterOptions = res.result
        this.masterForm.masterControl = res.result[0].id
        this.getLampList(this.masterForm.masterControl)
      })
      .catch(err => console.log(err))
  },
  methods: {
    // 排序回调函数
    compare (obj1, obj2) {
      var val1 = obj1.code
      var val2 = obj2.code
      if (val1 < val2) {
        return -1
      } else if (val1 > val2) {
        return 1
      } else {
        return 0
      }
    },

    // 显示条数改变
    sizeChange (e) {
      this.size = e
      if (this.page === 0) {
        this.tableData = this.totallist.slice((this.page * this.size), this.size)
        console.log('sizeChange:' + (this.page * this.size), this.size)
      } else {
        this.tableData = this.totallist.slice((this.page * this.size), (this.page * this.size + this.size))
        console.log('sizeChange:' + (this.page * this.size), (this.page * this.size + this.size))
      }
    },

    // 改变页数
    pageChange (e) {
      this.page = e - 1
      if (this.page === 0) {
        this.tableData = this.totallist.slice((this.page * this.size), this.size)
        console.log('pageChange:' + (this.page * this.size), this.size)
      } else {
        this.tableData = this.totallist.slice((this.page * this.size), (this.page * this.size + this.size))
        console.log('pageChange:' + (this.page * this.size), (this.page * this.size + this.size))
      }
    },

    // 表格数据选中数据
    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    // 选中主控设备，更新表格数据
    changeMater () {
      this.getLampList(this.masterForm.masterControl)
    },

    // 时间转换格式
    createTimeFormatter (row, column, cellValue, index) {
      if (row.createTime) {
        let time = timestampToTime(row.createTime)
        return time
      }
    },

    // 夜间状态格式转换
    nightModFormatter (row, column) {
      return row.nightMod === 0 ? '关' : '开'
    },

    // 尾迹状态格式转换
    wakeFormatter (row, column) {
      return row.wake === 0 ? '关' : '开'
    },

    // 声音状态格式转换
    voiceFormatter (row, column) {
      return row.voice === 0 ? '关' : '开'
    },

    // 亮度状态格式转换
    brightnessFormatter (row, column, cellValue, index) {
      let str = (11 - row.brightness) * 10 + '%'
      if (row.brightness === 0) {
        str = row.brightness + '%'
      }
      return str
    },

    // 频率状态格式转换
    frequencyFormatter (row, column, cellValue, index) {
      let str = row.frequency + '0Hz'
      if (row.brightness === 0) {
        str = row.brightness + 'Hz'
      }
      return str
    },

    // cup温度状态格式转换
    cpuTFormatter (row, column, cellValue, index) {
      let str = row.cpuTemperature / 100
      return str.toFixed(2)
    },

    // 电池电压告警标记 红色
    VoltageFormatter (row, column, cellValue, index) {
      let str = row.sunVoltage
      if (this.time > 18 || this.time < 6) {
        return '< 7'
      } else {
        return str
      }
    },

    // 初始化数据
    getLampList (id) {
      this.totallist = []
      this.nightlist = []
      this.daylist = []
      this.total = 0
      this.tableData = []
      getLeadStatus({ code: id })
        .then(res => {
          if (res.msg === '成功') {
            this.page = 0
            this.size = 15
            res.result.sort(this.compare)
            this.tableData = res.result.slice(0, 15)
            this.nightlist = res.result
            this.daylist = res.result
            this.totallist = this.nightlist
            this.total = parseInt(res.result.length)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
<style scoped>
.tableBox{
  width: 100%;
  padding:10px;
  box-sizing: border-box;
}
.model{
  float:right;
  padding-top: 13px;
}
</style>
