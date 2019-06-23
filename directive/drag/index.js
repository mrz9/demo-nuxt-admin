import Vue from 'vue';
/**
 * 拖拽控件
 * 
 * v-drag
 * v-drag="'selector'"
 */
Vue.directive('drag', {
  bind(el, binding) {
    let dom = binding.value ? el.querySelector(binding.value) : el;
    if(dom){
      dom.onmousedown = function(ev){
        let disX =ev.clientX - el.offsetLeft;
        let disY =ev.clientY - el.offsetTop;

        document.onmousemove = function(ev){
          if(dom.getAttribute('drag-disabled')) return false;
          let l = ev.clientX - disX;
          let t = ev.clientY - disY;
          el.style.left = l + 'px';
          el.style.top = t + 'px';
          el.dataset.left = l +'px'
          el.dataset.top = t +'px'
        };

        document.onmouseup=function(){
          document.onmousemove = null;
          document.onmouseup = null;
        };
      };
    }
  }
})
