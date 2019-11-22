## prop说明
### options
  **必填**
  **表单类型列表配置**
```formList:{
   type: [
    {
      type: "input", // input, select, data
      name: "传感器",
      clearable: true,
      placeholder: "请选择传感器",
      size: "mini", // element medium / small / mini
      queryname: "senid",
      query: null,
      callback: backNUll,
      defaultquery: null
    },
    {
      type: "select", // input, select, data
      name: "传感器",
      clearable: true,
      placeholder: "请选择传感器",
      options: [], // select类型使用,
      optionskey: {label: "name", value: "key"}, // 用于label，value使用
      size: "mini", // element medium / small / mini
      queryname: "senid",
      query: null,
      callback: backNUll,
      defaultquery: null
    },
    {
      type: "data", // input, select, data
      name: "开始时间",
      clearable: true,
      placeholder: "请选择开始时间",
      size: "mini", // element medium / small / mini
      format: "yyyy-MM-dd", // 时间插件
      valueFormat: "yyyyMMdd", // 时间插件
      queryname: "stime",
      query: null,
      callback: backNUll,
      defaultquery: null
    },
    btnName: "查询",
    hasdefault: true,
    labelClass: null
}
```
  ### 目前支持input， select，data类型
  ### 可参考views/index.vue调用例子