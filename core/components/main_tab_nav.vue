<template>
  <div class="main-tab-wrap">
    <div class="tabs" ref="tabs">
      <el-tabs ref="eltabs" :value="activeName" @tab-click="handleClick" show-nav @tab-remove="removeTab">
        <el-tab-pane v-for="tab in tabs" :key="tab.name" :closable="!tab.fixed" data-class="fixed" :label="$t(tab.label)" :name="tab.name"></el-tab-pane>
      </el-tabs>
    </div>
    <a href="javascript:;" class="refresh tab-item" @click="refresh">
      <i class="el-icon-refresh"></i>
    </a>
    <el-dropdown class="tab-item" trigger="click" @command="handleCommand">
      <span class="el-dropdown-link">
        关闭操作<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="active">定位当前选项卡</el-dropdown-item>
        <el-dropdown-item command="all" divided>关闭全部选项卡</el-dropdown-item>
        <el-dropdown-item command="other">关闭其他选项卡</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  export default {
    data() {
      return {
      };
    },
    computed: {
      menus(){
        return this.$store.state['core'].menu.menus;
      },
      menus_map(){
        return this.$store.getters['core/menu/menus_map'];
      },
      tabs: {
        get(){
          return this.$store.state['core'].menu.tabs
        },
        set(value){
          this.$store.commit('core/menu/update_tabs',value);
        }
      },
      activeName(){
        return this.$store.state['core'].menu.active_tab
      },
    },
    watch:{
      $route(to, from){// 路由跳转后，激活选中tab
        this.matchedTag();
      }
    },
    mounted(){
      // 初次进入页面时，需要匹配一下当前路由对应的标签
      this.matchedTag();
    },
    methods:{
      matchedTag(){ // 路由跳转后，激活选中tab
        let item = this.menus_map[this.$route.name];
        if(item){
          this.$store.commit('core/menu/set_tabs',{
            name: item.name,
            label:item.label,
            path: this.$route.fullPath
          })
          this.$store.commit('core/menu/set_active_tab',item.name);
          this.highlightNav(item);
          
        }else{ // 不存在的，或者子路的情况
          //迭代匹配父节点的路由
          const loopParentName = (name)=>{
            let prefix_name = name.split('-');
            prefix_name.pop();
            if(prefix_name.length <1){
              return false;
            }else{
              prefix_name = prefix_name.join('-');
            }
            let key = Object.keys(this.menus_map).find(name=>name === prefix_name);
            if(key){
              return this.menus_map[key];
            }else{
              return loopParentName(prefix_name);
            }
          }

          let tab = loopParentName(this.$route.name);
          
          if(tab){
            this.$store.commit('core/menu/set_tabs',{
              name: tab.name,
              label:tab.label,
              path: this.$route.fullPath
            });
            this.highlightNav(tab);
          }else{
            this.$store.commit('core/menu/set_tabs',{
              name: this.$route.name,
              path: this.$route.fullPath
            });
          }

        }
      },
      highlightNav(tab){// 高亮选中的导航
        let arr = tab.keymap.split('-');
        this.$store.commit('core/menu/set_active_top',Number(arr.shift()));
        this.$store.commit('core/menu/set_active_nav',arr.join('-'));

      },
      removeTab(targetName) { // 关闭标签处理
        let tabs = this.tabs;
        let activeName = this.activeName;
        let activeTab;
        if (activeName === targetName) { // 如果当前关闭的时当前标签时，需要激活下一个或前一个标签
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
                activeTab = nextTab;
              }
            }
          });
        }
        this.$store.commit('core/menu/set_active_tab',activeName);

        this.tabs = tabs.filter(tab => tab.name !== targetName);
        if(activeTab){
          this.$bridge.$emit('core-main-tab-create',activeTab);
        }
      },
      slideActive(){//切换到激活的
          //调用element-ui tab-nav组件的方法
         this.$refs.eltabs.$refs.nav && this.$refs.eltabs.$refs.nav.scrollToActiveTab();
      },
      closeOther(){
        let tabs = this.tabs;
        let activeName = this.activeName;
        let activeTab = [] ;
        tabs.forEach((tab, index) => {
          if (tab.fixed || tab.name === activeName) {
            activeTab.push(tab);
          }
        });
        this.tabs = activeTab;
        //修改element-ui tab-nav组件的data
        this.$refs.eltabs.$refs.nav.navOffset = 0;

      },
      closeAll(){// 关闭全部，并打开默认页面
        let tabs = this.tabs;
        let activeTab = [] ;
        tabs.forEach((tab, index) => {
          if (tab.fixed) {
            activeTab.push(tab);
            if(index == 0){
              this.$ui.jump(tab);
            }
          }
        });
        this.tabs = activeTab;
        //修改element-ui tab-nav组件的data
        this.$refs.eltabs.$refs.nav.navOffset = 0;
      },
      handleCommand(command){ //关闭操作处理
        switch(command){
          case 'active':
            this.slideActive();
            break;
          case 'other':
            this.closeOther();
            break;
          case 'all':
            this.closeAll();
            break;
        }
      },
      handleClick(panel){ // 标签选中处理
        let tab = this.tabs[panel.index];
        this.$bridge.$emit('core-main-tab-create',tab);
      },
      refresh(){
        location.reload();
      }
    }
  }
</script>

<style lang="less" scoped>
@border:  solid 1px #E7E9EF;
.main-tab-wrap {
  display: flex;
  align-items: center;
  height: 100%;
  overflow: hidden;
  background-color:#f0f2f8;
  .tabs {
    flex:1;
    overflow: hidden;
    /deep/ * { // 清楚el-tabs组建的默认样式
      .el-tabs__active-bar {
        display: none;
      }
      .el-tabs__header {
        margin:0;
      }
      .el-tabs__nav-wrap::after {
        display: none;
      }
      .el-tabs__nav-wrap {
        margin-bottom:0;
        &.is-scrollable {
          padding:0 40px;
        }
      }

      .el-tabs__item {
        padding:0 20px!important;

        &.is-active {
          background-color:#e7e9ef;
        }
        .el-icon-close {
          background-color:#c4c6cc;
          color:#fff;
        }
      }

      .el-tabs__nav-prev,
      .el-tabs__nav-next {
        width:40px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .el-tabs__nav-prev {
        border-right:@border;
      }
      .el-tabs__nav-next {
        border-left:@border;
      }
    }
  }
  .tabs,.tab-item {
    border-left:@border;
  }
  .tab-item {
    display: flex;
    padding:0 8px;
    height: 100%;
    min-width:40px;
    color: #999;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    cursor: pointer;
  }
}
</style>
