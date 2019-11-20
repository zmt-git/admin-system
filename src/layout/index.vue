<template>
  <div>
    <el-button @click='test'></el-button>
  </div>
</template>
<script>
import { loadMenus } from '@/api/login/login'
export default {
  name: 'layout',
  data () {
    return {}
  },
  methods: {
    test () {
      loadMenus()
        .then(res => {
          console.log(res)
        })
        .catch(error => {
          console.error(error)
        })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
