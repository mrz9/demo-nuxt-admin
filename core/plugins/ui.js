/**
 * 框架工具方法
 * 调用方式
 * this.$ui.xxx;
 */

 // 循环前套
function loopList(list, name){
    if (!name) return false;
    let rs;
    for (let i = 0, len = list.length; i < len; i++) {
      let item = list[i];
      if (item.type == 'link') {
        if (item.name == name) {
          return item
        }
      } else if (item.type == 'group') {
        rs = loopList(item.sub, name);
      }
    }
    return rs;
}

export default ({ app,route }, inject) => {
  const {$bridge,store} = app;
  let ui = {
    jump(tab){
      $bridge.$emit('core-main-tab-create',tab);
    },
	}

  inject('ui',ui);

}
