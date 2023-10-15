// 用户页接口请求文件

import request from '@/utils/request' // 导入请求配置文件

// 获取个人信息
export const getUserInfoDetail = () => {
  return request.get('/user/info')
}
