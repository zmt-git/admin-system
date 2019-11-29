<template>
  <el-dialog :title="title" :closeOnClickModal="false" :visible.sync="visible" width="550px">
    <el-form ref="form" :model="dataForm" :rules="rules" size="small" label-position="right" label-width="130px" style="padding: 0;margin: 0">
      <el-form-item label="父节点名称" v-show="showparent">
        <el-input v-model="dataForm.parentName" required="true" disabled="disabled" autocomplete="off" ></el-input>
      </el-form-item>
      <el-form-item :label="names" prop="name">
        <el-input v-model="dataForm.name" autocomplete="off" minlength="2" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="图标" prop="iconClass">
        <el-input v-model="dataForm.iconClass" autocomplete="off" ></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sortOrder">
        <el-input type="number" v-model.number="dataForm.sortOrder" :rules="{ required: !btnshow, message: '请输入排序', trigger: 'blur' }"></el-input>
      </el-form-item>
      <el-form-item label="组件路径" v-show="!btnshow" prop="component" :rules="{required: !btnshow, message: '组件路径不能为空', trigger: 'blur'}">
        <el-input type="text" v-model="dataForm.component" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="访问地址(path)" v-show="!btnshow" prop="uri" :rules="{required:!btnshow, message: '访问地址不能为空', trigger: 'blur'}">
        <el-input type="text" v-model="dataForm.uri" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" size="mini" @click="doSubmit()">确 定</el-button>
      <el-button size="mini" @click="cancel()">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { saveOrUpdateResource } from '@/api/system/system'
export default {
  computed: {
    names () {
      if (this.types === 'model') {
        return '模块名称'
      } else if (this.types === 'menu') {
        return '菜单名称'
      } else if (this.types === 'btn') {
        return '按钮名称'
      } else {
        return '名称'
      }
    }
  },
  data () {
    return {
      types: null,
      loading: false,
      visible: false,
      isAdd: false,
      title: '添加模块',
      modules: false,
      dataForm: { id: '', name: '', parentId: '', parentName: '', sortOrder: '', iconClass: '', component: '', url: '' },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入编码', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
          { pattern: /^[A-Za-z_-]+$/, message: '只能输入英文字符', trigger: 'blur' }
        ],
        component: [
          { message: '请输入组件路径', trigger: 'change' },
          { min: 3, max: 40, message: '长度在 3 到 40 个字符', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入访问地址', trigger: 'change' },
          { min: 3, max: 40, message: '长度在 3 到 40 个字符', trigger: 'blur' }
        ],
        sortOrder: [
          {
            type: 'number',
            min: 0,
            message: '排序不能小于0',
            trigger: 'blur'
          }
        ]
      },
      compdisabled: false,
      showparent: true,
      btnshow: false
    }
  },
  methods: {
    selectOne: function (event) {
      this.$parent.query.search_type = event
    },
    cancel: function () {
      this.resetForm()
    },
    resetForm () {
      this.visible = false
      this.$refs['form'].resetFields()
      this.dataForm = { id: '', name: '', parentId: '', parentName: '', type: '0', uri: '', sortOrder: '', iconClass: '', component: '' }
    },
    doSubmit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.isAdd) {
            // 添加模块 添加功能菜单 添加按钮
            saveOrUpdateResource(this.dataForm).then(res => {
              this.resetForm()
              this.$message({
                message: '添加成功',
                type: 'success',
                duration: 2500
              })
              this.loading = false
              this.$parent.page = 0
              this.$parent.dialogFormVisible = false
              this.$parent.init()
            }).catch(err => {
              console.log('error:' + err)
              console.log(err)
            })
          } else {
            this.doEdit()
          }
        }
      })
    },
    doEdit () {
      if (!this.isAdd) {
        saveOrUpdateResource(this.dataForm).then(res => {
          this.resetForm()
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 2500
          })
          this.loading = false
          this.$parent.dialogFormVisible = false
          this.$parent.init()
        }).catch(err => {
          console.log('error:' + err)
          console.log(err)
        })
      }
    }
  },
  watch: {
    compdisabled: function (val) {
      this.$nextTick(() => {
        if (!val) {
          this.$refs.form.validateField('component')
          this.$refs.form.validateField('content')
        }
      })
    }

  }
}

</script>
