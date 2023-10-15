<!-- 搜索页 一级组件 -->

<template>
  <div class="search">
    <van-nav-bar title="商品搜索" left-arrow @click-left="$router.go(-1)" />
    <van-search v-model="search" show-action placeholder="请输入搜索关键词" clearable>
      <template #action>
        <div @click="goSearch(search)">搜索</div>
      </template>
    </van-search>

    <!-- 搜索历史 -->
    <div class="search-history" v-if="history.length > 0">
      <div class="title">
        <span>最近搜索</span>
        <van-icon @click="clear" name="delete-o" size="16" />
      </div>
      <div class="list">
        <div class="list-item" v-for="item in history" :key="item" @click="goSearch(item)">
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getHistoryList, setHistoryList } from '@/utils/storage' // 导入本地存储模块
export default {
  name: 'SearchIndex',
  data () {
    return {
      search: '',
      history: getHistoryList() // 获取本地的历史记录
    }
  },
  methods: {
    // 搜索函数
    goSearch (key) {
      key = key.trim()
      // 仅当关键字不为空时添加到历史记录
      if (key !== '') {
        const index = this.history.indexOf(key) // 判断搜索历史是否已存在
        if (index !== -1) this.history.splice(index, 1) // 若已存在就移除该搜索历史
        this.history.unshift(key) // 将本次搜索历史追加到数组最前面
        if (this.history.length > 6) this.history.pop() // 若>6条就删除最后一条
        setHistoryList(this.history) // 将搜索历史保存到本地存储
      }
      this.search = '' // 清空搜索框
      this.$router.push(`/searchlist?search=${key}`) // 跳转到搜索列表
    },
    // 清除搜索历史函数
    clear () {
      this.history = []
      setHistoryList([]) // 清空本地搜索历史
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  .searchBtn {
    color: #fff;
    background-color: #fa2209;
  }

  ::v-deep .van-search__action {
    margin-right: 10px;
    padding: 0 20px;
    color: #fff;
    border-radius: 0 5px 5px 0;
    background-color: #c21401;
  }

  ::v-deep .van-icon-arrow-left {
    color: #333;
  }

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    padding: 0 15px;
    font-size: 14px;
    line-height: 40px;
  }

  .list {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 5%;
    padding: 0 10px;
  }

  .list-item {
    overflow: hidden;
    width: 30%;
    margin-bottom: 10px;
    padding: 7px;
    font-size: 13px;
    line-height: 15px;
    border-radius: 50px;
    text-align: center;
    border: 1px solid #efefef;
    background: #fff;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
