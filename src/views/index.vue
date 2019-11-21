<template>
  <div>
    <XButton :info='btn'></XButton>
  </div>
</template>
<script>
import XButton from '@/components/Button/Button'
export default {
  name: 'resource',
  components: {
    XButton
  },
  data () {
    return {
      btn: { name: '主页' }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
