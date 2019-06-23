import Vue from 'vue';
/**
 * 点击关闭控件
 * 
 * v-click-outside="clickHandle"
 * [clickoutside-target="vue_ref"]
 */
let $el;
let callback;
let startClick;
let target;//触发弹窗的vue ref，非必填

function clickOutSide(mouseup = {} ,mousedown = {}){
  if($el 
      && !isHidden($el) 
      && !$el.contains(mousedown.target)
      && !$el.contains(mouseup.target)
      && (!target || !target.contains(mousedown.target) && !target.contains(mouseup.target))
      && typeof callback == 'function'){
      callback();
    }
}

function mousedownHandle(e){
  startClick = e
}

function mouseupHandle(e){
  clickOutSide(e,startClick);
}

function isHidden(el) {
  var style = window.getComputedStyle(el);
  return (style.display === 'none')
}

Vue.directive('click-outside', {
  bind(el, binding,vnode) {
    el.style.d
    $el = el;
    let outsideTarget = el.getAttribute('clickoutside-target')
    if(outsideTarget && vnode.context.$refs[outsideTarget]){
      target = vnode.context.$refs[outsideTarget]
    }
    callback = binding.value;
    document.addEventListener('mouseup',mouseupHandle);
    document.addEventListener('mousedown',mousedownHandle);
  },
  unbind(){
    $el = null;
    callback = null;
    startClick = {};
    target = null;
    document.removeEventListener('mouseup',mouseupHandle);
    document.removeEventListener('mousedown',mousedownHandle);
  }
})
