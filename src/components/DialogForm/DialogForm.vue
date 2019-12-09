<template>
<!-- root elemet start -->
  <div class="dialogMinWidth">

    <!-- 弹框 开始  -->
    <template>
      <el-dialog
        :title="isAdd ? '添加' + options.title : '编辑' + options.title + '(' + dataForm.code + ')'"
        :width="options.width ? options.width : '590px'"
        min-width='590px;'
        :close-on-click-modal='false'
        :append-to-body='true'
        :visible.sync="options.dialogVisible">

        <!-- 弹框主体 开始 -->
        <span>

          <!-- 表单 开始 -->
          <template>
            <el-form
            ref="form"
            size="small"
            :model="dataForm"
            :rules="formAttr.rules ? formAttr.rules : {}"
            :label-width="formAttr.labelWidth ? formAttr.labelWidth + 'px' : null" >
            <el-row>

              <!-- 表单元素 开始 -->
              <template v-for="(item, index) in formLists">

                <!-- 单选按钮 开始-->
                <el-col
                  v-if="item.type === 'radio'"
                  :key="index"
                  :span="item.span ? item.span : 12">
                  <el-form-item
                    :label="item.label"
                    :prop="item.prop ? item.prop : item.model"
                    :label-width="item.labelWidth ? item.labelWidth + 'px' : '80px'"
                    :inline="item.inline ? item.inline : true">
                      <el-radio
                      v-model="dataForm[item.model]"
                      :prop="item.prop !== undefined ? item.prop : true"
                      :disabled="item.disabled !== undefined ? item.disabled : false"
                      :style="item.width ? {width: item.width + 'px'} : 'width: 200px'"
                      :label="item.radio"
                      @change="item.change ? item.change(item.model, dataForm) : change(item.model, dataForm)"
                      >{{item.label}}</el-radio>
                  </el-form-item>
                </el-col>
                <!-- 单选按钮 结束-->

                <!-- 下拉框 开始 -->
                <el-col
                  v-else-if="item.type === 'select'"
                  :key="index"
                  :span="item.span ? item.span : 12">
                  <el-form-item
                    :key="index"
                    :label="item.label"
                    :prop="item.prop ? item.prop : item.model"
                    :label-width="item.labelWidth ? item.labelWidth + 'px' : '80px'"
                    :inline="item.inline ? item.inline : true"
                    >
                    <el-select
                      v-model="dataForm[item.model]"
                      :key="index"
                      :multiple='!!item.multiple'
                      :collapse-tags='!!item.collapseTags'
                      :clearable="item.clearable !== undefined ? item.clearable : true"
                      :placeholder="item.placeholder ? item.placeholder : '请选择内容'"
                      :disabled="item.disabled !== undefined ? item.disabled : false"
                      :style="item.width ? {width: item.width + 'px'} : 'width: 200px'"
                      @change="item.change ? item.change(item.model, dataForm) : change(item.model, dataForm)">
                      <el-option
                        v-for="(ele, index) in item.selectOptions"
                        :key="index"
                        :label="ele[item.key]"
                        :value="ele[item.value]">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- 下拉框 结束-->

                <!-- 文本域 开始-->
                <el-col
                  v-else-if="item.type === 'textarea'"
                  :key="index"
                  :span="item.span ? item.span : 12">
                  <el-form-item
                    :key="index"
                    :label="item.label"
                    :prop="item.prop ? item.prop : item.model"
                    :label-width="item.labelWidth ? item.labelWidth + 'px' : '80px'"
                    :inline="item.inline ? item.inline : true"
                    >
                    <el-input
                      v-model="dataForm[item.model]"
                      :placeholder="item.placeholder ? item.placeholder : '请输入内容'"
                      :clearable="item.clearable !== undefined ? item.clearable : true"
                      :disabled="item.disabled !== undefined ? item.disabled : false"
                      :style="item.width ? {width: item.width + 'px'} : 'width: 200px'"
                      type="textarea"
                      @change="item.change ? item.change(item.model, dataForm) : change(item.model, dataForm)"
                      @blur="item.change ? item.blur(item.model, dataForm) : blur(item.model, dataForm)"
                      @focus="item.change ? item.focus(item.model, dataForm) : focus(item.model, dataForm)"
                      autocomplete="off"></el-input>
                  </el-form-item>
                </el-col>
                <!-- 文本域 结束-->

                <!-- 日期 开始-->
                <el-col
                  v-else-if="item.type === 'date'"
                  :key="index"
                  :span="item.span ? item.span : 12">
                  <el-form-item
                  :key="index"
                  :label="item.label"
                  :prop="item.prop ? item.prop : item.model"
                  :label-width="item.labelWidth ? item.labelWidth + 'px' : '80px'"
                  :inline="item.inline ? item.inline : true">
                    <el-date-picker
                      v-model="dataForm[item.model]"
                      :placeholder="item.placeholder ? item.placeholder : '请输入内容'"
                      :clearable="item.clearable !== undefined ? item.clearable : true"
                      :disabled="item.disabled !== undefined ? item.disabled : false"
                      :style="item.width ? {width: item.width + 'px'} : 'width: 200px'"
                      :picker-options="item.pickerOptions"
                      :format="item.format"
                      :value-format="item.valueFormat"
                      type="date"
                      @change="item.change ? item.change(item.model, dataForm) : change(item.model, dataForm)"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <!-- 日期 结束-->

                <!-- 日期 + 时间 开始-->
                <el-col
                  v-else-if="item.type === 'datetime'"
                  :key="index"
                  :span="item.span ? item.span : 12">
                  <el-form-item
                  :key="index"
                  :label="item.label"
                  :prop="item.prop ? item.prop : item.model"
                  :label-width="item.labelWidth ? item.labelWidth + 'px' : '80px'"
                  :inline="item.inline ? item.inline : true">
                    <el-date-picker
                      v-model="dataForm[item.model]"
                      :placeholder="item.placeholder ? item.placeholder : '请输入内容'"
                      :clearable="item.clearable !== undefined ? item.clearable : true"
                      :disabled="item.disabled !== undefined ? item.disabled : false"
                      :style="item.width ? {width: item.width + 'px'} : 'width: 200px'"
                      :picker-options="item.pickerOptions"
                      :format="item.format ? item.format : 'yyyy-MM-dd hh:MM:ss'"
                      :value-format="item.valueFormat ? item.valueFormat : 'yyyy-MM-dd hh:MM:ss'"
                      type="datetime"
                      @change="item.change ? item.change(item.model, dataForm) : change(item.model, dataForm)"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <!-- 日期 + 时间 结束-->

                <!-- 输入框 开始-->
                <el-col
                  v-else
                  :key="index"
                  :span="item.span ? item.span : 12">
                  <el-form-item
                    :label="item.label"
                    :prop="item.prop ? item.prop : item.model"
                    :label-width="item.labelWidth ? item.labelWidth + 'px' : '80px'"
                    :inline="item.inline ? item.inline : true">
                      <el-input
                      :type='item.type ? item.type : ""'
                      v-model="dataForm[item.model]"
                      :placeholder="item.placeholder ? item.placeholder : '请输入内容'"
                      :clearable="item.clearable !== undefined ? item.clearable : true"
                      :disabled="item.disabled !== undefined ? item.disabled : false"
                      :style="item.width ? {width: item.width + 'px'} : 'width: 200px'"
                      @change="item.change ? item.change(item.model, dataForm) : change(item.model, dataForm)"
                      @blur="item.blur ? item.blur(item.model, dataForm) : blur(item.model, dataForm)"
                      @focus="item.focus ? item.focus(item.model, dataForm) : focus(item.model, dataForm)"
                      autocomplete="off" ></el-input>
                  </el-form-item>
                </el-col>
                <!-- 输入框 结束-->

              </template>
              <!-- 表单元素 结束 -->

            </el-row>
          </el-form>
          </template>
          <!-- 表单 结束 -->

        </span>
        <!-- 弹框主体 结束 -->

        <!-- footer start -->
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancel">取 消</el-button>
          <el-button size="mini" type="primary" @click="confirm">确 定</el-button>
        </span>
        <!-- footer end -->
      </el-dialog>
    </template>
    <!-- 弹框 结束  -->

  </div>
