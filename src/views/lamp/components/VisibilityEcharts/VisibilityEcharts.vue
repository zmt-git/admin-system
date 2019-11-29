<template>
  <!-- root element start -->
  <div>
    <el-dialog
      title="主控能见度检测仪数据折线图"
      width="610px"
      @open='open'
      @close='close'
      :append-to-body='true'
      :visible.sync="dialogVisibleEcharts"
     >
      <span>
        <!-- 折线图开始 -->
        <div id="visibilityChart"></div>
        <!-- 折线图结束-->
      </span>
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
      myChart: {}
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
      this.getMasterVisibility()
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

    getMasterVisibility () {
      return findVISStu({ code: this.code })
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
          console.error(err)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
#visibilityChart {
  width:98%;
  height: 300px;
}
</style>
