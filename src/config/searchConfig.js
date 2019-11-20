// import { formatTime } from '@/utils/format'
function backNUll () {}
export const searchOptions = { // 最低能见度统计
  type: [
    {
      type: 'select', // input, select, data
      name: '传感器',
      clearable: true,
      placeholder: '请选择传感器',
      options: [], // select类型使用,
      optionskey: { label: 'name', value: 'key' }, // 用于label，value使用
      size: 'mini', // element medium / small / mini
      queryname: 'senid',
      query: null,
      callback: backNUll,
      defaultquery: null
    },
    {
      type: 'data', // input, select, data
      name: '开始时间',
      clearable: true,
      placeholder: '请选择开始时间',
      size: 'mini', // element medium / small / mini
      format: 'yyyy-MM-dd', // 时间插件
      valueFormat: 'yyyyMMdd', // 时间插件
      queryname: 'stime',
      query: null,
      callback: backNUll,
      defaultquery: null
    },
    {
      type: 'data', // input, select, data
      name: '结束时间',
      clearable: true,
      placeholder: '请选择结束时间',
      size: 'mini', // element medium / small / mini
      queryname: 'etime',
      format: 'yyyy-MM-dd', // 时间插件
      valueFormat: 'yyyyMMdd', // 时间插件
      query: null,
      callback: backNUll,
      defaultquery: null
    }
  ],
  btnName: '查询',
  hasdefault: true,
  labelClass: null
}

/**
 *
 *
 * @param {*} val值
 * @param {*} type类型
 * @returns
 */
// eslint-disable-next-line no-unused-vars
function formatString (val, type) {
  if (type === undefined) type = '-'
  let str = val.slice(0, 4) + type + val.slice(4, 6) + type + val.slice(6, 8)
  return str
}

/**
 *
 *
 * @param {*} that组件事例vue对象
 * @param {*} val
 */
function callback (that, val) {
  // val = formatString(val)
  // let date = new Date(val)
  // date = date.setMonth((date.getMonth() + 1))
  // that.options.type[1].query = formatTime("yyyyMMdd", "yyyyMMdd", date)
}
export const searchOptions2 = { // 最低能见度统计
  type: [
    {
      type: 'data', // input, select, data
      name: '开始时间',
      clearable: true,
      placeholder: '请选择开始时间',
      size: 'mini', // element medium / small / mini
      format: 'yyyy-MM-dd', // 时间插件
      valueFormat: 'yyyyMMdd', // 时间插件
      queryname: 'stime',
      query: null,
      callback: callback,
      defaultquery: null,
      pickerOptions: {
        disabledDate (time) {
          let data = new Date()
          data = data.setMonth(data.getMonth() - 1)
          return time.getTime() >= data - 8.64e7
        }
      }
    },
    {
      type: 'data', // input, select, data
      name: '结束时间',
      clearable: true,
      placeholder: '请选择结束时间',
      size: 'mini', // element medium / small / mini
      queryname: 'etime',
      format: 'yyyy-MM-dd', // 时间插件
      valueFormat: 'yyyyMMdd', // 时间插件
      callback: backNUll,
      query: null,
      disabled: false,
      defaultquery: null
    }
  ],
  btnName: '查询',
  hasdefault: true,
  labelClass: 'whitelabeltext'
}
