<template>
  <div>
    <el-dialog
      :title="options.title"
      :visible.sync="options.popoverVisible"
      :width="options.width ? options.width : '610px'">
      <span>
        <!-- 复选框 开始 -->
        <template v-if="options.type === 'checkbox'">
          <el-checkbox-group
            :disabled='options.disabled'
            v-model="checkedList"
            text-color='#fff'
            fill='#00b333'
          >
            <div class="checkBox"
              v-for="(item, index) in itemLists"
              :class="options.inlineBlock ? options.inlineBlock : 'inlineBlock'"
              :key='index'
            >
              <el-checkbox :label="item[options.label]">{{item[options.name]}}</el-checkbox>
            </div>
          </el-checkbox-group>
        </template>
        <!-- 复选框 开始 -->

        <!-- 单选框 开始 -->
        <template v-else-if="options.type === 'radio'">
          <el-radio-group v-model="radio" :disabled='options.disabled'>
            <div class="checkBox"
              v-for="(item, index) in itemLists"
              :class="options.inlineBlock ? options.inlineBlock : 'inlineBlock'"
              :key='index'
            >
              <el-radio :label="item[options.label]">{{item[options.name]}}</el-radio>
            </div>
          </el-radio-group>
        </template>
        <!-- 单选框 开始 -->

      </span>
      <span slot="footer" class="dialog-footer" v-if="options.showFooter">
        <el-button size="mini" @click="options.popoverVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmCheck()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'group',
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          type: 'checkbox',
          title: '设备分组',
          popoverVisible: false,
          width: '610px',
          label: 'id',
          name: 'name',
          disabled: false,
          showFooter: true
        }
      }
    },
    itemLists: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data () {
    return {
      popoverVisible: false,
      radio: -1,
      checkedList: []
    }
  },
  methods: {
    confirmCheck () {
      if (this.options.type === 'radio') {
        this.$emit('confirmCheck', this.radio)
      } else {
        this.$emit('confirmCheck', this.checkedList)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.checkBox{
  padding-left: 20px;
  line-height: 30px;
}
.inlineBlock{
  display: inline-block;
  padding-top: 10px;
}
</style>
