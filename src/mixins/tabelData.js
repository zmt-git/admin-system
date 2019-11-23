export default {
  data () {
    return {
      total: 0,
      currentPage: 0,
      pageSizes: [15, 20, 30, 50],
      pageSize: 15
    }
  },
  methods: {
    // 分页改变当前条数
    handleSizeChange (e) {
      this.pageSize = e
      this.getTabelData(this.initData)
    },

    // 分页改变当前页
    handleCurrentChange (e) {
      this.currentPage = e
      this.getTabelData(this.initData)
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
        })
    },

    // 获取搜索数据
    getSearchTabelData (fn, query) {
      fn({
        pageNum: this.currentPage,
        numPerPage: this.pageSize,
        condition: { [this.searchOptions.queryname]: query }
      })
        .then(res => {
          this.upDatepagination(res.result)
          this.list = res.result.records
        })
    },

    // 搜索 输入/改变 回调函数
    callback (that, val) {
      return val
    },

    // 获取搜索数据
    toQuery (query) {
      let str = query[this.searchOptions.queryname]
    }
  }
}
