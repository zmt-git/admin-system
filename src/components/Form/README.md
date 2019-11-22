### 支持类型 input ,select, date. datetime, radio, textarea
## prop说明
### formList
  **必填**
  **表单类型列表配置**
```formList:[
     {
       type: input, // String 表单类型 (默认为input)
       model: id, // String 表单value (必填)
       label: '表单名称', // String 表单名称(必填)
       radio: id, // type为radio时设置 radio的name互斥属性 (必填)
       selectOptions: [] // Array type为select时设置 下拉框内容 (必填)
       key: [] // Array type为select时设置 下拉框内容 (必填)
       value: [] // Array type为select时设置 下拉框内容 (必填)
       labelWidth: -, // String
       width: -, // String 表单长度(默认为空)
       disabled: false, // Boolean 是否禁用 (默认为false)
       prop: id, // String rule为true时，匹配规则 (默认为model绑定值)
       placeholder: "" // String (默认为，请选择内容，请输入内容)
       clearable: true, // Boolean 清除 (默认为true),
       span: 12, // Number 占比 (默认为一行两个),
       pickerOptions: {} // Object, data类型设置 (默认无)
       format: "yyyy-MM-dd hh:MM:ss" // String  data类型设置 (默认yyyy-MM-dd hh:MM:ss)
       valueFormat: "yyyy-MM-dd hh:MM:ss" // String  data类型设置 (默认yyyy-MM-dd hh:MM:ss)
     }
   ]
```
### formAttr
  **必填**
  **表单属性**
```formAttr: {
  rules: {}, // Object
  labelWidth: - // Number
}
```
### dataform
  **必填**
  **表单绑定数据**
```dataform: {id}
```
### formConfig
  **必填**
  **地图，表单配置**
```formConfig:{
  type: 'camera', 地图图层类型 (必填)
  title: '引导灯基础数据信息', // String 弹出层标题显示 (必填)
  map: true, // Boolean 是否显示地图 (默认为显示)
  dialogWidth: 1200, // Number 弹出框大小 (默认为1200)
  mapWidth: 60, // Number 地图大小 (默认为60%)
  formWidth: 40, // Number 表单大小 (默认为40%)
  mapbtn: [{
    layer: "stakeNum", // 控制图层类型 (必填)
    showlayer: true, // Boolean 图层默认是否展示 (必填)
    icon: "el-icon-view", // String 按钮类型，elementui支持类型 (默认el-icon-view),
    title: "layer" // 提示 (默认为layer)
  }], // Array 地图显示图层btn (默认为桩号)
  layer: ["stakeNum"], //地图展示其他图层 (默认无，存在默认为展示状态)
  resetForms: true // 关闭dialg是否重置表单 (默认重置)
}
```
**添加，编辑配置**
```isAdd: true // Boolean (默认为true)
```
**dialog默认显示状态**
```visible: false // Boolean (默认为true)
```
#### evevts ####
### 添加
### @doAdd
/**
 * @param {*}val表单绑定值
 * @returns null
 */

### @doEdit
### 编辑
/**
 * @param {*} val表单绑定值
 * @returns null
 */

 ### @selCamera
 ### 框选的摄像机信息列表
/**
 * @param {*} Ids
 * @param {*} Ips
 * @returns null
 */