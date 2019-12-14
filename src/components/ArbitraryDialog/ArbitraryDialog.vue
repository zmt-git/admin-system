<template>
  <el-dialog
  :title="'设备任意指令' + '(' + code + ')'"
  :visible.sync="dialogVisible"
  @close='close'
  width="610">
  <div style="padding-top: 15px;padding-right: 10px;">
  <el-form :model="dataForm" size="mini" ref="dataForm" label-width="100px" :rules="rules" class="demo-dynamic">
    <el-form-item
      prop="msg"
      label="任意指令">
      <el-input v-model="dataForm.msg"></el-input>
    </el-form-item>
  </el-form>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
    <el-button size="mini" type="primary" @click="confirm">确 定</el-button>
  </span>
</el-dialog>
</template>
<script>
export default {
  name: 'arbitrary',
  props: {
    code: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogVisible: false,
      dataForm: {
        code: this.code,
        msg: ''
      },
      rules: {
        msg: [{ required: true, message: '请输入指令', trigger: 'blur' }]
      }
    }
  },
  methods: {
    show () {
      this.dialogVisible = true
    },
    confirm () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.dataForm.code = this.code
          this.dialogVisible = false
          this.$emit('confirm', this.dataForm)
        }
      })
    },
    close () {
      this.$refs.dataForm.resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
