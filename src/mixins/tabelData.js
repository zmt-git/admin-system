import { Message } from 'element-ui'

export default {
  data () {
    return {
      _searchCode: null, // 混入后不建议重新定义修改
      _searchGroupId: null, // 混入后不建议重新定义修改
      _searchSubmit: {}, // 混入后不建议重新定义修改
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
      },
      tableLoading: ['options'],
      defaultParams: {
        pageNum: this.currentPage,
        numPerPage: this.pageSize
      },
      querySearch: {}
    }
  },
  methods: {
    /**
     * @function 分页改变当前条数
     * @param {*} e改变值
     */
    handleSizeChange (e) {
      this.pageSize = e
      let obj2 = this.submitKey()
      this.getTabelData(this.initDataFn, obj2)
    },

    /**
     * @function 分页改变当前页
     * @param {*} e改变值
     */
    handleCurrentChange (e) {
      this.currentPage = e
      let obj2 = this.submitKey()
      this.getTabelData(this.initDataFn, obj2)
    },

    /**
     * @function 分页数据更新
     * @param {*} data请求返回值
     */
    upDatepagination (data) {
      this.total = data.total
      this.currentPage = data.current
    },

    /**
     * @function 获取表格分页数据
     * @param {*} fn
     * @param {*} [obj=this.defaultParams]提交字段，默认值为defaultParams
     */
    async getTabelData (fn, obj = this.defaultParams) {
      await fn(obj)
        .then(res => {
          this.upDatepagination(res.result)
          this.list = res.result.records
        })
        .catch(err => {
          console.log(err)
        })
      this.tableLoading.forEach(item => {
        this[item].loading = false
      })
    },

    /**
     * @function 搜索条件查询数据
     * @param {*} fn回调函数
     */
    getSearchTabelData (fn) {
      let obj2 = this.submitKey()
      this.getTabelData(fn, obj2)
    },

    /**
     * @function 搜索数据提交字段
     * @returns obj2 提交字段
     */
    submitKey () {
      let obj2 = {}
      if (this._searchCode && this._searchGroupId) {
        obj2 = {
          groupId: this.groupId,
          pageNum: this.currentPage,
          numPerPage: this.pageSize,
          sysCriteria: {
            condition: this._searchSubmit
          }
        }
      } else if (this._searchCode) {
        obj2 = {
          pageNum: this.currentPage,
          numPerPage: this.pageSize,
          sysCriteria: {
            condition: this._searchSubmit
          }
        }
      } else if (this._searchGroupId) {
        obj2 = {
          groupId: this._searchGroupId,
          pageNum: this.currentPage,
          numPerPage: this.pageSize
        }
      } else {
        obj2 = {
          pageNum: this.currentPage,
          numPerPage: this.pageSize
        }
      }
      return obj2
    },

    /**
     * @function 表格删除数据（按钮）
     * @param {*} key为选中数据的index
     * @param {*} val为选中数据的code
     */
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

    /**
     * @function 删除表格数据（批量）
     * @param {*} id为选中数据的codes
     */
    deleteTabelData (id) {
      let obj = { }
      obj[this.deleteKey] = id
      this.deleteDataFn(obj)
        .then(res => {
          let obj2 = this.submitKey()
          this.getTabelData(this.initDataFn, obj2)
          this.tip('删除成功', 'success')
        })
        .catch(error => {
          console.error(error)
          this.tip('删除失败', 'error')
        })
    },

    /**
     * @function 搜索表单value值改变回调
     * @param {*} that_搜索组件this
     * @param {*} val表单绑定value
     */
    change (that, val) {
      this._searchCode = val
      if (!val) {
        let obj2 = this.submitKey()
        this.getTabelData(this.initDataFn, obj2)
      }
    },

    /**
     * @function 搜索查看分组下拉框改变
     * @param {*} that_搜索组件this
     * @param {*} val表单绑定value
     */
    onChangeSelect (that, val) {
      this._searchGroupId = val
      if (val.toString !== '0' && !val) {
        let obj2 = this.submitKey()
        this.getTabelData(this.initDataFn, obj2)
      }
    },

    /**
     * @function 获取搜索数据目前查询:code,groupId
     * @param {*} query搜索数据表单绑定值
     * @param {*} options搜索表单配置
     */
    toQuery (query, options) {
      let obj = {}
      this.querySearch = query
      options.type.forEach((item) => {
        obj[item.queryname] = query[item.queryname]
      })
      this._searchGroupId = query.groupId

      // 删除对象中的groupId
      delete obj.groupId
      this._searchSubmit = obj
      this.getSearchTabelData(this.initDataFn)
    },

    /**
     * @function 添加用户
     */
    showAddDialog () {
      this.isAdd = true
      this.Dialogoptions.dialogVisible = true
      this.resetDataForm()
      this.$nextTick(() => {
        this.$refs.DialogForm.resetFields()
      })
    },

    /**
     * @function 表格编辑按钮
     * @param {*} key下标
     * @param {*} val表格选中数据
     */
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

    /**
     * @function 弹出层添加、编辑
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
            let obj2 = this.submitKey()
            this.getTabelData(this.initDataFn, obj2)
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
            let obj2 = this.submitKey()
            this.getTabelData(this.initDataFn, obj2)
            this.tip(`${msg}成功`, 'success')
          })
          .catch(error => {
            console.error(error)
            this.tip(`${msg}失败`, 'error')
          })
      }
      this.Dialogoptions.dialogVisible = false
    },

    /**
     * @function 重置dataForm数据
     */
    resetDataForm () {
      let dataFormKey = Object.keys(this.dataForm)
      dataFormKey.forEach(item => {
        this.dataForm[item] = null
      })
    },

    /**
     * @function 通知
     * @param {*} msg提示消息
     * @param {*} type提示类型
     */
    tip (msg, type) {
      Message({
        duration: this.durationTip,
        message: msg,
        type: type
      })
    },

    /**
     * @function 表单的change事件
     * @param {*} key绑定值的key
     * @param {*} val绑定值的value
     */
    changeDia (key, val) {
      // do something
      // console.log(key, val)
    },

    /**
     * @function 输入框的blur事件
     * @param {*} key绑定值的key
     * @param {*} val绑定值的value
     */
    blur (key, val) {
      // do something
      // console.log(key, val)
    },

    /**
     * @function 批量删除
     * @param {*} list表格选中数据
     */
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

    /**
     * @function 解决select下拉框vuex监听不到属性变化
     * @param {*} options_DialogForm组件下拉表配置详情见readme文件
     * @param {*} target设置属性名
     * @param {*} arr设置select的options
     */
    setSelectOptions (options = [], target, arr, key = 'model', targetKey = 'selectOptions') {
      if (options.length > 0) {
        let indexs
        indexs = options.findIndex((ele, index) => {
          if (ele[key] === target) {
            return index
          }
        })
        this.$set(options[indexs], targetKey, arr)
      }
    },

    /**
     * @function 查看分组
     * @param {*} prop表格绑定属性
     * @param {*} row表格点击数据
     */
    async viewGroups (prop, row) {
      let index = this.columns.findIndex(item => {
        return item.prop === prop
      })
      this.$set(this.columns[index], 'showList', ['空'])
      this.$set(this.columns[index], 'loading', true)
      await this.getDeviceGroupFn({ code: row.code })
        .then(res => {
          this.$set(this.columns[index], 'showList', res.result)
        })
        .catch(err => {
          this.tip('获取分组信息失败', 'error')
          console.log(err)
        })
      this.$set(this.columns[index], 'loading', false)
    }
  }
}
