<!-- 产品详情页 一级组件 -->

<template>
  <div class="prodetail">
    <van-nav-bar fixed title="商品详情页" left-arrow @click-left="$router.go(-1)" />

    <!-- 轮播图 -->
    <van-swipe :autoplay="3000" @change="onChange">
      <van-swipe-item v-for="(item, index) in images" :key="index">
        <img :src="item.external_url" />
      </van-swipe-item>
      <!-- 轮播图页数显示 -->
      <template #indicator>
        <div class="custom-indicator">{{ current + 1 }} / {{ images.length }}</div>
      </template>
    </van-swipe>

    <!-- 商品说明 -->
    <div class="info">
      <div class="title">
        <div class="price">
          <span class="now">&yen; {{ detail.goods_price_min }}</span>
          <span class="oldprice">&yen; {{ detail.goods_price_max }}</span>
        </div>
        <div class="sellcount">已售{{ detail.goods_sales }}件</div>
      </div>
      <div class="msg text-ellipsis-2">{{ detail.goods_name }}</div>
      <div class="service">
        <div class="left-words">
          <span><van-icon name="passed" />七天无理由退货</span>
          <span><van-icon name="passed" />48小时发货</span>
        </div>
        <div class="right-icon">
          <van-icon name="arrow" />
        </div>
      </div>
    </div>

    <!-- 商品评价 -->
    <div class="comment">
      <div class="comment-title">
        <div class="left">商品评价 ({{ commentTotal }}条)</div>
        <div class="right">查看更多 <van-icon name="arrow" /> </div>
      </div>
      <div class="comment-list">
        <div class="comment-item" v-for="item in commentList" :key="item.comment_id">
          <div class="top">
            <img :src="item.user.avatar_url || defaultImg" alt="">
            <div class="name">{{ item.user.nick_name }}</div>
            <!-- 用户评分 -->
            <van-rate :size="16" :value="item.score / 3" color="#ffd21e" void-icon="star" void-color="#eee" />
          </div>
          <div class="content">{{ item.content }}</div>
          <div class="time">{{ item.create_time }}</div>
        </div>
      </div>
    </div>

    <!-- 商品描述 -->
    <div class="desc" v-html="detail.content"></div>

    <!-- 底部 -->
    <div class="footer">
      <div class="icon-home" @click="$router.push('/')">
        <van-icon name="wap-home-o" />
        <span>首页</span>
      </div>
      <div class="icon-cart" @click="$router.push('/cart')">
        <span v-if="cartTotal > 0" class="num">{{ cartTotal }}</span>
        <van-icon name="shopping-cart-o" />
        <span>购物车</span>
      </div>
      <div class="btn-add" @click="addFn">加入购物车</div>
      <div class="btn-buy" @click="buyFn">立刻购买</div>
    </div>

    <!-- 弹层 -->
    <van-action-sheet v-model="showPannel" :title="mode ? '加入购物车' : '立即购买'">
      <div class="product">
        <div class="product-title">
          <div class="left">
            <img :src="detail.goods_image" alt="">
          </div>
          <div class="right">
            <div class="price">
              <span>&yen;</span>
              <span class="nowprice">{{ detail.goods_price_min }}</span>
            </div>
            <div class="count">
              <span>库存</span>
              <span>{{ detail.stock_total }}</span>
            </div>
          </div>
        </div>
        <div class="num-box">
          <span>数量</span>
          <!-- 数字框-子组件 -->
          <CountBox v-model="addCount"></CountBox>
        </div>
        <div class="showbtn" v-if="detail.stock_total > 0">
          <div class="btn" v-if="mode" @click="addCart">加入购物车</div>
          <div class="btn now" v-else @click="goPay">立刻购买</div>
        </div>
        <div class="btn-none" v-else>该商品已抢完</div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import { getProDetailApi, getProCommentsApi } from '@/api/product' // 导入商品页请求接口
