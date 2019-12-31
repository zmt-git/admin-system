<template>
  <div class="textAlginLeft">
    <el-drawer
      title="用户信息"
      :visible.sync="dialog"
      direction="rtl"
      size='320px'
      custom-class="demo-drawer"
      ref="drawer"
      @open='open'
      >
      <div class="demo-drawer__content">
        <p class="tit">用户信息</p>
        <ul class="user">
          <li>
            <span class="name">名称</span>
            <span class="info"></span>
          </li>
          <li>
            <span class="name">账号</span>
            <span class="info"></span>
          </li>
          <li>
            <span class="name">备注</span>
            <span class="info"></span>
          </li>
          <li>
            <span class="name">角色</span>
            <span class="info"></span>
          </li>
        </ul>
        <p class="tit">修改密码</p>
        <el-form :model="userForm" ref="userForm" :rules="userRoles" size="small" :inline="true">
          <el-form-item label="旧密码" prop='oldPassWord' label-width="80px">
            <el-input v-model="userForm.oldPassWord" type="password" placeholder="请输入旧密码"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop='newPassWord' label-width="80px">
            <el-input v-model="userForm.newPassWord" type="password" placeholder="请输入新密码" @input="checkStrength"></el-input>
          </el-form-item>
          <el-form-item label="重复密码" prop='repeatPassWord' label-width="80px">
            <el-input v-model="userForm.repeatPassWord" type="password" placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item label="密码强度" prop='repeatPassWord' label-width="80px">
            <el-progress :percentage="percentage" :format="format" :color="customColorMethod" style="width: 200px;margin-top: 7px;"></el-progress>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button size="mini" @click="dialog = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="confirmUser()" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
// API
import { updatePassWord } from '@/api/system/user'
export default {
  name: 'resource',
  data () {
    let that = this
    // let reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/
    let reg = /^[0-9a-zA-Z~!@#$%^&*()_+.?|,]{6,15}$/
    let userPassword = async (rule, value, callback) => {
      if (value !== that.userForm.newPassWord) {
        callback(new Error('两次密码输入不一致'))
      }
    }
    let oldPassword = async (rule, value, callback) => {
      if (!value) {
        callback(new Error('旧密码不能未空'))
      }
    }
    let newPassword = async (rule, value, callback) => {
      if (!reg.test(value)) {
        callback(new Error('密码包含字母数字或者特殊字符其中的任意一种，密码长度6-15位'))
      }
    }
    return {
      dialog: false,
      loading: false,
      userForm: {
        oldPassWord: '',
        repeatPassWord: '',
        newPassWord: ''
      },
      userRoles: {
        oldPassWord: [
          { validator: oldPassword, trigger: 'blur' }
        ],
        newPassWord: [
          { validator: newPassword, trigger: 'blur' }
        ],
        repeatPassWord: [
          { validator: userPassword, trigger: 'blur' }

        ]
      },
      percentage: 0,
      platformname: true,
      regStrong: /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*])[\da-zA-Z~!@#$%^&*]{8,15}$/,
      regMedium: /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,15}$/,
      regweak: /^[0-9a-zA-Z~!@#$%^&*]{6,15}$/,
      formLabelWidth: '80px'
    }
  },
  methods: {
    // 抽屉打开时回调函数
    open () {

    },

    // 显示抽屉方法
    show () {
      this.dialog = true
    },
    // 确认修改密码
    confirmUser () {
      this.$refs.userForm.validate(async (valid) => {
        if (valid) {
          this.loading = true
          let obj = JSON.parse(JSON.stringify(this.userForm))
          delete obj.repeatPassWord
          await updatePassWord(obj)
            .then(res => {
              this.$message({ type: 'success', message: '密码修改成功' })
            })
            .catch(err => {
              this.$message({ type: 'error', message: '密码修改失败' })
              console.log(err)
            })
          this.loading = false
          this.dialog = false
        }
      })
    },

    // 检测密码强度
    checkStrength () {
      if (this.regStrong.test(this.userForm.newPassWord)) {
        this.percentage = 100
      } else if (this.regMedium.test(this.userForm.newPassWord)) {
        this.percentage = (100 / 3 * 2)
      } else if (this.regweak.test(this.userForm.newPassWord)) {
        this.percentage = (100 / 3)
      } else {
        this.percentage = 0
      }
    },

    // 密码强度显示颜色
    customColorMethod () {
      if (this.percentage <= (100 / 3)) {
        return '#f56c6c'
      } else if (this.percentage <= (100 / 3 * 2)) {
        return '#e6a23c'
      } else {
        return '#67c23a'
      }
    },

    // 数字转化为汉字
    format () {
      if (this.percentage === 0) {
        return ''
      } else if (this.percentage <= (100 / 3)) {
        return '弱'
      } else if (this.percentage <= (100 / 3 * 2)) {
        return '中'
      } else {
        return '高'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.user{
  margin: 0 0 10px 0;
  & li{
    height: 30px;
    line-height: 30px;
    color: #72767b;
    font-weight: 600;
    font-size: 14px;
  }
}
.tit{
  font-weight: 600;
  color:dodgerblue;
}
</style>
<style>
.demo-drawer .el-drawer__body{
  padding: 0 10px
}
.demo-drawer .el-drawer__header {
  margin-bottom: 9px;
  padding: 10px;
  border-bottom: 1px solid #72767b;
  font-weight: 600;
}
</style>
