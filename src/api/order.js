// 订单页接口请求文件

import request from '@/utils/request' // 导入请求配置文件

// 获取订单数据
export const checkOrderApi = (mode, obj) => {
  return request.get('/checkout/order', {
    params: {
      mode, // 订单模式:cart 购物车; buyNow 立即购买
      delivery: 10, // 10 快递配送; 20 门店自提
      couponId: 0, // 优惠券ID
      isUsePoints: 0, // 是否使用积分
      ...obj
      // cart => obj{ cartIds }; buyNow => obj{ goodsId, goodsNum, goodsSkuId }
    }
  })
}

// 提交订单
export const submitOrderApi = (mode, obj) => {
  return request.post('/checkout/submit', {
    mode, // 订单模式: cart 购物车; buyNow 立即购买
    delivery: 10, // 10 快递配送; 20 门店自提
    couponId: 0, // 优惠券ID
    isUsePoints: 0, // 是否使用积分
    payType: 10, // 支付方式: 10 余额支付
    ...obj
    // cart => obj{ cartIds, remark }; buyNow => obj{ goodsId, goodsNum, goodsSkuId }
  })
}

// 获取订单列表
export const getMyOrderListApi = (dataType, page) => {
  return request.get('/order/list', {
    params: {
      dataType, // 订单展示类型
      page // 订单页数
    }
  })
}
