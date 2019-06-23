/**
 * 数字类型输入限制指令
 */

import Vue from 'vue';
 
Vue.directive('number', {
  bind(el, binding,vnode) {
    if(!binding.value){
      binding.value = {
        decimal:0,
        max: -1
      }
    }
    let handler = function(e) {
      //小数点数量
      let decimal = binding.value.decimal
      //限制最大值，默认不限制
      let max = binding.value.max

      let value = e.target.value;
      //safari改变值的情况光标会移到最后
      if (e.keyCode == 37 || e.keyCode == 39) return;
      
      let match;
      let match2;
      //是否可以输入小数点
      if(decimal<=0){
        match = /^([0-9]+[\.]?)?[0-9]*$/
        match2 = /[^\d]/g;
      }else{
        match = /^[0-9]+$/;
        match2 = /[^\d|\.]/g;

      }

      if (!match.test(value)) {
        value = value.replace(match2, '');
        //最大值判断
        if (max >= 0 && !isNaN(max) && Number(value) > Number(max)) {
          value = max;
        }
        // 是否需要保留小数点
        if(decimal>0){
          var arr = String(value).split('.');
          for (let i = 0, len = arr.length; i < len; i++) {
            if (i > 1) break;
            if (i === 0) {
              value = '';
            }
            if (i === 0 && arr[i] === '' && arr.length > 1) {
              arr[i] = '0';
            }
            value += i == 0 ? arr[i] : arr[i].substr(0, decimal) + '';
            if (i === 0 && arr.length > 1) value += '.'
          }
        }
      } else {
        value = value.replace(match2, '');
        //最大值判断
        if (max >= 0 && !isNaN(max) && Number(value) > Number(max)) {
          value = max;
        }
        if(decimal>0){
          var arr = String(value).split('.');
          if (arr.length >= 2 && arr[1].length > decimal) {
            if (arr.length > 1 && arr[1].length >= 2) {
              arr[1] = arr[1].substr(0, decimal)
              value = arr.join('.');
            }
          }
        }
      }
      e.target.value = value;

      vnode.data.model.callback(e.target.value);
    }
    el.addEventListener('input', handler);
  }
})
