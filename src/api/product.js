// 商品页接口请求文件

import request from '@/utils/request' // 导入请求配置文件

// 获取搜索的商品列表数据
export const getProListApi = (obj) => {
  const { categoryId, goodsName, page, sortType, sortPrice } = obj
  return request.get('/goods/list', {
    params: {
      categoryId,
      goodsName,
      page,
      sortType,
      sortPrice
    }
  })
}

// 获取商品详情
export const getProDetailApi = (goodsId) => {
  return request.get('/goods/detail', {
    params: {
      goodsId
    }
  })
}

// 获取商品评价
export const getProCommentsApi = (goodsId, limit) => {
  return request.get('/comment/listRows', {
    params: {
      goodsId,
      limit: limit
    }
  })
}