import { addCartApi } from '@/api/cart' // 导入购物车页请求接口
import defaultImg from '@/assets/default-avatar.png' // 导入默认用户头像
import CountBox from '@/components/CountBox.vue' // 导入子组件-数字框
import { mapGetters } from 'vuex' // 导入辅助函数
import loginConfirm from '@/mixins/loginConfirm' // 导入组件混合文件
export default {
  name: 'ProDetail',
  mixins: [loginConfirm], // 注册组件混合文件
  data () {
    return {
      images: [], // 轮播图图片
      current: 0, // 轮播图当前图片ID
      detail: {}, // 商品详情
      commentList: [], // 商品评论
      commentTotal: 0, // 商品评论数量
      defaultImg: defaultImg, // 评论用户默认头像
      showPannel: false, // 是否显示加入购物车弹层
      mode: true, // 弹层模式(true:加入购物车 false:立即购买)
      addCount: 1 // 数字框默认值
    }
  },
  components: {
    CountBox
  },
  created () {
    this.getDetail() // 获取商品详情
    this.getComments() // 获取商品评论
    this.getCart() // 获取购物车商品数量
  },
  methods: {
    // 轮播图配置
    onChange (index) {
      this.current = index
    },
    // 获取商品详情
    async getDetail () {
      const res = await getProDetailApi(this.goodsId)
      // console.log(res)
      this.detail = res.data.detail // 获取商品详情
      this.images = res.data.detail.goods_images // 获取轮播图图片
    },
    // 获取商品评论
    async getComments () {
      const res = await getProCommentsApi(this.goodsId, 3)
      // console.log(res)
      this.commentList = res.data.list // 获取商品评论
      this.commentTotal = res.data.total // 获取商品评论数量
    },
    // 获取购物车商品数量
    getCart () {
      if (!this.$store.getters.token) return // 判断用户是否登录
      this.$store.dispatch('cart/getCartAction')
    },
    // 加入购物车弹层
    addFn () {
      this.showPannel = true
      this.mode = true
    },
    // 立即购买弹层
    buyFn () {
      this.showPannel = true
      this.mode = false
    },
    // 加入购物车
    async addCart () {
      // 判断用户是否登录(组件混合)
      if (this.loginConfirm()) return
      // 若已登录则发起加入购物车请求
      await addCartApi(this.goodsId, this.addCount, this.detail.skuList[0].goods_sku_id)
      // console.log(res)
      await this.getCart() // 更新购物车商品数量
      this.$toast('加入购物车成功')
      this.showPannel = false // 关闭弹层
    },
    // 立即购买
    goPay () {
      // 判断用户是否登录
      if (this.loginConfirm()) return
      // 若已登录则跳转到订单页
      this.$router.push({
        path: '/pay/',
        query: {
          mode: 'buyNow', // 订单模式
          goodsId: this.goodsId, // 商品ID
          goodsSkuId: this.detail.skuList[0].goods_sku_id, // 商品型号ID
          goodsNum: this.addCount // 商品数量
        }
      })
    }
  },
  computed: {
    goodsId () {
      return this.$route.params.id // 获取商品ID(动态路由传参)
    },
    ...mapGetters('cart', ['cartTotal']) // 映射购物车商品数量
  }
}
</script>

<style lang="less" scoped>
.prodetail {
  padding-top: 46px;

  ::v-deep .van-icon-arrow-left {
    color: #333;
  }

  img {
    display: block;
    width: 100%;
  }

  .custom-indicator {
    position: absolute;
    right: 10px;
    bottom: 10px;
    padding: 5px 10px;
    font-size: 12px;
    border-radius: 15px;
    background: rgba(0, 0, 0, 0.1);
  }

  .desc {
    overflow: scroll;
    width: 100%;

    ::v-deep img {
      display: block;
      width: 100% !important;
    }
  }

  .info {
    padding: 10px;
  }

  .title {
    display: flex;
    justify-content: space-between;

    .now {
      color: #fa2209;
      font-size: 20px;
    }

    .oldprice {
      margin-left: 5px;
      color: #959595;
      font-size: 16px;
      text-decoration: line-through;
    }

    .sellcount {
      position: relative;
      top: 4px;
      color: #959595;
      font-size: 16px;
    }
  }

  .msg {
    margin-top: 5px;
    font-size: 16px;
    line-height: 24px;
  }

  .service {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    font-size: 16px;
    line-height: 40px;
    background-color: #fafafa;

    .left-words {
      span {
        margin-right: 10px;
      }

      .van-icon {
        margin-right: 4px;
        color: #fa2209;
      }
    }
  }

  .comment {
    padding: 10px;
  }

  .comment-title {
    display: flex;
    justify-content: space-between;

    .right {
      color: #959595;
    }
  }

  .comment-item {
    font-size: 16px;
    line-height: 30px;

    .top {
      display: flex;
      align-items: center;
      height: 30px;
      margin-top: 20px;

      img {
        width: 20px;
        height: 20px;
      }

      .name {
        margin: 0 10px;
      }
    }

    .time {
      color: #999;
    }
  }

  .footer {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 55px;
    background-color: #fff;
    border-top: 1px solid #ccc;

    .icon-home,
    .icon-cart {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 14px;

      .van-icon {
        font-size: 24px;
      }
    }

    .icon-cart {
      position: relative;
      padding: 0 6px;

      .num {
        // 购物车角标
        z-index: 999;
        position: absolute;
        top: -2px;
        right: 0;
        min-width: 16px;
        padding: 0 4px;
        color: #fff;
        text-align: center;
        background-color: #ee0a24;
        border-radius: 50%;
      }
    }

    .btn-add,
    .btn-buy {
      width: 120px;
      height: 36px;
      color: #fff;
      line-height: 36px;
      font-size: 14px;
      text-align: center;
      border-radius: 18px;
      background-color: #ffa900;
    }

    .btn-buy {
      background-color: #fe5630;
    }
  }

  .tips {
    padding: 10px;
  }

  // 购买弹层
  .product {
    .product-title {
      display: flex;

      .left {
        img {
          width: 90px;
          height: 90px;
        }

        margin: 10px;
      }

      .right {
        flex: 1;
        padding: 10px;

        .price {
          font-size: 14px;
          color: #fe560a;

          .nowprice {
            font-size: 24px;
            margin: 0 5px;
          }
        }
      }
    }

    .num-box {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      align-items: center;
    }

    .btn,
    .btn-none {
      height: 40px;
      line-height: 40px;
      margin: 20px;
      border-radius: 20px;
      text-align: center;
      color: rgb(255, 255, 255);
      background-color: rgb(255, 148, 2);
    }

    .btn.now {
      background-color: #fe5630;
    }

    .btn-none {
      background-color: #cccccc;
    }
  }
}
</style>
