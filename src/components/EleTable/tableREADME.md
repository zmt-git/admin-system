##### prop说明 #####
### list 数据列表
  **必填**
```list:[]
```
### columns 需要展示的列
  **必填**
```columns: {
  {prop: "value", label: "能见度值(米)", align: "center"},
  {prop: "lastYear", label: "上一年周期(天)", align: "center"},
  {prop: "thisYear", label: "当月(天)", align: "center"}
}
```
### operates 操作按钮组
  **必填**
  **表单绑定数据**
```dataform: {id}
```
### options 表格的控制参数
  **必填**
  **表格的控制参数**
```mapConfig:{
    stripe: true, // 是否为斑马纹 table
    loading: false, // 是否添加表格loading加载动画
    highlightCurrentRow: true, // 是否支持当前行高亮显示
    mutiSelect: false, // 是否支持列表项选中功能
    height: "20px"
}
```
#### 可参考views/index.vue文件调用