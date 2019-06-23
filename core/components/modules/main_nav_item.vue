<template>
  <div class="main-nav-item">
    <template v-if="item.type == 'link'">
      <div class="item item-link">
        <i :class="item.icon" v-if="item.icon"></i>
        <span>{{item.label}}</span>
      </div>
    </template>
    <template v-else-if="item.type == 'group'">
      <div class="item-group">
        <div class="item item-title">
          <i :class="item.icon" v-if="item.icon"></i>
          <span>{{item.label}}</span>
          <i class="fa fa-angle-right"></i>
        </div>
        <div class="item-group-list" v-if="item.sub">
            <nav-item v-for="(sub,sidx) in item.sub" :key="sidx" :item="sub"/>
        </div>
      </div>
    </template>
    <template v-else-if="item.type == 'sub-group'">

    </template>
  </div>
</template>

<script>
import NavSubItem from './main_nav_sub_item'
export default {
  name:'navItem',
  props:{
    item:{
      type:Object,
      default:()=>{}
    },
    // type:{
    //   type:String, // link group
    //   default:'link',
    // },
    // icon:{
    //   type:String,
    //   default:'',
    // },
  },
  components:{
    NavSubItem,
  }
}
</script>

<style lang="less" scoped>
.main-nav-item {
  background-color:#fff;
  width: 220px;
  .item {
    display: flex;
    align-items: center;
    padding:14px 20px 14px 25px;
    color:#a7b1c2;
    i + span {
      margin-left:10px;
    }
    span {
      flex:1;
    }
    span + i {
      margin-right:10px;
    }
  }

  .item-group-list {
    .item {
      padding:7px 15px 7px 38px;
    }
  }
}
</style>
