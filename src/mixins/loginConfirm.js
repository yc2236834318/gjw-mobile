// 组件混合文件-登录提示框

export default {
  methods: {
    // 未登录时的弹窗提示
    loginConfirm () {
      // 若没有登录则弹出交互框
      if (!this.$store.getters.token) {
        this.$dialog.confirm({
          title: '温馨提示',
          message: '请先登录',
          confirmButtonText: '去登录',
          cancelButtonText: '再逛逛'
        })
          .then(() => {
            // 确认
            this.$router.replace({
              path: '/login', // 跳转到登录页
              // 登录后跳回商品页(需要在login页中配置代码)
              query: { backUrl: this.$route.fullPath }
            })
          })
          .catch(() => { }) // 取消
        return true
      }
      return false
    }
  }
}
