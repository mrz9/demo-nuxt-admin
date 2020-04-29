<template>
  <el-row type="flex" class="header" :class="{'min-navbar':is_mini_menu}" align="middle">
    <a class="header-logo" href="#">
      <span>个人博客</span>
      <img src="~/assets/img/logo-white-min.svg" alt="">
    </a>
    <a href="javascript:;" @click="toggleMenu" class="header-item">
      <i class="iconfont icon-menu-toggle"></i>
    </a>
    <div class="navbar-container">
      <a href="javascript:;" 
        class="nav-item"
        :class="{'active':active_top == '' ? nav.default : active_top === nidx}" 
        v-for="(nav,nidx) in menus"
        @click="changeHeaderMenu(nidx)" 
        :key="nidx">
        <span>{{$t(nav.label)}}</span>
      </a>
  
      <div class="nav-item nav-language">
        <el-dropdown @command="changeLang">
          <a class="el-dropdown-link" href="javascript:;">
            {{$t('lang')}}<i class="el-icon-arrow-down el-icon--right"></i>
          </a>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :disabled="lang.disabled" :command="lang.key" v-for="(lang,lidx) in langs" :key="lidx">{{lang.label}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

    </div>
    <div class="right-action-bar">
      <a href="javascript:;" class="user-box nav-item">
        <img src="~/assets/img/user.png">
        <span>MRZ</span>
      </a>
      <a href="javascript:;" class="header-item" @click="toggleMessageCenter">
        <i class="iconfont icon-message"></i>
      </a>
      <a href="javascript:;" class="header-item" @click="toggleFullScreen">
        <i class="iconfont icon-fullscreen"></i>
      </a>
      <a href="javascript:;" class="header-item">
        <i class="iconfont icon-logout"></i>
      </a>
    </div>
  </el-row>
</template>
<script>
  import { mapMutations } from 'vuex'
  // 全屏展示
  function requestFullScreen(element) {
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
    if (requestMethod) {
      requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") {
      var wscript = new ActiveXObject("WScript.Shell");
      if (wscript !== null) {
        wscript.SendKeys("{F11}");
      }
    }
  }

  // 退出全屏
  function exitFull() {
    // 判断各种浏览器，找到正确的方法
    var exitMethod = document.exitFullscreen || //W3C
      document.mozCancelFullScreen || //Chrome等
      document.webkitExitFullscreen || //FireFox
      document.webkitExitFullscreen; //IE11
    if (exitMethod) {
      exitMethod.call(document);
    } else if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer
      var wscript = new ActiveXObject("WScript.Shell");
      if (wscript !== null) {
        wscript.SendKeys("{F11}");
      }
    }
  }

  // 判断是否全屏
  function getFullScreenElement(){
    return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement
  }

  export default {
    data(){
      return {
        langs: [{
          key:'zh-CN',
          disabled:false,
          label: '简体中文'
        },{
          key:'en',
          disabled:false,
          label: 'English'
        },{
          key:'kn',
          disabled:true,
          label: '高棉语'
        }]
      }
    },
    computed: {
      is_mini_menu() {
        return this.$store.state['core'].is_mini_menu
      },
      show_message_center() {
        return this.$store.state['core'].show_message_center
      },
      menus(){
        return this.$store.state['core'].menu.menus
      },
      active_top(){
        return this.$store.state['core'].menu.active_top
      }
    },
    methods: {
      ...mapMutations({
        setLang: 'core/i18n/set_lang'
      }),
      toggleMenu() {
        this.$store.commit('core/SET_MINI_MENU', !this.is_mini_menu)
      },
      toggleMessageCenter() {
        this.$store.commit('core/SET_MESSAGE_CENTER', !this.show_message_center)
      },
      toggleFullScreen(){
        let elem = document.querySelector(".call-main-layout");
        if(!getFullScreenElement()){
            requestFullScreen(elem);
        }else{
            exitFull();
        }
      },
      changeHeaderMenu(idx){
        this.$store.commit('core/menu/set_active_top',idx);
      },
      changeLang(command){
        console.log(this.$i18n);
        this.setLang(command);
        this.$i18n.locale = command;
      }
    }
  }

</script>
<style lang="less" scoped>
  .header {
    display: flex;
    align-items: center;

    a {
      text-decoration: none;
    }

    // position: fixed;
    // top:0;
    // right:0;
    // left:0;
    background-color:#2086f9;
    height:50px;
    overflow: hidden;

    .header-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 10px;
      width: 240px;
      font-size: 20px;
      color: #fff;

      img {
        display: none;
      }
    }

    &.min-navbar {
      .header-logo {
        width: 84px;

        span {
          display: none;
        }

        img {
          display: block;
          height: 32px;
        }
      }
    }

    .user-box {
      display: flex;
      align-items: center;
      padding: 0 30px;

      img {
        margin-right: 12px;
        display: block;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background-color: #fff;
        border: 1px solid #fff;
        overflow: hidden;
      }

      span {
        color: #fff;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .navbar-container {
      flex: 1;
      display: flex;

      .nav-item {
        position: relative;
        padding: 0 20px;
        display: flex;
        align-items: center;
        color: #fff;
        font-size: 14px;

        &.active {
          opacity: .7;
        }

        &+.nav-item {
          &::before {
            content: '';
            position: absolute;
            left: 0;
            width: 2px;
            background-color: rgba(0, 0, 0, .1);
            height: 16px;
            top: 50%;
            transform: translateY(-50%);
          }
        }

        &.nav-language {
          a {
            color: #fff;
          }
        }
      }
    }

    .right-action-bar {
      display: flex;
      align-items: center;
      height: 100%;
    }

    .header-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 100%;
      color: #fff;
      font-size: 20px;

      &:hover {
        background-color: rgba(255, 255, 255, .1)
      }
    }
  }

</style>
