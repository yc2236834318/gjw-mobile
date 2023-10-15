<!-- 搜索列表页 一级组件 -->

<template>
  <div class="search">
    <van-nav-bar fixed title="商品列表" left-arrow @click-left="$router.go(-1)" />
    <van-search readonly shape="round" background="#ffffff" :value="querySearch || ''" show-action @click="$router.push('/search')" placeholder="请输入搜索关键字">
      <template #action>
        <van-icon class="tool" @click="$router.push('/category')" name="apps-o" />
      </template>
    </van-search>

    <!-- 排序选项按钮 -->
    <div class="sort-btns">
      <div :class="{ active: sortIndex === 1 }" @click="getProList('all', 0)">默认</div>
      <div :class="{ active: sortIndex === 2 }" @click="getProList('sales', 0)">销量</div>
      <div :class="{ active: sortIndex === 3 }" @click="getProList('price', 1)">价格</div>
    </div>

    <!-- 商品列表 -->
    <div class="goods-list">
      <GoodsItem v-for="item in proList" :key="item.goods_id" :item="item"></GoodsItem>
      <div class="empty" v-if="proList.length <= 0">暂无商品</div>
    </div>
  </div>
</template>

<script>
import GoodsItem from '@/components/GoodsItem.vue' // 导入子组件
import { getProListApi } from '@/api/product' // 导入接口请求文件
export default {
  name: 'SearchList',
  data () {
    return {
      page: 1, // 搜索页码
      proList: [], // 搜索商品列表
      sortIndex: 1, // 排序选中
      queryObj: {} // 请求参数
    }
  },
  components: {
    GoodsItem
  },
  created () {
    // 设置请求参数
    this.queryObj = {
      categoryId: this.$route.query.categoryId, // 获取地址栏的商品分类参数
      goodsName: this.querySearch,
      page: this.page,
      sortType: 'all',
      sortPrice: 0
    }
    this.getProList('all', 0) // 进入页面默认请求一次商品列表
  },
  methods: {
    // 请求商品列表函数
    async getProList (sortType, sortPrice) {
      this.queryObj.sortType = sortType
      this.queryObj.sortPrice = sortPrice
      const res = await getProListApi(this.queryObj)
      this.proList = res.data.list.data
      this.sortIndex = sortType === 'all' ? 1 : sortType === 'sales' ? 2 : 3
    }
  },
  computed: {
    // 获取地址栏查询参数
    querySearch () {
      return this.$route.query.search
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  padding-top: 46px;

  ::v-deep .van-icon-arrow-left {
    color: #333;
  }

  .tool {
    height: 40px;
    font-size: 24px;
    line-height: 40px;
  }

  .sort-btns {
    display: flex;
    height: 36px;
    line-height: 36px;

    >div {
      flex: 1;
      font-size: 16px;
      text-align: center;
    }

    .active {
      color: #f03c3c;
    }
  }

  // 商品样式
  .goods-list {
    background-color: #f6f6f6;
  }

  .empty {
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 20px;
    font-weight: bold;
    transform: translate(-50%, -50%);
    background-color: #fff;
  }
}
</style>
