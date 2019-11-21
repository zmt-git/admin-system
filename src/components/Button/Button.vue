<template>
  <div>
    <el-button
      :type='info.type'
      :plain='info.plain'
      :size='info.size'
      :round='info.round'
      :circle='info.circle'
      :loading='info.loading'
      :disabled='info.disabled'
      :icon='info.icon'
      :autofocus='info.autofocus'
    >{{info.name}}</el-button>
  </div>
</template>
<script>
export default {
  props: {
    info: {
      type: Object,
      default: () => {
        return Object.assign(this.info, this.defaultInfo)
      }
    }
  },
  data () {
    return {
      defaultInfo: {
        type: 'success',
        name: '添加',
        plain: false,
        size: 'mini',
        round: false,
        circle: false,
        loading: false,
        disabled: false,
        icon: 'el-icon-plus',
        autofocus: false
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
