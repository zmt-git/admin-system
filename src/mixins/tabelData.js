import { Message } from 'element-ui'

export default {
  data () {
    return {
      total: 0,
      currentPage: 0,
      pageSizes: [15, 20, 30, 50],
      pageSize: 15,
      operates: {
        fixed: 'right',
        width: '200px',
        list: [
          { show: true, type: 'danger', icon: 'el-icon-delete', method: this.tabelDelete }, // 操作按钮 删除
          { show: true, type: 'info', icon: 'el-icon-edit', method: this.tabeledit } // 编辑按钮
        ]
      },
      isAdd: false,
      list: [],
      durationTip: 3000,
      editDataForm: {},
      deleteKey: 'ids',
      isformat: false,
      deleteVal: false,
      deleteValKey: 'code',
      options: {
        stripe: false, // 是否为斑马纹 table
        highlightCurrentRow: false, // 是否要高亮当前行
        loading: true, // 是否添加表格loading加载动画
        mutiSelect: true, // 是否支持列表项选中功能
        height: '20px',
        border: true,
        padding: '5px 0',
        hasPagination: true
      }
    }
  },
  methods: {
    // 分页改变当前条数
    handleSizeChange (e) {
      this.pageSize = e
      this.getTabelData(this.initDataFn)
    },

    // 分页改变当前页
    handleCurrentChange (e) {
      this.currentPage = e
      this.getTabelData(this.initDataFn)
    },

    // 分页数据更新
    upDatepagination (data) {
      this.total = data.total
      this.currentPage = data.current
      this.pageSize = data.size
    },

    // 获取表格分页数据
    getTabelData (fn) {
      fn({
        pageNum: this.currentPage,
        numPerPage: this.pageSize
      })
        .then(res => {
          this.upDatepagination(res.result)
          this.list = res.result.records
          this.options.loading = false
        })
        .catch(err => {
          console.log(err)
          this.options.loading = false
        })
    },

    // 获取搜索数据
    getSearchTabelData (fn, obj) {
      fn({
        pageNum: this.currentPage,
        numPerPage: this.pageSize,
        condition: obj
      })
        .then(res => {
          this.upDatepagination(res.result)
          this.list = res.result.records
        })
    },

    // 表格删除按钮
    tabelDelete (key, val) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let target = ''
        if (this.deleteVal) {
          target = val[this.deleteValKey]
        } else {
          target = val.id
        }
        this.deleteTabelData(target, this.deleteKey)
      }).catch(() => {
        Message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 表格删除数据
    deleteTabelData (id) {
      let obj = { }
      obj[this.deleteKey] = id
      this.deleteDataFn(obj)
        .then(res => {
          this.getTabelData(this.initDataFn)
          this.tip('删除成功', 'success')
        })
        .catch(error => {
          console.error(error)
          this.tip('删除失败', 'error')
        })
    },

    // 搜索 输入/改变 回调函数
    change (that, val) {
      if (!val) {
        this.getTabelData(this.initDataFn)
      }
    },

    // 获取搜索数据
    toQuery (query, options) {
      let obj = {}
      options.type.forEach((item) => {
        obj[item.queryname] = query[item.queryname]
      })
      this.getSearchTabelData(this.initDataFn, obj)
    },

    // 添加用户
    showAddDialog () {
      this.isAdd = true
      this.Dialogoptions.dialogVisible = true
      this.resetDataForm()
      this.$nextTick(() => {
        this.$refs.DialogForm.resetFields()
      })
    },

    // 表格编辑按钮
    tabeledit (key, val) {
      this.isAdd = false
      this.Dialogoptions.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.DialogForm.resetFields()
        let arr = Object.keys(this.dataForm)
        arr.forEach((item) => {
          this.dataForm[item] = val[item]
        })
        this.editDataForm = val
      })
    },

    // 弹出层添加 编辑
    /**
     * @param {Object} dataForm提交表单数据
     * @param {ArrayObject} formatArr
     */
    async confirm (dataForm) {
      let obj = {}
      if (this.isformat) {
        obj = this.formatTypes()
      } else {
        obj = dataForm
      }
      let msg = '编辑'
      if (this.isAdd) {
        msg = '添加'
        this.addDataFn(obj)
          .then(res => {
            this.getTabelData(this.initDataFn)
            this.tip(`${msg}成功`, 'success')
          })
          .catch(error => {
            console.error(error)
            this.tip(`${msg}失败`, 'error')
          })
      } else {
        this.editDataForm = Object.assign(this.editDataForm, obj)
        this.editDataFn(this.editDataForm)
          .then(res => {
            this.getTabelData(this.initDataFn)
            this.tip(`${msg}成功`, 'success')
          })
          .catch(error => {
            console.error(error)
            this.tip(`${msg}失败`, 'error')
          })
      }
      this.Dialogoptions.dialogVisible = false
    },

    // 重置dataForm 数据
    resetDataForm () {
      let dataFormKey = Object.keys(this.dataForm)
      dataFormKey.forEach(item => {
        this.dataForm[item] = null
      })
    },

    // 通知
    tip (msg, type) {
      Message({
        duration: this.durationTip,
        message: msg,
        type: type
      })
    },

    // 输入框值改变时
    changeDia (key, val) {
      // do something
      // console.log(key, val)
    },

    // 输入框的blur事件
    blur (key, val) {
      // do something
      // console.log(key, val)
    },

    // 批量删除
    deleteIds (list) {
      if (list.length <= 0) {
        this.tip('至少选择一项数据，进行批量删除', 'warning')
        return
      }
      let ids = []
      if (this.deleteVal) {
        list.forEach(item => {
          ids.push(item[this.deleteValKey])
        })
      } else {
        list.forEach(item => {
          ids.push(item.id)
        })
      }
      ids = ids.join(',')
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteTabelData(ids)
      }).catch(() => {
        Message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 解决select下拉框vuex监听不到属性变化
    /**
     * @param {*} options DialogForm组件下拉表配置详情见readme文件
     * @param {*} target设置属性名
     * @param {*} arr设置select的options
     */
    setSelectOptions (options = [], target, arr) {
      if (options.length > 0) {
        let indexs
        indexs = options.findIndex((ele, index) => {
          if (ele.model === target) {
            return index
          }
        })
        this.$set(options[indexs], 'selectOptions', arr)
      }
    }
  }
}
