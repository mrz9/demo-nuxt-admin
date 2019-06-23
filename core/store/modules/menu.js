
import $config from '~/config';
export default {
  namespaced: true,
  state:()=> ({
    menus: $config.client.PAGE_ROUTE || [], // 页面配置的路由
    active_top: 0,  // 顶部导航高亮 Number
    active_nav: '0', // 左侧选中的菜单 String `${parent_index}-${child_index}`
    active_tab: '', // 当前激活的tab
    tabs: [] // 打开的tabs
  }),
  getters: {
    menus_map:state=>{ // 遍历页面路由，以name为索引，并为每个路由生成对应的keymap
      let map = {}
      /**
       * 
       * @param {*} list 路由数组
       * @param {*} pid 父节点索引集合
       */
      function loopChild(list,pid){
        list.forEach((item,index)=>{
          if(item.child){
            loopChild(item.child,[...pid,index]);
          }else{
            // 记录路由对应的索引顺序规则`${top}-${parent_index}-${child_index}`;
            item.keymap = [...pid,index].join('-');
            map[item.name] = item;
          }
        })
      }

      loopChild(state.menus,[]);
      return map;
    }
  },
  mutations: {
    set_active_top(state, index){
      state.active_top = index;
    },
    set_active_nav(state,nav){
      state.active_nav= nav
    },
    set_active_tab(state,name){
      state.active_tab = name;
    },
    update_tabs(state,tabs){
      state.tabs = tabs;
    },
    set_tabs(state,tab){
      let item = state.tabs.find(item=>item.name === tab.name);
      if(item){
        tab.path = item.path;
      }else{
        state.tabs.push({
          name:tab.name,
          path:tab.path,
          label:tab.label || '新标签'
        });
      }
      state.active_tab = tab.name
    }
  },
}
