<!-- 购物车页 二级组件 -->

<template>
  <div class="cart">
    <van-nav-bar title="购物车" left-arrow @click-left="$router.go(-1)" fixed />
    <div v-if="isLogin && cartList.length > 0">
      <!-- 购物车头部 -->
      <div class="cart-title">
        <span class="all">共<i>{{ cartTotal }}</i>件商品</span>
        <span class="edit" @click="isEdit = !isEdit">
          <van-icon name="edit" />{{ isEdit ? '取消编辑' : '编辑' }}
        </span>
      </div>

      <!-- 购物车列表 -->
      <div class="cart-list">
        <div class="cart-item" v-for="item in cartList" :key="item.goods_id">
          <van-checkbox :value="item.isChecked" @click="toggleCheck(item.goods_id)"></van-checkbox>
          <div class="show">
            <img :src="item.goods.goods_image" alt="">
          </div>
          <div class="info">
            <span class="tit text-ellipsis-2">{{ item.goods.goods_name }}</span>
            <span class="bottom">
              <div class="price">&yen;<span>{{ item.goods.goods_price_min }}</span></div>
              <CountBox :value="item.goods_num" @input="(value) => changeCount(value, item)">
              </CountBox>
            </span>
          </div>
        </div>
      </div>

      <!-- 购物车工具栏 -->
      <div class="footer-fixed">
        <div class="all-check" @click="toggleAllCheck">
          <van-checkbox :value="isAllChecked" icon-size="18"></van-checkbox>
          全选
        </div>
        <div class="all-total">
          <div v-if="!isEdit" class="price">
            <span>合计：</span>
            <span>&yen; <i class="totalPrice">{{ selPrice }}</i></span>
          </div>
          <div v-if="!isEdit" @click="goPay" class="goPay" :class="{ disabled: selCount === 0 }">结算({{ selCount }})</div>
          <div v-else @click="goodsDel" class="delete" :class="{ disabled: selCount === 0 }">
            删除
          </div>
        </div>
      </div>
    </div>
    <div class="empty-cart" v-else>
      <img src="@/assets/empty.png" alt="">
      <div class="tips">
        您的购物车是空的, 快去逛逛吧
      </div>
      <div class="btn" @click="$router.push('/')">去逛逛</div>
    </div>
  </div>
</template>

<script>
import CountBox from '@/components/CountBox.vue' // 导入数字框-子组件
import { mapGetters, mapState } from 'vuex' // 导入辅助函数
export default {
  name: 'CartPage',
  data () {
    return {
      isEdit: false // 是否是编辑状态
    }
  },
  components: {
    CountBox
  },
  created () {
    // 请求购物车商品列表
    if (this.isLogin) {
      // 判断用户是否登录
      this.$store.dispatch('cart/getCartAction')
    }
  },
  methods: {
    // 商品选中
    toggleCheck (id) {
      this.$store.commit('cart/toggleCheck', id) // 子传父
    },
    // 全选框选中
    toggleAllCheck () {
      this.$store.commit('cart/toggleAllCheck', !this.isAllChecked) // 子传父
    },
    // 修改商品数量
    changeCount (goodsNum, item) {
      this.$store.dispatch('cart/changeCountAction', {
        goodsNum: goodsNum,
        goodsId: item.goods_id,
        goodsSkuId: item.goods_sku_id
      })
    },
    // 商品删除
    goodsDel () {
      if (this.selCount === 0) return
      this.$store.dispatch('cart/delSelectAction')
    },
    // 商品结算
    goPay () {
      if (this.selCount < 1) return // 判断是否有选中的商品
      // 跳转到订单页
      this.$router.push({
        path: '/pay',
        query: {
          mode: 'cart', // 订单模式:购物车
          cartIds: this.selCartList.map(item => item.id).join(',') // 购物车选中的商品
        }
      })
    }
  },
  computed: {
    ...mapState('cart', ['cartList']),
    ...mapGetters('cart', ['cartTotal', 'selCount', 'selCount', 'selPrice', 'isAllChecked', 'selCartList']),
    isLogin () {
      return this.$store.getters.token
    }
  },
  watch: {
    // 监听商品编辑状态
    isEdit (value) {
      if (value) {
        // 删除状态下默认取消全部商品
        this.$store.commit('cart/toggleAllCheck', false)
      } else {
        // 结算状态下默认选中全部商品
        this.$store.commit('cart/toggleAllCheck', true)
      }
    }
  }
}
</script>

<style lang="less" scoped>
// 购物车
.cart {
  min-height: 100vh;
  padding-top: 46px;
  padding-bottom: 100px;
  background-color: #f5f5f5;

  .cart-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    padding: 0 10px;
    font-size: 14px;

    .all {
      i {
        margin: 0 2px;
        color: #fa2209;
        font-size: 16px;
        font-style: normal;
      }
    }

    .edit {
      .van-icon {
        padding-right: 5px;
        font-size: 18px;
      }
    }
  }

  .cart-item {
    display: flex;
    justify-content: space-between;
    margin: 0 10px 10px 10px;
    padding: 10px;
    border-radius: 5px;
    background-color: #ffffff;

    .show img {
      width: 100px;
      height: 100px;
    }

    .info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 210px;
      padding: 10px 5px;
      font-size: 14px;

      .bottom {
        display: flex;
        justify-content: space-between;
        line-height: 30px;

        .price {
          display: flex;
          align-items: flex-end;
          color: #fa2209;
          font-size: 12px;

          span {
            margin-left: 5px;
            font-size: 16px;
          }
        }

        .count-box {
          display: flex;
          width: 110px;

          .add,
          .minus {
            width: 30px;
            height: 30px;
            outline: none;
            border: none;
          }

          .inp {
            width: 40px;
            height: 30px;
            margin: 0 5px;
            outline: none;
            border: none;
            text-align: center;
            background-color: #efefef;
          }
        }
      }
    }
  }
}

// 工具栏
.footer-fixed {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 50px;
  height: 50px;
  width: 100%;
  padding: 0 10px;
  background-color: #fff;
  border-bottom: 1px solid #ccc;

  .all-check {
    display: flex;
    align-items: center;

    .van-checkbox {
      margin-right: 5px;
    }
  }

  .all-total {
    display: flex;
    line-height: 36px;

    .price {
      margin-right: 10px;
      font-size: 14px;

      span:last-of-type {
        color: #fa2209;

        .totalPrice {
          font-size: 18px;
          font-style: normal;
        }
      }
    }

    .goPay,
    .delete {
      min-width: 100px;
      height: 36px;
      color: #fff;
      line-height: 36px;
      text-align: center;
      border-radius: 18px;
      background-color: #fa2f21;

      &.disabled {
        background-color: #ff9779;
      }
    }
  }

}

// 空购物车
.empty-cart {
  padding: 80px 30px;

  img {
    display: block;
    width: 140px;
    height: 92px;
    margin: 0 auto;
  }

  .tips {
    margin: 30px;
    color: #666;
    text-align: center;
  }

  .btn {
    display: block;
    width: 110px;
    height: 32px;
    margin: 0 auto;
    color: #fff;
    line-height: 32px;
    text-align: center;
    border-radius: 16px;
    background-color: #fa2c20;
  }
}
</style>
