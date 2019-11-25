<template>
  <div class="head-container">
    <el-form :inline="true" class="demo-form-inline" v-model="query">
      <template v-for="(item, key, index) in options.type">
        <el-form-item style="margin-top:2px;" v-if="item.type === 'select'" :key="index" :label="item.name" :class="options.labelClass">
          <el-select
            :clearable="item.clearable"
            :disabled="item.disabled"
            v-model="item.query"
            @change="item.callback(that, item.query)"
            :placeholder="item.placeholder"
            :style="{width:item.width, height: item.height}"
          >
            <el-option v-for="(ele,index) in item.options" :label="ele[item.optionskey.label]" :value="ele[item.optionskey.value]" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-top:2px;" v-if="item.type === 'input'" :key="index" :label="item.name" :class="options.labelClass">
          <el-input
            :clearable="item.clearable"
            v-model="item.query"
            @input="item.callback(that, item.query)"
            :disabled="item.disabled"
            :placeholder="item.placeholder"
            :style="{width:item.width, height: item.height}">
          </el-input>
        </el-form-item>
        <el-form-item style="margin-top:2px;" v-if="item.type === 'data'" :key="index" :label="item.name" :class="options.labelClass">
          <el-date-picker
           :clearable="item.clearable"
            v-model="item.query"
            @change="item.callback(that, item.query)"
            :disabled="item.disabled"
            :placeholder="item.placeholder"
            :style="{width:item.width, height: item.height}"
            :picker-options="item.pickerOptions"
            type="date"
            :format="item.format"
            :value-format="item.valueFormat"
          >
          </el-date-picker>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button-group>
          <el-button type="primary" size="mini" icon="el-icon-search" @click="toQuery">查询</el-button>
        </el-button-group>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { formatTime } from '@/utils/format'
export default {
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          type: [{
            type: 'input', // input, select, data
            name: '搜索',
            clearable: false,
            placeholder: '请输入搜索内容',
            width: null, // 宽度（内联样式）
            options: [], // select类型使用,
            optionskey: { label: 'label', value: 'value' }, // 用于label，value使用
            queryname: 'query',
            query: null,
            callback: this.callback,
            size: 'mini', // element medium / small / mini
            format: 'yyyy-MM-dd', // 时间插件
            valueFormat: 'yyyy-MM-dd', // 时间插件
            pickerOptions: null
          }],
          btnName: '查询',
          hasdefault: false,
          labelClass: null,
          intervalText: { index: -1, text: null }
        }
      }
    }
  },
  data () {
    return {
      that: this,
      query: {}
    }
  },
  methods: {
    callback (that, val) {
      this.$emit('change', that, val)
    },
    toQuery () {
      this.options.type.forEach((item, index, arr) => {
        this.$set(this.query, item.queryname, this.options.type[index].query)
      })
      this.$emit('toQuery', this.query, this.options)
    },
    setDefaultQuery () {
      let that = this
      let len = this.options.type.length
      this.options.type.forEach((item, index, arr) => {
        if (Object.keys(item).includes('defaultquery')) {
          if (item.type === 'select') {
            if (that.options.type[index].options.length === 0) {
              that.options.type[index].query = null
            } else {
              that.options.type[index].query = that.options.type[index].options[0][that.options.type[index].optionskey.value]
            }
          } else if (item.type === 'data') {
            let nowDate = new Date()
            nowDate.setMonth(nowDate.getMonth() - (len - 1 - index))
            that.options.type[index].query = formatTime(that.options.type[index].valueFormat, that.options.type[index].valueFormat, nowDate)
          }
        }
      })
      if (this.options.hasdefault) {
        this.toQuery()
      }
    }
  },
  mounted () {
    if (this.options.hasdefault) {
      this.setDefaultQuery()
    }
  }
}
</script>
<style scoped>
.head-container{
  padding: 5px 10px 0;
  height: 55px;
}
</style>
