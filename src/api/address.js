// 收货地址接口请求文件

import request from '@/utils/request' // 导入请求配置文件

// 获取地址列表
export const getAddressListApi = () => {
  return request.get('/address/list')
}
