<template>
  <div class="echartsBox" :style='{width: options.width,height: options.height}'>
    <div :id="options.id" :style='{width: options.width,height: options.height}'></div>
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {}
  },
  methods: {
    resize () {
      this.options.el.resize()
    },
    updated () {
      if (this.options.el) {
        this.options.el.setOption(this.options.option)
      }
    }
  },
  created () {

  },
  mounted () {
    let that = this
    that.options.el = echarts.init(document.getElementById(that.options.id))
    that.options.el.setOption(that.options.option)
  }
}
</script>
<style scoped>

</style>
