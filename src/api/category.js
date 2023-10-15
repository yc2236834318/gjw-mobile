// 分类页接口请求文件

import request from '@/utils/request' // 导入请求配置文件

// 获取商品分类数据
export const getCategoryDataApi = () => {
  return request.get('/category/list')
}
