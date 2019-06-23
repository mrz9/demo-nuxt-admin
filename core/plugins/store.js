import uiStore from '~/core/store'

export default ({ app,store }, inject) => {
  /**
   * 注册脚手架vuex，
   * !项目的store目录必须存在且至少有一个状态文件，如果没有状态文件此处注册回出错
   */
  store.registerModule('core', uiStore);

}
