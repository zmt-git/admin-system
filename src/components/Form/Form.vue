<template>
  <el-dialog
  :title="isAdd ? '新增' + formConfig.title : '修改'+ formConfig.title" :closeOnClickModal="false"
  :visible.sync="visible"
  :width="formConfig.dialogWidth ? formConfig.dialogWidth + 'px' : '1200px'"
  label-width="80px"
  top="30px"
  @open="openDialog"
  @opened="opened"
  @close="closeDialog">
    <div class="container">
      <!-- 地图 -->
      <div
        v-if="formConfig.map !== undefined ? formConfig.map : true"
       :style="formConfig.mapWidth ? {width: formConfig.mapWidth} : 'width: 60%;'"
        class="mapCont"
        ref="dialogMap">
        <!-- 地图 -->
        <tile-map  ref="map"></tile-map>
        <!-- 地图按钮 -->
        <div class="buttonBox">
           <template
            v-for="(item, index) in formConfig.mapbtn">
            <div
              :key="index"
              class="button"
              :ref="item.layer"
              :title="item.titile ? item.titile : item.layer"
              @click="triggerLayer(item, index)"
            >
              <i :class="item.icon ? item.icon : 'el-icon-view'"></i>
            </div>
          </template>
        </div>
      </div>
      <!-- 表单 -->
      <div
        class="mapCont"
        :style="formConfig.formWidth ? {width: formConfig.formWidth} : 'width: 40%;'"
        ref="dialogForm">
        <el-form
          ref="form"
          :model="dataForm"
          :rules="formAttr.rules ? formAttr.rules : null"
          size="small"
          :label-width="formAttr.labelWidth ? formAttr.labelWidth + 'px' : null" >
          <el-row>
            <template v-for="(item, index) in formList">
              <!-- 单选按钮 -->
              <el-col
               v-if="item.type === 'radio'"
              :key="index"
              :span="item.span ? item.span : 12">
                <el-form-item
                  :label="item.label"
                  :prop="item.prop ? item.prop : item.model"
                  :label-width="item.labelWidth ? item.labelWidth + 'px' : null"
                  :inline="true">
                    <el-radio
                    v-model="dataForm[item.model]"
                    :prop="item.prop !== undefined ? item.prop : true"
                    :disabled="item.disabled !== undefined ? item.disabled : false"
                     :style="item.width ? {width: item.width + 'px'} : null"
                    :label="item.radio">{{item.label}}</el-radio>
                </el-form-item>
              </el-col>
              <!-- 下拉框 -->
              <el-col
                v-else-if="item.type === 'select'"
                :key="index"
                :span="item.span ? item.span : 12">
                <el-form-item
                  :key="index"
                  :label="item.label"
                  :prop="item.prop ? item.prop : item.model"
                  :label-width="item.labelWidth ? item.labelWidth + 'px' : null"
                  >
                  <el-select
                    v-model="dataForm[item.model]"
                    :key="index"
                    :clearable="item.clearable !== undefined ? item.clearable : true"
                    :placeholder="item.placeholder ? item.placeholder : '请选择内容'"
                    :disabled="item.disabled !== undefined ? item.disabled : false"
                    :style="item.width ? {width: item.width + 'px'} : null"
                    autocomplete="off">
                    <el-option
                      v-for="(ele, index) in item.selectOptions"
                      :key="index"
                      :label="ele[item.key]"
                      :value="ele[item.value]">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- 文本域 -->
              <el-col
                v-else-if="item.type === 'textarea'"
                :key="index"
                :span="item.span ? item.span : 12">
                <el-form-item
                  :key="index"
                  :label="item.label"
                  :prop="item.prop ? item.prop : item.model"
                  :label-width="item.labelWidth ? item.labelWidth + 'px' : null"
                  >
                  <el-input
                    v-model="dataForm[item.model]"
                    :placeholder="item.placeholder ? item.placeholder : '请输入内容'"
                    :clearable="item.clearable !== undefined ? item.clearable : true"
                    :disabled="item.disabled !== undefined ? item.disabled : false"
                    :style="item.width ? {width: item.width + 'px'} : null"
                    type="textarea"
                    autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
               <!-- 日期 -->
              <el-col
               v-else-if="item.type === 'date'"
              :key="index"
              :span="item.span ? item.span : 12">
                <el-form-item
                :key="index"
                :prop="item.prop ? item.prop : item.model"
                :label="item.name"
                :inline="true">
                  <el-date-picker
                    v-model="dataForm[item.model]"
                    :placeholder="item.placeholder ? item.placeholder : '请输入内容'"
                    :clearable="item.clearable !== undefined ? item.clearable : true"
                    :disabled="item.disabled !== undefined ? item.disabled : false"
                    :style="item.width ? {width: item.width + 'px'} : null"
                    :picker-options="item.pickerOptions"
                    :format="item.format"
                    :value-format="item.valueFormat"
                    type="date"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
               <!-- 日期 + 时间 -->
              <el-col
               v-else-if="item.type === 'datetime'"
              :key="index"
              :span="item.span ? item.span : 12">
                <el-form-item
                :key="index"
                :prop="item.prop ? item.prop : item.model"
                :label="item.name"
                :inline="true">
                  <el-date-picker
                    v-model="dataForm[item.model]"
                    :placeholder="item.placeholder ? item.placeholder : '请输入内容'"
                    :clearable="item.clearable !== undefined ? item.clearable : true"
                    :disabled="item.disabled !== undefined ? item.disabled : false"
                    :style="item.width ? {width: item.width + 'px'} : null"
                    :picker-options="item.pickerOptions"
                    :format="item.format ? item.format : 'yyyy-MM-dd hh:MM:ss'"
                    :value-format="item.valueFormat ? item.valueFormat : 'yyyy-MM-dd hh:MM:ss'"
                    type="datetime"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <!-- 输入框 -->
              <el-col
               v-else
              :key="index"
              :span="item.span ? item.span : 12">
                <el-form-item
                  :label="item.label"
                  :prop="item.prop ? item.prop : item.model"
                  :label-width="item.labelWidth ? item.labelWidth + 'px' : null"
                  :inline="true">
                    <el-input
                     v-model="dataForm[item.model]"
                    :placeholder="item.placeholder ? item.placeholder : '请输入内容'"
                    :clearable="item.clearable !== undefined ? item.clearable : true"
                    :disabled="item.disabled !== undefined ? item.disabled : false"
                    :style="item.width ? {width: item.width + 'px'} : null"
                    autocomplete="off" ></el-input>
                </el-form-item>
              </el-col>
            </template>
          </el-row>
        </el-form>
       </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="doSubmit">确 定</el-button>
      <el-button @click="cancel()">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import tileMap from '@/components/map/tileMap'// 初始化瓦片地图
