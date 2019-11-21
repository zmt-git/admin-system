<template>
  <div>
    <el-button-group>
      <el-button type="primary" icon="el-icon-share" size="mini" @click="showAddDialog()">添加模块</el-button>
      <el-button type="success" icon="el-icon-plus" size="mini" @click="showAddMenu()">添加功能菜单</el-button>
      <el-button type="info" icon="el-icon-plus" size="mini" @click="doAddBtns()">添加增删改按钮</el-button>
      <el-button type="warning" icon="el-icon-plus" size="mini">添加按钮</el-button>
      <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEdit()">修改</el-button>
      <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeNode()">删除</el-button>
    </el-button-group>
    <div class="ztree_box custom-scroll table-responsive">
      <ul id="tree-rec" class="ztree" style="margin-top: 5px;min-height:400px;overflow: auto;"></ul>
    </div>
    <diaForm ref="form"></diaForm>
  </div>
</template>
<script>
import diaForm from './dialogForm'
import 'jquery'
import 'ztree'
import 'ztree/css/metroStyle/metroStyle.css'
import { getTreeResource, saveOrUpdateResource } from '@/api/system/system'
export default {
  components: {
    diaForm
  },
  name: 'areaZtree',
  data () {
    return {
      setting: {
        edit: {
          enable: true,
          showRemoveBtn: false,
          showRenameBtn: false,
          drag: {
            autoExpandTrigger: false,
            prev: this.prevTree,
            next: this.nextTree,
            inner: this.innerTree
          }
        },
        check: {
          enable: false
        },
        data: {
          simpleData: {
            enable: true
          }
        },
        callback: {
          onClick: this.treeClick,
          beforeDrop: this.confirmDrop,
          onDrop: this.moveNode,
          onExpand: this.zTreeOnExpand
        }
      },
      zNodes: [],
      clickId: '',
      showAdd: false,
      treeNode: {}
    }
  },
  methods: {
    init: function (selectId) {
      let that = this
      getTreeResource().then(res => {
        that.zNodes.pop()
        that.zNodes.push(...res.result)
        // eslint-disable-next-line no-undef
        var tree = $.fn.zTree.init($('#tree-rec'), that.setting, that.zNodes)
        var node = tree.getNodeByParam('pId', selectId, null)
        tree.expandNode(node, true, false, false)
      }).catch(err => {
        console.log('error:' + err)
        console.log(err)
      })
    },
    treeClick: function (event, treeId, treeNode, clickFlag) {
      this.clickId = treeNode.id
      this.treeNode = treeNode
    },
    confirmDrop: function () {},
    moveNode: function () {},
    zTreeOnExpand: function () {

    },
    prevTree: function (treeId, treeNodes, targetNode) {
      return targetNode.parentTId === treeNodes[0].parentTId
    },
    nextTree: function (treeId, treeNodes, targetNode) {
      return targetNode.parentTId === treeNodes[0].parentTId
    },
    innerTree: function (treeId, treeNodes, targetNode) {
      return targetNode != null && targetNode.pId !== '00'
    },
    showAddDialog () {
      if (this.clickId.length === 0) {
        this.$message.error('请选择父模块')
        return
      }
      this.$refs.form.visible = true
      this.$refs.form.title = '添加模块'
      this.$refs.form.isAdd = true
      this.$refs.form.compdisabled = true
      this.$refs.form.dataForm.component = 'Layout'
      this.$refs.form.dataForm.parentid = this.clickId
      this.$refs.form.dataForm.resourceName = this.treeNode.name
      this.showAdd = true
    },
    showAddMenu () {
      if (this.clickId.length === 0) {
        this.$message.error('请选择父节点模块')
        return
      }
      this.$refs.form.isAdd = true
      this.$refs.form.visible = true
      this.$refs.form.title = '添加功能菜单'
      this.$refs.form.compdisabled = false
      // this.$refs.form.dataForm.component = ""
      this.$refs.form.dataForm.parentid = this.clickId
      this.$refs.form.dataForm.leaf = true
      this.$refs.form.dataForm.resourceName = this.treeNode.name
      this.showAdd = true
    },
    // 快速添加按钮
    doAddBtns () {
      if (this.clickId.length === 0) {
        this.$message.error('请选择父菜单')
      } else {
        saveOrUpdateResource(this.clickId).then(res => {
          this.$notify({
            title: '添加成功',
            type: 'success',
            duration: 2500
          })
          this.init(this.clickId)
        }).catch(err => {
          console.log('error:' + err)
          console.log(err)
        })
      }
    },
    showEdit () {
      if (this.clickId.length === 0) {
        this.$message.error('请选择父菜单')
      } else {
        this.$refs.form.title = '修改信息'
        this.$refs.form.visible = true
        this.$refs.form.isAdd = false
        this.$refs.form.showparent = false

        // 如果是按钮，则隐藏排序和访问路径字段
        if (this.treeNode.type === '1') {
          this.$refs.form.btnshow = true
        } else {
          this.$refs.form.btnshow = false
        }
        this.$refs.form.dataForm = {
          id: this.clickId,
          name: this.treeNode.name,
          parentid: this.treeNode.parentid,
          resourceName: '',
          type: this.treeNode.type,
          code: this.treeNode.code,
          sortOrder: this.treeNode.sortOrder,
          icon: this.treeNode.icon,
          content: this.treeNode.content,
          component: this.treeNode.component,
          iframe: this.treeNode.iframe,
          leaf: this.treeNode.leaf
        }
      }
    },
    removeNode () {
      if (this.clickId.length === 0) {
        this.$message.error('请选择要删除的功能菜单！')
        return
      }
      this.$confirm('删除后数据将无法恢复，确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // del(this.clickId).then(res => {
        //   this.$message({
        //     message: '删除成功',
        //     type: 'success'
        //   })
        //   this.init()
        // }).catch(err => {
        //   console.log('error:' + err)
        //   console.log(err)
        // })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }

  },
  created () {

  },
  mounted () {
    this.init(1)
  }
}
</script>
<style lang="scss" scoped>
  .custom-scroll{
    height:calc(100vh - 150px);
    overflow-y: scroll;
    background-color: #fff;
  }
</style>
