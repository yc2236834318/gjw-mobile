// axios请求配置文件

import axios from 'axios'
import store from '@/store/index'
import { Toast } from 'vant'

// axios实例化
const instance = axios.create({
  baseURL: 'http://cba.itlike.com/public/index.php?s=/api/', // 项目基地址
  timeout: 5000 // 超时时间
})

// 请求拦截器
instance.interceptors.request.use(config => {
  // 设置token(根据后端接口来配置)
  const token = store.getters.token
  if (token) {
    config.headers['Access-Token'] = token
    config.headers.platform = 'H5'
  }
  // 请求时开启loading弹窗
  Toast.loading({
    message: '加载中...',
    forbidClick: true, // 禁止背景点击
    duration: 0 // 禁止自动消失
  })
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
instance.interceptors.response.use(response => {
  const res = response.data
  // 统一处理请求错误
  if (res.status !== 200) {
    Toast(res.message) // 弹出提示信息
    return Promise.reject(res.message) // 抛出错误提示
  }
  Toast.clear() // 成功响应后关闭loading弹窗
  return res
}, error => {
  return Promise.reject(error)
})

// 导出实例
export default instance