<!-- root elemet start -->
</template>
<script>
export default {
  name: 'dialogForm',
  props: {
    options: {
      type: Object,
      required: true,
      default: () => {
        return {
          title: '提示', // 弹框标题
          width: '30%', // 弹框宽度
          dialogVisible: false, // 弹框默认显示，隐藏状态属性
          inline: false // 表单是否为内联
        }
      }
    },
    formAttr: {
      type: Object,
      default: () => {
        return {
          rules: {},
          labelWidth: null
        }
      }
    },
    formLists: {
      type: Array,
      default: () => {}
    },
    dataForm: {
      type: Object,
      default: () => {}
    },
    isAdd: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    // 取消关闭弹框
    cancel () {
      this.$parent.Dialogoptions.dialogVisible = false
    },

    // 确认
    confirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('confirm', this.dataForm)
        }
      })
    },

    // 输入框值改变时
    change (key, val) {
      this.$emit('change', key, val)
    },

    // 输入框的blur事件
    blur (key, val) {
      this.$emit('blur', key, val)
    },
    // 输入框的focus事件
    focus (key, val) {
      this.$emit('focus', key, val)
    },

    // 重置表单数据、
    resetFields () {
      this.$refs.form.resetFields()
    }
  },
  watch: {
    isAdd (newVal, oldVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.dialogMinWidth{
  min-width: 590px;
}
</style>
