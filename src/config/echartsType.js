export let Histogram = {
  color: ['#5fb73f', '#b92b31'],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  toolbox: {
    top: '3%',
    right: '5%',
    feature: {
      saveAsImage: {}
    }
  },
  legend: {
    data: ['在线', '离线']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'value',
    boundaryGap: [0, 0.01]
  },
  yAxis: {
    type: 'category',
    data: ['传感器', '能见度', '路面状况', '天气状况']
  },
  series: [{
    name: '在线',
    type: 'bar',
    data: [0, 0, 0, 0],
    label: {
      normal: {
        show: true,
        position: 'right',
        textStyle: {
          color: 'black'
        }
      }
    }
  },
  {
    name: '离线',
    type: 'bar',
    data: [0, 0, 0, 0],
    label: {
      normal: {
        show: true,
        position: 'right',
        textStyle: {
          color: 'black'
        }
      }
    }
  }
  ]
}
export let line = {
  toolbox: {
    top: '-1%',
    right: '10%',
    feature: {
      saveAsImage: {}
    }
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: [],
    top: '0%'
  },
  xAxis: [
    {
      name: '时间',
      type: 'category',
      offset: 8,
      position: 'bottom',
      nameLocation: 'start',
      nameTextStyle: { color: '#585858', padding: [0, 0, -38] },
      data: [0],
      axisLabel: {
        show: true,
        interval: 0,
        formatter: function (params) {
          var newParamsName = ''
          var paramsNameNumber = params.length
          var provideNumber = 10 // 一行显示几个字
          var rowNumber = Math.ceil(paramsNameNumber / provideNumber)
          if (paramsNameNumber > provideNumber) {
            for (var p = 0; p < rowNumber; p++) {
              var tempStr = ''
              var start = p * provideNumber
              var end = start + provideNumber
              if (p === rowNumber - 1) {
                tempStr = params.substring(start, paramsNameNumber)
              } else {
                tempStr = params.substring(start, end) + '\n'
              }
              newParamsName += tempStr
            }
          } else {
            newParamsName = params
          }
          return newParamsName
        }
      }
    },
    {
      name: '道路状况',
      offset: 40,
      type: 'category',
      position: 'bottom',
      nameLocation: 'start',
      axisTick: { show: false },
      axisLine: { show: false },
      nameTextStyle: { color: '#858585', padding: [0, 0, -38] },
      data: ['/']
    },
    {
      offset: 60,
      name: '天气状况',
      type: 'category',
      position: 'bottom',
      nameLocation: 'start',
      axisTick: { show: false },
      axisLine: { show: false },
      nameTextStyle: { color: '#858585', padding: [0, 0, -38] },
      data: ['/']
    }
  ],
  grid: {
    left: '4%',
    right: '4%',
    // bottom: "3%",
    top: '7%',
    containLabel: true
  },
  yAxis: {
    splitLine: {
      show: false
    }
  },
  dataZoom: [
    { startValue: '2014-06-01' },
    { type: 'inside' }
  ],
  visualMap: {
    top: 10,
    right: 10,
    pieces: [{
      gt: 0,
      lte: 50,
      color: '#999'
    }, {
      gt: 50,
      lte: 200,
      color: '#f44219'
    }, {
      gt: 200,
      lte: 500,
      color: '#fd7801'
    }, {
      gt: 500,
      lte: 1000,
      color: '#f4b419'
    }, {
      gt: 1000,
      lte: 2000,
      color: '#fdee01'
    }, {
      gt: 2000,
      lte: 4000,
      color: '#54b731'
    }, {
      gt: 4000,
      lte: 10000,
      color: '#37d400'
    }, {
      gt: 10000,
      color: '#58ff0e'
    }],
    outOfRange: {
      color: '#58ff0e'
    }
  },
  series: {
    name: null,
    type: 'line',
    smooth: true,
    data: [0]
    // label: {
    //   normal: {
    //     show: true,
    //     position: "top",
    //     textStyle: {
    //       color: "black"
    //     }
    //   }
    // }
    // areaStyle: {}
    // markLine: {
    //   silent: true,
    //   data: [{
    //     yAxis: 50
    //   }, {
    //     yAxis: 200
    //   }, {
    //     yAxis: 500
    //   }, {
    //     yAxis: 1000
    //   }, {
    //     yAxis: 2000
    //   }, {
    //     yAxis: 4000
    //   }, {
    //     yAxis: 10000
    //   }]
    // }
  }
}
export let ledLine = {
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    top: '3%',
    data: []
  },
  grid: {
    left: '3%',
    right: '13%',
    top: '15%',
    bottom: '3%',
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
}
// 数据格式 [[日，时间，时间点，能见度，天气状况，道路状况]]
var schema = [
  { name: 'date', index: 0, text: '日' },
  { name: '日期', index: 1, text: '日期' },
  { name: '时间', index: 2, text: '时间' },
  { name: '能见度', index: 4, text: '能见度' },
  { name: '持续时间', index: 3, text: '持续时间' },
  { name: '天气状况', index: 5, text: '天气状况' },
  { name: '道路状况', index: 6, text: '道路状况' }
]
var itemStyle = {
  borderColor: 'rgba(0, 0, 0, 0)',
  borderColor0: 'rgba(0, 0, 0, 0)',
  opacity: 0.8,
  shadowBlur: 10,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  shadowColor: 'rgba(0, 0, 0, 0.5)'
}
let scatterPlot = {
  backgroundColor: '#404a59',
  color: ['#dd4444', '#fec42c', '#ffea01', '#ff01e4', '#ff7f01'],
  legend: {
    y: 'top',
    data: ['雪', '雨', '雾', '晴', '最低能见度'],
    textStyle: {
      color: '#fff',
      fontSize: 16
    }
  },
  toolbox: {
    top: '-1%',
    right: '10%',
    feature: {
      saveAsImage: {}
    },
    iconStyle: {
      borderColor: '#fff'
    }
  },
  grid: {
    x: '10%',
    x2: 150,
    y: '18%',
    y2: '10%'
  },
  tooltip: {
    padding: 10,
    backgroundColor: '#222',
    borderColor: '#777',
    borderWidth: 1,
    // [1, 20时间点上限1, 10.8时间点下限2, 0, 0, 9.2持续时间5, 200能见度6, "雨夹雪"天气状况7,"积水"道路状况8, "2018-10-13" 时间9], 9
    formatter: function (obj) {
      var value = obj.value
      return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">' +
              obj.seriesName + ' 第' + value[0] + '日' +
              '</div>' +
              schema[1].text + '：' + value[9] + '<br>' +
              schema[2].text + '：' + value[10] + '<br>' +
              schema[3].text + '：' + value[6] + '米' + '<br>' +
              schema[4].text + '：' + value[5] + '小时' + '<br>' +
              schema[5].text + '：' + value[7] + '<br>' +
              schema[6].text + '：' + value[8] + '<br>'
    }
  },
  xAxis: {
    type: 'value',
    name: '日期',
    nameGap: 16,
    nameTextStyle: {
      color: '#fff',
      fontSize: 14
    },
    splitLine: {
      show: false
    },
    axisLine: {
      lineStyle: {
        color: '#eee'
      }
    }
  },
  yAxis: {
    type: 'value',
    name: '时间点/h',
    nameLocation: 'end',
    nameGap: 20,
    nameTextStyle: {
      color: '#fff',
      fontSize: 16
    },
    axisLine: {
      lineStyle: {
        color: '#eee'
      }
    },
    splitLine: {
      show: false
    }
  },
  visualMap: [
    {
      left: 'right',
      bottom: '5%',
      dimension: 6,
      min: 0,
      max: 500,
      itemHeight: 120,
      calculable: true,
      seriesIndex: [0, 1, 2, 3],
      precision: 0,
      text: ['明暗：能见度/米'],
      textGap: 30,
      textStyle: {
        color: '#fff'
      },
      inRange: {
        colorLightness: [0.4, 1]
      },
      outOfRange: {
        color: ['rgba(0,255,60,1)']
      },
      controller: {
        inRange: {
          color: ['#c23531', '#fff']
        },
        outOfRange: {
          color: ['#00ff3c']
        }
      }
    },
    {
      left: 'right',
      top: '0%',
      min: 0,
      max: 24,
      dimension: 6,
      seriesIndex: [0, 1, 2, 3],
      itemWidth: 30,
      itemHeight: 120,
      calculable: true,
      precision: 0.1,
      text: ['高度：持续时间/小时'],
      textGap: 30,
      textStyle: {
        color: '#fff'
      },
      inRange: {
        symbol: 'roundRect',
        symbolSize: [10, 70]
      },
      outOfRange: {
        symbolSize: [20, 70],
        color: ['rgba(0,255,60,1)']
      },
      controller: {
        inRange: {
          color: ['#c23531']
        },
        outOfRange: {
          color: ['#00ff3c']
        }
      }
    }
  ],
  series: [
    {
      name: '雪',
      type: 'candlestick',
      itemStyle: {
        normal: {
          ...itemStyle,
          color: '#dd4444',
          color0: '#dd4444'
        }
      },
      data: []
    },
    {
      name: '雨',
      type: 'candlestick',
      itemStyle: {
        normal: {
          ...itemStyle,
          color: '#fec42c',
          color0: '#fec42c'
        }
      },
      data: []
    },
    {
      name: '雾',
      type: 'candlestick',
      itemStyle: {
        normal: {
          ...itemStyle,
          color: '#ff01e4',
          color0: '#ff01e4'
        }
      },
      data: []
    },
    {
      name: '晴',
      type: 'candlestick',
      itemStyle: {
        normal: {
          ...itemStyle,
          color: '#ff7f01',
          color0: '#ff7f01'
        }
      },
      data: []
    },
    {
      name: '最低能见度',
      type: 'line',
      data: [],
      smooth: true,
      symbol: 'emptyCircle',
      symbolSize: [10, 10],
      lineStyle: {
        normal: { opacity: 0.5 }
      }
    }
  ]
}
export let histogramVertical = {
  legend: {
    data: ['传感器', '复合屏'],
    tooltip: {
      show: true
    }
  },
  toolbox: {
    top: '3%',
    right: '5%',
    feature: {
      saveAsImage: {}
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: { // x轴参数配置
    type: 'category',
    data: ['G1511日兰高速K308.8-K320.2', 'G1511日兰高速K362.1-K367.7', 'G1511日兰高速K367.7-K429.3', 'G35济广高速K201.5-K250.9', 'G35济广高速K250.9-K340', 'G3W德上高速K231-K281', 'S32菏宝高速K0-K48'],
    axisTick: {
      alignWithLabel: true
    },
    axisLine: {
      lineStyle: {
        color: '#9c9c9c'
      }
    },
    axisLabel: {
      show: true,
      interval: 0,
      formatter: function (params) {
        var newParamsName = ''
        var paramsNameNumber = params.length
        var provideNumber = 6 // 一行显示几个字
        var rowNumber = Math.ceil(paramsNameNumber / provideNumber)
        if (paramsNameNumber > provideNumber) {
          for (var p = 0; p < rowNumber; p++) {
            var tempStr = ''
            var start = p * provideNumber
            var end = start + provideNumber
            if (p === rowNumber - 1) {
              tempStr = params.substring(start, paramsNameNumber)
            } else {
              tempStr = params.substring(start, end) + '\n'
            }
            newParamsName += tempStr
          }
        } else {
          newParamsName = params
        }
        return newParamsName
      },
      textStyle: {
        color: '#000' // 文字颜色
      }
    }
  },
  yAxis: {},
  series: [{
    type: 'bar',
    name: '传感器',
    data: [0, 0, 0, 0, 0, 0, 0],
    label: {
      normal: {
        show: true,
        position: 'top',
        textStyle: {
          color: 'black'
        }
      }
    }
  },
  {
    type: 'bar',
    name: '复合屏',
    data: [0, 0, 0, 0, 0, 0, 0],
    label: {
      normal: {
        show: true,
        position: 'top',
        textStyle: {
          color: 'black'
        }
      }
    }
  }
  ]
}
export let chartsConfig = {

  WorkingState: { // 设备状态
    width: '100%',
    height: '300px',
    id: 'myEcharts1',
    option: Histogram
  },
  EquipmentDistribution: { // 设备分布
    width: '100%',
    height: '300px',
    id: 'myEcharts2',
    option: histogramVertical
  },
  visibility: { // 能见度最低时段统计，恶劣天气，恶劣道路 能见度低于500专题统计
    width: '100%',
    height: '410px',
    id: 'myEcharts3',
    option: scatterPlot
  },
  getColligate: { // 能见度，天气现象，路面温度综合统计
    width: '100%',
    height: '400px',
    id: 'getColligate',
    option: line
  },
  ledLine: { // led能见度
    width: '700px',
    height: '360px',
    id: 'ledLine',
    option: ledLine,
    el: 'ledLine'
  },
  BadWeather: { // 恶劣天气现象统计
    width: '100%',
    height: '300px',
    id: 'myEcharts4',
    option: line
  },
  conditionStatistics: { // 恶劣道路状况统计
    width: '100%',
    height: '300px',
    id: 'myEcharts4',
    option: line
  },
  LedModifyHz: { // 统计-led屏修改频率统计
    width: '100%',
    height: '300px',
    id: 'myEcharts4',
    option: line
  },
  LedModifyWay: { // 统计-led屏修改方式对比
    width: '100%',
    height: '300px',
    id: 'myEcharts4',
    option: line
  }
}
