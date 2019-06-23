<template>
  <div class="ui-message-center" @click.self="closeMessageCenter">
      <ul  class="msg-center msg-select" role="menu">
        <li class="msg-header">
          <span class="msg-header-title">消息中心</span>
          <a @click="jump({path:'/message',name:'message', label: '消息中心'})" class="msg-header-more list-group-item" href="javascript:;">查看更多</a>
          <a class="msg-header-close" @click="closeMessageCenter"><i></i></a>
        </li>
        <li class="list-group">
          <div class="slimScrollDiv" id="notifyWrap">
            <el-scrollbar>
              <p class="nomsg" v-if="messages.length == 0">暂无未读消息</p>
              <template v-else>
                <div class="msg-item" v-for="(msg,idx) in messages" :key="idx">
                <div class="media-top">
                    <h4>{{msg.title}}</h4>
                    <span>{{msg.time}}</span>
                </div>
                <a class="media-con list-group-item" @click="jump(msg)">{{msg.text}}</a>
                <p class="media-tip" @click="readed(idx)">标记已读</p>
              </div>
              </template>
            </el-scrollbar>
          </div>
        </li>
      </ul>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        messages:[{
          title: '系统消息',
          time: '2017-11-08 16:33:59',
          text: '欢迎您访问Admui演示系统',
          name:'message',
          url: '/message',
        }]
      }
    },
    methods: {
      closeMessageCenter(){
        this.$store.commit('core/SET_MESSAGE_CENTER', false)
      },
      readed(idx){// 已读
        this.messages.splice(idx,1);
      },
      jump(arg){//页面跳转
        let name;
        let param = {...arg};
        switch(toString.call(arg)){
          case "[object String]":
            param.path = arg;
            break;
          case "[object Object]":
            if(param.url) param.path = param.url;
            break;
        }
        if(param.path){
          this.$bridge.$emit('core-main-tab-create', param);
          this.closeMessageCenter();
        }
      }
    }
  }

</script>

<style lang="less" scoped>
.ui-message-center {
  position:fixed;
  top:0;
  bottom:0;
  left:0;
  right:0;
  z-index:9999;
}
.msg-center {
  position: fixed;
  right: 0;
  top: 50px;
  z-index: 10000;
  width: 360px;
  bottom:0;
  background: #fff;
  padding: 0;
  box-shadow: -3px 5px 8px rgba(0, 0, 0, .2);
  font-family: Roboto,San Francisco,"Helvetica Neue",Helvetica,Arial,PingFangSC-Light,"Hiragina Sans GB","WenQuanYi Micro Hei",'microsoft yahei ui','microsoft yahei',sans-serif
}

.msg-header {
  line-height: 49px;
  border-bottom: 1px solid #ddd;
  display: table;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  background-color: #fff;
}
.msg-header>.msg-header-title,
.msg-header>.msg-header-more,
.msg-header>.msg-header-close {
  display: table-cell;
}
.msg-header .msg-header-title {
  padding-left: 20px;
  font-size: 16px;
  color: #000;
  width: 240px;
  font-weight: bold;
}

.msg-header-more {
  padding:0;
  margin: 0;
  border:none;
  background-color: transparent!important;
  width: 70px;
  text-align: right;
  color: #006eff!important;
  font-size: 12px;
  text-decoration: none;
}
.msg-header-close {
  color: #888;
  text-align: right;
  padding-right: 15px;
  width: 50px;
  cursor: pointer;
  line-height: 0;
  vertical-align: middle;
}
.msg-header-close>i {
  position: relative;
  display: inline-block;
  width:16px;
  height:16px;
  overflow: hidden;
  vertical-align: middle;
  transform: rotate(45deg);
}
.msg-header-close>i::before,
.msg-header-close>i::after {
  content:'';
  position: absolute;

  background-color:#888;
}
.msg-header-close>i::before {
  top:7px;
  left:0;
  width:16px;
  height:2px;
}
.msg-header-close>i::after {
  top:0;
  left:7px;
  width:2px;
  height:16px;
}
.msg-center .list-group {
  margin-top: 50px;
  overflow: hidden;
  overflow-y: auto;
  box-sizing: border-box;
  overflow-y: scroll;
  padding-bottom: 80px;
  height: 100%;
}

.msg-center .msg-item {
  border-radius: 0;
  border: none;
  border-bottom: 1px solid #ddd;
  padding: 15px 20 15px;
  margin: 0;
}
.msg-center .msg-item .media-con {
  padding:0;
  margin: 0;
  border:none;
  background-color: transparent!important;
}

.media-top {
  overflow: hidden;
}


.media-top h4 {
  line-height: 20px;
  color: #888;
  font-size: 12px;
  float: left;
  width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
  white-space: nowrap;
  margin: 0;
  height: 20px;
}

.media-top span {
  line-height: 20px;
  color: #888;
  font-size: 12px;
  float: right;
}

.msg-center .msg-item:hover .media-top span {
  display: none;
}

.msg-center .msg-item:hover {
  background: #f4f4f4 !important;
  padding: 15px 20px 7px;
  margin:0;
  border-bottom:1px solid #fff;

}

.msg-center .msg-item:hover .media-tip {
  display: block !important;
}


.msg-center .msg-item {
  cursor: pointer;
  padding: 15px 0 7px;
  margin:0 20px;
  position: relative;
}

.msg-item .media-tip,
.msg-item a {
  color: #000;
  padding: 4px 0 0;
  line-height: 21px;
  font-size: 12px;
}


.msg-item .media-tip {
  /* background-color: #f2f2f2; */
  position: absolute;
  right: 20px;
  top: 12px;
  line-height: 21px;
  width: 115px;
  text-align: right;
  display: none;
  max-height: 21px;
  overflow: hidden;
  color: #006eff;

}
.msg-center .nomsg {
  color: #444;
  font-size: 12px;
  text-align: center;
  margin-top: 30px;
  margin-right: 20px;
}

</style>
