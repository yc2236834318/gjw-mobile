// 购物车仓库模块

import { Toast } from 'vant'
import { getCartListApi, changeCountApi, delSelectApi } from '@/api/cart'

export default {
  namespaced: true,
  state () {
    return {
      cartList: [] // 购物车商品列表
    }
  },
  mutations: {
    // 存储购物车商品列表
    setCartList (state, goodsList) {
      state.cartList = goodsList
    },
    // 更新商品选中状态
    toggleCheck (state, id) {
      const goods = state.cartList.find(item => item.goods_id === id)
      goods.isChecked = !goods.isChecked
    },
    // 更新商品全选状态
    toggleAllCheck (state, flag) {
      state.cartList.forEach(item => (item.isChecked = flag))
    },
    // 修改购物车商品数量(vuex)
    changeCount (state, obj) {
      const goods = state.cartList.find(item => item.goods_id === obj.goodsId)
      goods.goods_num = obj.goodsNum
    },
    // 删除商品(vuex)
    delSelect (state, cartIds) {
      state.cartList = state.cartList.filter(item => !cartIds.includes(item.id))
    }
  },
  actions: {
    // 获取购物车商品列表
    async getCartAction (context) {
      const { data } = await getCartListApi()
      data.list.forEach(item => {
        // 在商品列表中挂载选中状态属性
        item.isChecked = true
      })
      context.commit('setCartList', data.list)
    },
    // 修改购物车商品数量(后台)
    async changeCountAction (context, obj) {
      const { goodsId, goodsNum, goodsSkuId } = obj
      await changeCountApi(goodsId, goodsNum, goodsSkuId)
      context.commit('changeCount', { goodsId, goodsNum })
    },
    // 删除商品(后台)
    async delSelectAction (context) {
      const selCartList = context.getters.selCartList // 获取选中的商品
      const cartIds = selCartList.map(item => item.id) // 获取选中商品的ID
      await delSelectApi(cartIds)
      Toast('删除成功')
      context.commit('delSelect', cartIds)
    }
  },
  getters: {
    // 购物车商品总数量
    cartTotal (state) {
      return state.cartList.reduce((sum, item) => sum + item.goods_num, 0)
    },
    // 购物车商品选中列表
    selCartList (state) {
      return state.cartList.filter(item => item.isChecked === true)
    },
    // 购物车商品选中总数量
    selCount (state, getters) {
      return getters.selCartList.reduce((sum, item) => sum + item.goods_num, 0)
    },
    // 购物车商品选中总价格
    selPrice (state, getters) {
      return getters.selCartList.reduce((sum, item) => sum + item.goods_num * item.goods.goods_price_min, 0).toFixed(2)
    },
    // 购物车商品全选框状态
    isAllChecked (state) {
      return state.cartList.every(item => item.isChecked === true)
    }
  }
}
