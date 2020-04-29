<template>
  <div class="call-main-layout default" :class="{'min-navbar':is_mini_menu}">
    <div class="call-main-header">
      <MainHeader />
    </div>
    <div class="call-main-tab-nav">
      <MainTabNav />
    </div>
    <div class="call-main-body">
      <div class="call-main-nav">
        <MainNav />
        <div class="gov">
          <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=19073023" target="_blank" ga_event="click_about"><img src="//s3.pstatp.com/toutiao/static/img/gongan.d0289dc.png">&nbsp;粤ICP备19073023号</a>
          <a href="http://www.beian.miit.gov.cn" target="_blank" ga_event="click_about"><img src="//s3.pstatp.com/toutiao/static/img/gongan.d0289dc.png">&nbsp;粤ICP备19073023号-1</a>
          <span>© 2020 lafengo.com</span>
        </div>
      </div>
      <div class="call-main-content">
        <nuxt/>
      </div>
    </div>
    
    <transition name="fold">
      <MessageCenter v-if="show_message_center"/>
    </transition>
  </div>
</template>
<script>
import MainHeader from '~/core/components/main_header.vue'
import MainNav from '~/core/components/main_nav.vue'
import MainTabNav from '~/core/components/main_tab_nav.vue'
import MessageCenter from '~/core/components/message_center.vue'
export default {
  components:{
    MainHeader,
    MainNav,
    MainTabNav,
    MessageCenter
  },
  computed:{
    is_mini_menu(){
      return this.$store.state['core'].is_mini_menu
    },
    show_message_center(){
      return this.$store.state['core'].show_message_center
    }
  },
  mounted(){
    window.onresize = ()=>{
      if(window.innerWidth <= 768){
        !this.is_mini_menu && this.$store.commit('core/SET_MINI_MENU',true);
      }else{
        this.is_mini_menu && this.$store.commit('core/SET_MINI_MENU',false);
      }
    }
    window.onresize();
  }
}
</script>
<style lang="less" src="~/core/assets/less/ui.less"></style>
<style lang="less" scoped>
.call-main-layout {
  position:absolute;
  top:0;
  left:0;
  display: flex;
  flex-direction: column;
  width:100%;
  height: 100%;
  overflow: hidden;
  background-color:#f4f6f9;

  &.min-navbar .call-main-tab-nav {
    padding-left:84px;
  }
  .call-main-header {
    height:50px;
  }
  .call-main-tab-nav {
    padding-left:240px;
    height:40px;
    background-color:#f0f2f8;
    border-bottom:1px solid #e7e9ef;
  }
  .call-main-body {
    display: flex;
    flex:1;
    width:100%;
    overflow: hidden;
    .call-main-nav {
      height:100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .call-main-content {
      display: block;
      flex:1;
      padding:20px 20px 0 20px;
      height: 100%;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
    }
  }
}

.gov {
  padding: 10px;
  display: flex;
  flex-direction: column;
  &>a {
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    color:#999;
  }
  span {
    text-indent: 2em;
    color: #999
  }
}
.fold-enter-active {
  animation-name: fold-in;
  animation-duration: .3s;
}
.fold-leave-active {
  animation-name: fold-out;
  animation-duration: .3s;
}

@keyframes fold-in {
  0% {
    transform: translate3d(100%, 0, 0);
  }
  50% {
    transform: translate3d(50%, 0, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}
@keyframes fold-out {
  0% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(50%, 0, 0);
  }
  100% {
    transform: translate3d(100%, 0, 0);
  }
}
</style>

