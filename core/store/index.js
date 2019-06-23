import module_menu from './modules/menu.js';

export default {
  namespaced: true,
  modules: {
    menu: module_menu,
  },
  state: {
    is_mini_menu:false, //是否折叠菜单,
    show_message_center: false, //是否显示通知中中心
  },

  mutations: {
    SET_MINI_MENU: (state, status) => (state.is_mini_menu = status),
    SET_MESSAGE_CENTER: (state,status) => (state.show_message_center = status),
  },
};
