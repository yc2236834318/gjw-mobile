// 购物车页接口请求文件

import request from '@/utils/request' // 导入请求配置文件

// 加入购物车
export const addCartApi = (goodsId, goodsNum, goodsSkuId) => {
  return request.post('cart/add', {
    goodsId,
    goodsNum,
    goodsSkuId
  })
}

// 获取购物车商品列表
export const getCartListApi = () => {
  return request.get('cart/list')
}

// 修改购物车商品数量
export const changeCountApi = (goodsId, goodsNum, goodsSkuId) => {
  return request.patch('cart/update', {
    goodsId,
    goodsNum,
    goodsSkuId
  })
}

// 删除购物车商品
export const delSelectApi = (cartIds) => {
  return request.post('cart/clear', {
    cartIds
  })
}
