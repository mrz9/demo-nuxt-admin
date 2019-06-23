<template>
  <el-scrollbar class="call-main-nav">
    <!-- <NavItem v-for="(item,idx) in navs" :key="idx" :item="item" /> -->
    <el-menu :default-active="active_nav" @select="select" class="main-nav-wrap" :collapse="is_mini_menu"
      unique-opened>
      <template v-for="(item,idx) in navs.child">
        <el-menu-item :index="''+idx" :key="idx" v-if="typeof item.child === 'undefined'" :disabled="item.disabled" @click="jump(item)">
          <i :class="item.icon"></i>
          <span slot="title">{{$t(item.label)}}</span>
        </el-menu-item>

        <el-submenu v-else :index="''+idx" :key="idx">
          <template slot="title">
            <i :class="item.icon"></i>
            <span slot="title">{{$t(item.label)}}</span>
          </template>
          <el-menu-item-group v-for="(sub,sidx) in item.child" :key="sidx">
            <el-menu-item :index="idx + '-' + sidx" v-if="typeof sub.child === 'undefined'"  @click="jump(sub)">{{$t(sub.label)}}</el-menu-item>
            <el-submenu :index="idx + '-' + sidx" v-else>
              <span slot="title">{{$t(sub.label)}}</span>
              <el-menu-item :index="idx + '-' + sidx + '-' + child" v-for="(children,cidx) in sub.child" :key="cidx" @click="jump(children)">{{$t(children.label)}}</el-menu-item>
            </el-submenu>
          </el-menu-item-group>
        </el-submenu>
      </template>
    </el-menu>
  </el-scrollbar>
</template>
<script>
  import NavItem from './modules/main_nav_item';

  export default {
    components: {
      NavItem,
    },
    data() {
      return {
        isCollapse: false,
      }
    },
    computed: {
      is_mini_menu() {
        return this.$store.state['core'].is_mini_menu
      },
      active_top(){ // 顶部导航高亮 Number
        return this.$store.state['core'].menu.active_top
      },
      active_nav(){ // 左侧导航缩影 String `${parent_index}-${child_index}`
        return this.$store.state['core'].menu.active_nav
      },
      navs(){
        return this.$store.state['core'].menu.menus[this.active_top] || []
      },
      menus_map(){
        return this.$store.getters['core/menu/menus_map']
      }
    },
    async mounted() {
      /**
       * 页面跳转事件
       */
      this.$bridge.$on('core-main-tab-create',tab=>{
        this.jump(tab);
      });
    },
    methods: {
      jump(tab){ // 标签页面路由跳转
        this.$store.commit('core/menu/set_tabs',tab);
        this.$router.push(tab.path);
      },
      select(active_string){ // 菜单选中
        this.$store.commit('core/menu/set_active_nav',active_string);
      }
    }
  }

</script>
<style lang="less" scoped>
  .call-main-nav {
		padding: 20px 0 20px 20px;
		/deep/ .el-submenu {
			.el-menu-item {
				display: flex;
				align-items: center;
				line-height: 1.5;
				white-space:normal;
			}
		}
  }

  .main-nav-wrap {
    border-right: none;

    &:not(.el-menu--collapse) {
      width: 220px;
      // min-height: 400px;
    }
  }
</style>
