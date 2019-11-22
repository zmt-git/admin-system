export default {
  data () {
    return {
      total: 0,
      currentPage: 0,
      pageSizes: [15, 20, 30, 50]
    }
  },
  methods: {
    // 分页改变当前条数
    handleSizeChange (e) {
      console.log(e)
    },

    // 分页改变当前页
    handleCurrentChange (e) {
      console.log(e)
    },

    // 分页数据更新
    upDatepagination (data) {
      this.total = data.total
      this.currentPage = data.current
      this.pageSizes = data.size
    },

    // 获取表格数据
    getTabelData (fn) {
      fn({
        pageNum: 1,
        numPerPage: 15
      })
        .then(res => {
          this.upDatepagination(res.result)
          this.list = res.result.records
        })
    }
  }
}
