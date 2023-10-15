// 首页接口请求文件

import request from '@/utils/request' // 导入请求配置文件

// 获取首页数据
export const getHomeDataApi = () => {
  return request.get('/page/detail', {
    params: {
      pageId: 0 // 第一页
    }
  })
}
