<template>
  <!-- root element start-->
  <div class="textAlginLeft">

      <span class="title">引导灯</span>
      <el-select v-model="lampVal" placeholder="请选择引导灯编码">
        <el-option
          v-for="item in lampList"
          :key="item.lampVal"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button>开始调试</el-button>

      <span class="title">激光灯</span>
      <el-select v-model="ledVal" placeholder="请选择激光灯编码">
        <el-option
          v-for="item in ledList"
          :key="item.lampVal"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button>开始调试</el-button>

      <span class="title" >语音避险</span>
      <el-select v-model="voiceVal" placeholder="请选择语音避险编码">
        <el-option
          v-for="item in voiceList"
          :key="item.lampVal"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button>开始调试</el-button>

  </div>
  <!-- root element end-->
</template>
<script>
export default {
  name: 'alarm',
  data () {
    return {
      // 引导灯
      lampList: [],
      lampVal: '',
      // 激光灯
      ledList: [],
      ledVal: '',
      // 语音避险
      voiceList: [],
      voiceVal: ''
    }
  }
}
</script>
<style lang="scss" scoped>
.equipment {
  margin-bottom: 13px;
}
.title {
  display: inline-block;
  margin-right: 10px;
  margin-left: 10px;
}
</style>
