/**
 * 添加全局事件通信vue
 */
import Vue from 'vue';

export default ({ app,store }, inject) => {
  inject('bridge',new Vue());
}
