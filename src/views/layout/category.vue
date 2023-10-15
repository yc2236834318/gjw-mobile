<!-- 分类页 二级组件 -->

<template>
  <div class="category">
    <!-- 分类 -->
    <van-nav-bar title="全部分类" fixed />

    <!-- 搜索框 -->
    <van-search readonly shape="round" background="#f1f1f2" placeholder="请输入搜索关键词" @click="$router.push('/search')" />

    <!-- 分类列表 -->
    <div class="list-box">
      <!-- 左侧类型列表 -->
      <div class="left">
        <ul>
          <li v-for="(item, index) in list" :key="item.category_id">
            <a :class="{ active: index === activeIndex }" @click="activeIndex = index" href="javascript:;">{{ item.name }}</a>
          </li>
        </ul>
      </div>
      <!-- 右侧商品列表 -->
      <div class="right">
        <div v-for="item in list[activeIndex]?.children" :key="item.category_id"
        @click="$router.push(`/searchlist?categoryId=${item.category_id}`)"
        class="cate-goods">
          <img :src="item.image?.external_url" alt="">
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCategoryDataApi } from '@/api/category'
export default {
  name: 'CategoryPage',
  created () {
    this.getCategoryList()
  },
  data () {
    return {
      list: [],
      activeIndex: 0
    }
  },
  methods: {
    // 获取分类页数据
    async getCategoryList () {
      const res = await getCategoryDataApi()
      // console.log(res)
      this.list = res.data.list
    }
  }
}
</script>

<style lang="less" scoped>
.category {
  height: 100vh;
  padding-top: 100px;
  padding-bottom: 50px;

  // 导航条样式定制
  .van-nav-bar {
    z-index: 999;
  }

  // 搜索框样式定制
  .van-search {
    position: fixed;
    top: 46px;
    z-index: 999;
    width: 100%;
  }

  .list-box {
    display: flex;
    height: 100%;

    .left {
      overflow: auto;
      width: 85px;
      height: 100%;
      background-color: #f3f3f3;

      a {
        display: block;
        height: 45px;
        color: #444444;
        font-size: 12px;
        line-height: 45px;
        text-align: center;

        &.active {
          color: #fb442f;
          background-color: #fff;
        }
      }
    }

    .right {
      overflow: auto;
      display: flex;
      flex: 1;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-content: flex-start;
      height: 100%;
      padding: 10px 0;
      background-color: #ffffff;

      .cate-goods {
        width: 33.3%;
        margin-bottom: 10px;

        img {
          display: block;
          width: 70px;
          height: 70px;
          margin: 5px auto;
        }

        p {
          font-size: 12px;
          text-align: center;
        }
      }
    }
  }
}
</style>
