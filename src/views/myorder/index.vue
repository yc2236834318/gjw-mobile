<!-- 订单管理页 一级组件 -->

<template>
  <div class="order">
    <van-nav-bar title="我的订单" left-arrow @click-left="$router.go(-1)" />
    <van-tabs v-model="active" sticky>
      <van-tab name="all" title="全部"></van-tab>
      <van-tab name="payment" title="待支付"></van-tab>
      <van-tab name="delivery" title="待发货"></van-tab>
      <van-tab name="received" title="待收货"></van-tab>
      <van-tab name="comment" title="待评价"></van-tab>
    </van-tabs>
    <OrderListItem v-for="item in list" :key="item.order_id" :item="item"></OrderListItem>
  </div>
</template>

<script>
import OrderListItem from '@/components/OrderListItem.vue' // 导入订单列表项-子组件
import { getMyOrderListApi } from '@/api/order' // 导入订单页请求接口
export default {
  name: 'OrderPage',
  components: {
    OrderListItem
  },
  data () {
    return {
      active: this.$route.query.dataType || 'all', // 订单展示类型(地址栏查询参数)
      page: 1, // 展示的页数(第一页)
      list: [] // 订单列表
    }
  },
  methods: {
    // 请求订单列表
    async getOrderList () {
      const res = await getMyOrderListApi(this.active, this.page)
      const list = res.data.list
      // console.log(list)
      list.data.forEach((item) => {
        item.total_num = 0 // 挂载商品总数属性
        item.goods.forEach(goods => {
          item.total_num += goods.total_num // 计算商品总数
        })
      })
      this.list = list.data
    }
  },
  watch: {
    // 监听active的变化
    active: {
      immediate: true, // 页面加载后立即执行一次handler
      handler () {
        this.getOrderList()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.order {
  background-color: #fafafa;
}

.van-tabs {
  position: sticky;
  top: 0;
}
</style>
