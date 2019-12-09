<template>
  <!-- root element start -->
  <div>
    <el-dialog
      :title="'能见度数据折线统计图' + '（' + code + '）'"
      width="610px"
      custom-class='visibilityChart'
      :fullscreen='fullscreen'
      :close-on-click-modal='false'
      @open='open'
      @close='close'
      :append-to-body='true'
      :visible.sync="dialogVisibleEcharts"
     >
      <div class="box">
        <i class="iconfont icon-quanping fullscreen" title="全屏" @click="tofullscreen"></i>
        <el-form ref="form" size="mini" :rules="rules" :model="form" :inline='true' >
          <el-form-item label='类型' prop="type">
           <el-select v-model="form.type" placeholder="请选择类型" @change="changeType" class='select-select'>
            <el-option
              v-for="item in selectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.type">
            </el-option>
          </el-select>
          </el-form-item>
          <el-form-item label='开始时间' prop="start">
            <el-date-picker
              class='time-select'
              v-model="form.start"
              :type="inputType"
              :format='format'
              value-format='yyyy-MM-dd HH:mm'
              placeholder="选择时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label='结束时间' prop="end">
            <el-date-picker
              class='time-select'
              v-model="form.end"
              :format='format'
              value-format='yyyy-MM-dd HH:mm'
              :type="inputType"
              placeholder="选择时间">
            </el-date-picker>
          </el-form-item>
          <el-button type="primary" plain size="mini" style="margin-top: 5px;" icon="el-icon-search" @click="toQuery"></el-button>
        </el-form>
        <!-- 折线图开始 -->
        <div id="visibilityChart"></div>
        <!-- 折线图结束-->
      </div>
    </el-dialog>
  </div>
  <!-- root element start -->
</template>
<script>
// API
import { findVISStu } from '@/api/lamp/lampInfo'

// 方法
import { timestampToTime } from '@/utils/format'
import { Message } from 'element-ui'

// 引入echarts 引入全部echarts， 可按需引入TODO
import echarts from 'echarts'

export default {
  name: 'VisibilityEcharts',
  props: {
    code: {
      type: String,
      default: -1
    }
  },
  data () {
    return {
      // 弹框 显示隐藏
      dialogVisibleEcharts: false,

      // 能见度echarts配置
      option: {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          top: '3%',
          data: []
        },
        grid: {
          left: '3%',
          right: '8%',
          top: '3%',
          bottom: '0%',
          containLabel: true
        },
        toolbox: {
          top: '3%',
          right: '5%',
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['0', '4', '8', '12', '16', '20', '24']
        },
        yAxis: {
          type: 'value'
        },
        visualMap: {
          top: 80,
          right: 0,
          pieces: [{
            gt: 0,
            lte: 100,
            color: '#f44219'
          }, {
            gt: 100,
            lte: 200,
            color: '#fd7801'
          }, {
            gt: 200,
            lte: 500,
            color: '#f4b419'
          }, {
            gt: 500,
            lte: 1000,
            color: '#fdee01'
          }, {
            gt: 1000,
            color: '#54b731'
          }],
          outOfRange: {
            color: '#54b731'
          }
        },
        series: []
      },

      // echarts 对象
      myChart: {},

      // 时间
      form: {
        code: this.code,
        start: null,
        end: null,
        type: '"%Y-%m-%d %H"'
      },

      // 表单验证
      rules: {
        start: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
        end: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }]
      },

      // 全屏属性
      fullscreen: false,

      // 查询类型
      selectOptions: [
        { label: '年', value: 'year', format: 'yyyy', type: '"%Y-%m"' },
        { label: '月', value: 'month', format: 'yyyy-MM', type: '"%Y-%m-%d"' },
        { label: '日', value: 'date', format: 'yyyy-MM-dd', type: '"%Y-%m-%d %H"' },
        { label: '时', value: 'datetime', format: 'HH:mm', type: '"%Y-%m-%d %H:%I"' }
      ],

      // input类型
      inputType: 'date',
      format: 'yyyy-MM-dd'
    }
  },
  methods: {
    // 显示弹框
    show () {
      this.dialogVisibleEcharts = true
    },

    // 重置echarts配置
    resetEchartsOptions () {
      this.option.xAxis.data = ['0', '4', '8', '12', '16', '20', '24']
      this.option.series = []
    },

    // 弹框关闭前回调函数
    close () {
      this.resetEchartsOptions()
    },

    // 弹框打开回调函数
    async open () {
      // this.getMasterVisibility()
      this.form.code = this.code
      this.$nextTick(() => {
        this.myChart = echarts.init(document.getElementById('visibilityChart'))
        this.myChart.setOption(this.option)
      })
    },

    // 通知
    tip (msg, type) {
      Message({
        duration: 3000,
        message: msg,
        type: type
      })
    },

    getMasterVisibility (obj) {
      return findVISStu(obj)
        .then(res => {
          if (res.msg === '成功') {
            this.option.series = []
            if (res.result.length <= 0) return
            for (let i = 0; i < res.result.length; i++) {
              res.result[i].time = res.result[i].time.reverse()
              if (res.result[i].vis.length <= 0 || res.result[i].time.length <= 0) {
                setTimeout(() => { this.tip(res.result[i].name + '数据为空', 'warning') }, 500)
              }
              if (res.result[i].time <= 0) continue
              for (let l = 0; l < res.result[i].time.length; l++) {
                res.result[i].time[l] = timestampToTime(res.result[i].time[l], 'hh:mm')
              }
              this.option.xAxis.data = res.result[i].time
              let obj = {
                name: res.result[i].name,
                type: 'line',
                smooth: true,
                // itemStyle: {normal: {label: {show: true}}},
                data: res.result[i].vis,
                markPoint: {
                  data: [
                    { type: 'max', name: '最大值' },
                    { type: 'min', name: '最小值' }
                  ]
                },
                markLine: {
                  data: [
                    { type: 'average', name: '平均值' }
                  ]
                }
              }
              this.option.legend.data.push(obj.name)
              this.option.series.push(obj)
            }
            this.myChart.setOption(this.option)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 提交表单
    toQuery () {
      console.log(this.form)
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log(this.form)
          let obj = JSON.parse(JSON.stringify(this.form))
          obj.start = new Date(obj.start).getTime()
          obj.end = new Date(obj.end).getTime()
          this.getMasterVisibility(obj)
        }
      })
    },

    // 全屏
    tofullscreen () {
      this.fullscreen = !this.fullscreen
      this.$nextTick(() => {
        this.myChart.resize()
      })
    },

    // 根据类型展示不同的input框
    changeType () {
      let index = this.selectOptions.findIndex(item => { return item.type === this.form.type })
      this.inputType = this.selectOptions[index].value
      this.format = this.selectOptions[index].format
    }
  }
}
</script>
<style lang="scss" scoped>
.box{
  width: 100%;
  height: 100%;
}
#visibilityChart {
  width:98%;
  height: calc(100% - 65px);
  min-height: 300px;
}
.time-select{
  width: 123px;
}
.select-select{
  width:60px;
  margin-top: 5px;
}
.fullscreen{
  position: absolute;
  top: 14px;
  right: 42px;
  font-size: 12px;
  color: #909399;
  cursor: pointer;
}
.box{
  width: 100%;
  height: 100%;
}
</style>
<style>
.visibilityChart .el-form-item--mini .el-form-item__label {
  line-height: 36px;
}
.is-fullscreen .el-dialog__body{
  padding: 10px 10px;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
  overflow: auto;
  height: calc(100% - 44px);
  max-height: calc(100% - 44px);
}
</style>
