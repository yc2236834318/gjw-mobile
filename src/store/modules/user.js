// 用户仓库模块

import { getInfo, setInfo } from '@/utils/storage' // 导入存储模块函数

export default {
  namespaced: true,
  state () {
    return {
      userInfo: getInfo() // 在本地获取用户信息
    }
  },
  mutations: {
    // 获取用户信息
    setUserInfo (state, obj) {
      state.userInfo = obj
      setInfo(obj) // 将用户信息存入到本地
    }
  },
  actions: {
    // 退出登录
    logout (context) {
      // 清除个人信息
      context.commit('setUserInfo', {})
      // 清除购物车信息(调用仓库模块的函数-跨模块)
      context.commit('cart/setCartList', [], { root: true })
    }
  },
  getters: {}
}
