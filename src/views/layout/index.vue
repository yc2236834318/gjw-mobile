<!-- 首页架子 一级组件 -->

<template>
  <div class="layout">
    <router-view></router-view>
    <van-tabbar route active-color="#ee0a24" inactive-color="#000">
      <van-tabbar-item to="/home" icon="wap-home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/category" icon="apps-o">分类</van-tabbar-item>
      <van-tabbar-item to="/cart" icon="shopping-cart-o" class="icon-cart">
        <span v-if="cartTotal > 0" class="num">{{ cartTotal }}</span>
        <span>购物车</span>
      </van-tabbar-item>
      <van-tabbar-item to="/user" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex' // 导入辅助函数
export default {
  name: 'LayoutIndex',
  created () {
    // 请求购物车商品列表
    if (!this.$store.getters.token) return // 判断用户是否登录
    this.$store.dispatch('cart/getCartAction')
  },
  computed: {
    ...mapGetters('cart', ['cartTotal']) // 映射购物车商品数量
  }
}
</script>

<style lang="less" scoped>
.icon-cart {
  position: relative;
  padding: 0 6px;

  .num {
    // 购物车角标
    position: absolute;
    top: 5%;
    right: 25%;
    z-index: 999;
    width: 20px;
    height: 15px;
    color: #fff;
    line-height: 15px;
    text-align: center;
    background-color: #ee0a24;
    border-radius: 50%;
  }
}
</style>