import MapManager from '@/components/map/MapManager.js'
export default {
  components: {
    tileMap
  },
  props: {
    // 地图，表单配置项 详情见README.md
    formConfig: {
      type: Object,
      required: true,
      default: () => {
        return {
          map: true, // Boolean 是否显示地图 (默认为显示)
          dialogWidth: 1200, // Number 弹出框大小 (默认为1200)
          mapWidth: 60, // Number 地图大小 (默认为60%)
          formWidth: 40, // Number 表单大小 (默认为40%)
          mapbtn: [{
            layer: 'stakeNum', // 控制图层类型
            showlayer: true, // Boolean 图层默认是否展示
            icon: 'el-icon-view', // String 按钮icon
            title: 'layer' // 提示 默认为layer
          }], // Array 地图显示图层btn (默认为桩号)
          layer: ['stakeNum'], // 地图展示其他图层 (默认无)
          resetForms: true // 关闭dialg是否重置表单 (默认重置)
        }
      }
    },
    // 表单绑定数据 详情见README.md
    dataForm: {
      type: Object,
      required: true,
      default: () => {}
    },
    // 表单属性 详情见README.md
    formAttr: {
      type: Object,
      default: () => {}
    },
    // 表单类型列表配置 详情见README.md
    formList: {
      type: Array,
      required: true,
      default: () => []
    },
    // 弹出框类型 默认为添加
    isAdd: {
      type: Boolean,
      default: true
    },
    // dialog默认显示状态
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  methods: {
    // 图层控制按钮
    triggerLayer (obj, index) {
      let show = MapManager.getVisible(obj.layer)
      if (show) {
        this.$refs.map.showLayer(obj.layer, false)
        this.$refs[obj.layer][index].style.backgroundColor = '#F56C6C'
        this.$refs[obj.layer][index].title = obj.title ? obj.title : obj.layer + '隐藏'
      } else {
        this.$refs.map.showLayer(obj.layer, true)
        this.$refs[obj.layer][index].style.backgroundColor = '#85ce61'
        this.$refs[obj.layer][index].title = obj.title ? obj.title : obj.layer + '显示'
      }
    },
    // 框选的摄像机信息列表
    associateDevice () {
      let that = this
      this.$refs.map.startDrawWithSelCamera(function (cameras) {
        let cameraIds = []
        let cameraIps = []
        cameras.forEach(item => {
          cameraIds.push(item.id)
          cameraIps.push(item.ip)
        })
        that.$emit('selCamera', cameraIds.join(','), cameraIps.join(' '))
      })
    },
    // 绘制点图层
    startDraw () {
      this.$nextTick(() => {
        this.$refs.map.startDrawPoint(this.formConfig.type, this.setLnglat, [this.dataForm.longitude, this.dataForm.latitude])
      })
    },
    // 经纬度设置，同步表单
    setLnglat (point) {
      this.dataForm.longitude = point[0]
      this.dataForm.latitude = point[1]
    },
    // 关闭dialog
    cancel () {
      this.$parent.visible = false
      if (!this.formConfig.resetForms) return
      this.$refs['form'].resetFields()
    },
    // 点击确定
    doSubmit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.isAdd) {
            this.$emit('doAdd', this.dataForm)
          } else {
            this.$emit('doEdit', this.dataForm)
          }
        }
      })
    },
    // dialog出现回调
    openDialog () {
      let that = this
      this.$nextTick(() => {
        that.$refs.dialogMap.style.height = that.$refs.dialogForm.offsetHeight + 'px'
        // 重新加载地图
        that.$refs.map.resetMap()
        // 加载图层
        if (that.formConfig.layer !== undefined) {
          that.formConfig.layer.forEach((item, idnex, arr) => {
            that.$refs.map.addLayer(item)
            that.$refs.map.showLayer(item, true)
          })
        }
      })
    },
    // 初始化图层dome样式
    opened () {
      let that = this
      // 图层显示状态
      that.formConfig.mapbtn.forEach((item, index, arr) => {
        that.$refs.map.showLayer(item.layer, item.showlayer)
        if (item.showlayer) {
          that.$refs[item.layer][index].title = item.title ? item.title : item.layer + '显示'
          that.$refs[item.layer][index].style.cssText = `
              background-color: #85ce61;
              transition: all .3s;
            `
        } else {
          that.$refs[item.layer][index].title = item.title ? item.title : item.layer + '隐藏'
          that.$refs[item.layer][index].style.cssText = `
              background-color: #F56C6C;
              transition: all .3s;
            `
        }
      })
      this.startDraw()
      this.associateDevice()
    },
    // dialog关闭回调
    closeDialog () {
      this.formConfig.layer.forEach((item, idnex, arr) => {
        this.$refs.map.cleanLayer(item)
      })
    }
  }
}

</script>
<style scoped>
.container{
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.mapCont{
  height: inherit;
  width: 60%;
  float: left;
  position: relative;
}
.button{
  margin-bottom: 5px;
  border-radius: 50%;
  transition: all .3s;
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  color: #fff;
  cursor: pointer;
}
.buttonBox{
  position: absolute;
  right: 6px;
  bottom: 6px;
  width: 30px;
}
</style>
