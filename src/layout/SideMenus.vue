<template>
  <div class="SideMenus">
    <!-- 遍历路由表，生成左侧菜单 -->
    <template v-for="(item, index) in menus">
      <template v-if="!item.hidden">
      <!-- 一级菜单的情况 -->
      <template v-if="item.children&&item.children.length===1">
        <el-submenu :key="index" :index="item.path">
          <template slot="title">
            <svgIcon v-if="item.meta.icon" :className="'sideIcon'" :iconClass='item.meta.icon'></svgIcon>
            <span class="title">{{item.meta.title}}</span>
          </template>
            <router-link :to="item.path+'/'+item.children[0].path">
              <!--index跟浏览器地址对应，这样菜单才能显示选中状态  -->
              <el-menu-item :index="item.path+'/'+item.children[0].path">
                <template slot="title">
                  <!-- 设置icon -->
                  <svgIcon v-if="item.children[0].meta.icon" :className="'sideIcon'" :iconClass='item.children[0].meta.icon'></svgIcon>
                  <!-- 菜单名称 -->
                  <span class="title">{{item.children[0].meta.title}}</span>
                </template>
              </el-menu-item>
            </router-link>
        </el-submenu>
      </template>
      <!-- 一级菜单的情况 end-->
      <!-- 多级菜单 -->
      <template v-else-if="item.meta.title!='地图展示'">
        <el-submenu  :key="index" :index="item.path">
          <template slot="title">
            <svgIcon v-if="item.meta.icon" :className="'sideIcon'" :iconClass='item.meta.icon'></svgIcon>
            <span class="title">{{item.meta.title}}</span>
          </template>
          <!-- 遍历子菜单 -->
          <template  v-for="(itemChild, index) in item.children">
            <!-- 当发现存在3级或大于3级菜单时,重新遍历当前组件 -->
            <template v-if="!itemChild.hidden">
            <template v-if="itemChild.children&&itemChild.children.length>0">
              <side-menus :key="index" :routes="[itemChild]" class="nest-menu"></side-menus>
            </template>
            <!-- 2级菜单时-->
            <template v-else>
              <router-link  :key="index" :to="item.path+'/'+itemChild.path">
                <el-menu-item :index="item.path+'/'+itemChild.path">
                  <svgIcon v-if="itemChild.meta.icon" :className="'sideIcon'" :iconClass='itemChild.meta.icon'></svgIcon>
                  <span class="title">{{itemChild.meta.title}}</span>
                </el-menu-item>
              </router-link>
            </template>
            </template>
          </template>
          <!-- 遍历子菜单 end-->
        </el-submenu>
      </template>
      <!-- 多级菜单 end-->
      </template>
    </template>
  </div>
</template>
<script>
// import '@/styles/index.css'
import svgIcon from '@/components/SvgIcon/index'
export default {
  components: {
    svgIcon
  },
  name: 'side-menus',
  props: {
    routes: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      menus: ''
    }
  },
  mounted () {
    this.menus = this.routes
  }
}

</script>
<style lang="scss" scoped>
.title{
  padding-left: 5px;
}
</style>
<style lang="scss">
.el-submenu__title{
  text-align: left!important;
}
.aside{
  padding: 0!important;
}
.el-submenu .el-menu-item {
    height: 50px;
    line-height: 50px;
    padding: 0 45px;
    min-width: 200px;
    text-align: left;
}
.sideIcon{
  width: 16px;
  height: 16px;
}
</style>
/* eslint-disable no-new */
