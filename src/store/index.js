// vuex仓库文件

import Vue from 'vue'
import Vuex from 'vuex'

// 引入仓库模块文件
import user from '@/store/modules/user'
import cart from '@/store/modules/cart'

Vue.use(Vuex)

export default new Vuex.Store({
  getters: {
    token (state) {
      return state.user.userInfo.token // 获取vuex中存放的用户身份令牌
    }
  },
  modules: {
    user,
    cart
  }
})
