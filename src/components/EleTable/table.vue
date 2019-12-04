<template>
  <div class="tableBox">
    <el-table
      ref="multipleTable"
      v-loading.iTable="options.loading"
      :size="options.small ? options.small: 'small'"
      :data="list"
      :stripe="options.stripe"
      header-row-class-name='headStyle'
      :header-row-style="{height: options.height, padding: options.padding}"
      :row-style="{height: options.height}"
      :cell-style='{padding: options.padding}'
      :border='options.border'
      @selection-change="handleSelectionChange"
    >
      <!--选择框-->
      <el-table-column v-if="options.mutiSelect" type="selection" style="width: 55px;"></el-table-column>
      <!--数据列-->
      <template v-for="(column) in columns">
        <el-table-column
          :prop="column.prop"
          :key="column.label"
          :label="column.label"
          :align="column.align"
          :width="column.width"
        >
          <template slot-scope="scope">
            <template v-if="!column.render">
              <template v-if="column.formatter">
                <span v-html="column.formatter(scope.row, column)"></span>
              </template>
              <template v-else>
                <span>{{scope.row[column.prop]}}</span>
              </template>
            </template>
            <template v-else-if="column.nopopover">
              <div slot="reference" class="name-wrapper">
                <template v-if="column.typeLists">
                  <span v-if="column.method">
                    <el-tag
                      size="small"
                      :type="column.typeLists[scope.row[column.prop]].type ? column.typeLists[scope.row[column.prop]].type : 'primary'"
                      @click="column.method(column.prop, scope.row)"
                      >
                      {{column.typeLists[scope.row[column.prop]].title}}
                    </el-tag>
                  </span>
                  <span v-else>
                    <el-tag
                      size="small"
                      style="cursor: text"
                      :type="column.typeLists[scope.row[column.prop]].type ? column.typeLists[scope.row[column.prop]].type : 'primary'"
                      >
                      {{column.typeLists[scope.row[column.prop]].title}}
                    </el-tag>
                  </span>
                </template>
                <el-tag v-else size="small" :type="column.type ? column.type : 'primary'">{{column.title}}</el-tag>
              </div>
              <!-- <expand-dom :column="column" :row="scope.row" :render="column.render" :index="index"></expand-dom> -->
            </template>
            <template v-else>
              <el-popover trigger="hover" @show='column.method(column.prop, scope.row, column.empty)' placement="left">
                <p class="loading" v-if="column.loading"><i class="el-icon-loading"></i></p>
                <p v-else-if='column.empty' style='color:red'>——————</p>
                <p class="groupsItem" v-else :key="index" v-for="(item, index) in column.showList">{{ (index+1) + '.' +item.name}}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium" :type="column.type ? column.type : 'primary'">查看分组</el-tag>
                </div>
              </el-popover>
              <!-- <expand-dom :column="column" :row="scope.row" :render="column.render" :index="index"></expand-dom> -->
            </template>
          </template>
        </el-table-column>
      </template>
      <!--endregion-->
      <!--region 按钮操作组-->
      <el-table-column
        ref="fixedColumn"
        label="操作"
        align="left"
        :width="operates.width"
        :fixed="operates.fixed"
        v-if="operates.list.filter(_x=>_x.show === true).length > 0"
      >
        <template slot-scope="scope">
          <el-button-group>
            <template v-for="(btn, key, index) in operates.list">
              <el-button
                v-hasBtn='btn.title'
                v-if="btn.show"
                :key="index"
                :type="btn.type"
                :icon="btn.icon ? btn.icon : null"
                :disabled="btn.disabled"
                :plain="btn.plain"
                :title="btn.title ? btn.title : null"
                style="padding: 7px 10px"
                class="tableBtn"
                size="mini"
                @click.native.prevent="btn.method(key,scope.row)"
              ><i v-if="!!btn.iconfont" class="iconfont tabelIcon" :class="btn.iconfont"></i>{{ btn.label }}</el-button>
            </template>
          </el-button-group>
        </template>
      </el-table-column>
      <!--endregion-->
    </el-table>
    <template v-if="options.hasPagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :layout="layout"
        :total="total">
      </el-pagination>
    </template>
  </div>
</template>
<!--endregion-->
<script>
export default {
  props: {
    list: {
      type: Array,
      required: true,
      default: () => {
        return [{ id: '', name: '' }]
      }
    }, // 数据列表
    columns: {
      required: true,
      type: Array,
      default: () => []
    }, // 需要展示的列 === prop：列数据对应的属性，label：列名，align：对齐方式，width：列宽
    operates: {
      type: Object,
      default: () => {
        return { list: [] }
      }
    }, // 操作按钮组 === label: 文本，type :类型（primary / success / warning / danger / info / text），show：是否显示，icon：按钮图标，plain：是否朴素按钮，disabled：是否禁用，method：回调方法
    options: {
      type: Object,
      default: () => {
        return {
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
    Radio: {
      type: Boolean,
      default: false
    },
    layout: {
      type: String,
      default: () => {
        return 'total, sizes, prev, pager, next, jumper'
      }
    },
    total: {
      type: Number,
      default: 0
    },
    currentPage: {
      type: Number,
      default: 0
    },
    'pageSizes': {
      type: Array,
      default: () => {
        return [15, 20, 30, 50]
      }
    },
    pageSize: {
      type: Number,
      default: 15
    }
  },
  // 数据
  data () {
    return {
      multipleSelection: [] // 多行选中
    }
  },
  methods: {
    // 多行选中
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.$emit('handleSelectionChange', val)
    },

    // 当前条数
    handleSizeChange (e) {
      this.$emit('handleSizeChange', e)
    },

    // 当前页
    handleCurrentChange (e) {
      this.$emit('handleCurrentChange', e)
    }
  }
}
</script>
<style lang="scss" scoped>
.tableBox{
  margin-top: 5px;
}
.operate-group{
  display: inline-block;
}
.item{
    display: inline-block;
    padding-right: 3px;
    text-align: center;
  }
.tabelIcon{
  font-size: 12px;
}
.name-wrapper{
  cursor: pointer;
}
.loading{
  line-height: 15px;
  text-align: center;
  font-size: 18px;
  color: rgb(59, 204, 248);
}
.groupsItem{
  line-height: 18px;
  text-align: left;
  padding-left: 10px;
  box-sizing: border-box;
  font-size: 14px;
  color: #409EFF;;
}
</style>
<style>
.headStyle th{
  background: #f4f4f4;
}
</style>
