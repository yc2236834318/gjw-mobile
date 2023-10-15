<!-- 登录页 一级组件 -->

<template>
  <div class="login">
    <!-- 头部 -->
    <van-nav-bar title="会员登录" left-arrow @click-left="$router.go(-1)" />
    <!-- 主体 -->
    <div class="container">
      <div class="title">
        <h3>手机号登录</h3>
        <p>未注册的手机号登录后将自动注册</p>
      </div>
      <div class="form">
        <div class="form-item">
          <input class="inp" v-model="mobile" maxlength="11" placeholder="请输入手机号码" type="tel">
        </div>
        <div class="form-item">
          <input class="inp" v-model="picCode" maxlength="4" placeholder="请输入图形验证码" type="text">
          <img v-if="picUrl" :src="picUrl" @click="getPicCode" alt="">
        </div>
        <div class="form-item">
          <input class="inp" v-model="msgCode" placeholder="246810" type="text">
          <button @click="getCode">
          {{ second === totalSecond?'获取验证码':`${second}秒后重新发送` }}</button>
        </div>
      </div>
      <div class="login-btn" @click="login">登录</div>
    </div>
  </div>
</template>

<script>
import { getPicCodeApi, getMsgCodeApi, codeLogin } from '@/api/login' // 导入接口请求函数
export default {
  name: 'LoginIndex',
  data () {
    return {
      mobile: '', // 手机号
      picCode: '', // 图形验证码
      picKey: '', // 图形验证码唯一标识
      picUrl: '', // 图形验证码的图片地址
      msgCode: '', // 短信验证码
      totalSecond: 6, // 短信验证码倒计时总秒数
      second: 6, // 短信验证码倒计时剩余秒数
      timer: null // 短信验证码定时器
    }
  },
  created () {
    this.getPicCode()
  },
  destroyed () {
    clearInterval(this.timer) // 离开页面时清除定时器
  },
  methods: {
    // 获取图形验证码函数
    async getPicCode () {
      const res = await getPicCodeApi()
      this.picUrl = res.data.base64
      this.picKey = res.data.key
    },

    // 校验函数
    validFn () {
      // 手机号校验
      if (!/^1[3-9]\d{9}$/.test(this.mobile)) {
        this.$toast('请输入正确的手机号') // vant组件 轻提示
        return false
      }
      // 图形验证码校验
      if (!/^\w{4}$/.test(this.picCode)) {
        this.$toast('请输入4位的图形验证码')
        return false
      }
      return true
    },

    // 获取短信验证码函数
    async getCode () {
      // 1.判断是否已经有定时器开启
      if (this.timer) return
      // 2.判断totalSecond和second状态
      if (this.totalSecond !== this.second) return
      // 3.校验手机号和图形验证码是否正确
      if (!this.validFn()) return
      // 4.发起请求
      await getMsgCodeApi(this.picCode, this.picKey, this.mobile)
      this.$toast('已发送,请注意查收') // 弹出成功信息
      // 5.开启倒计时
      this.second-- // 更新获取状态
      this.timer = setInterval(() => {
        this.second--
        if (this.second <= 0) {
          // 6.关闭定时器
          clearInterval(this.timer) // 关闭定时器
          this.timer = null // 重置定时器
          this.second = this.totalSecond // 重置剩余秒数
        }
      }, 1000)
    },

    // 登录函数
    async login () {
      // 1.校验手机号
      if (!this.validFn()) return this.$toast('请输入正确的手机号')
      // 2.校验短信验证码
      if (!/^\d{6}$/.test(this.msgCode)) return this.$toast('请输入6位的短信验证码')
      // 3.调用登录请求函数
      const res = await codeLogin(this.mobile, this.msgCode)
      this.$toast('登录成功')
      // 4.获取用户信息(存入vuex)
      this.$store.commit('user/setUserInfo', res.data)
      // 5.两秒后跳转
      setTimeout(() => {
        // 获取地址栏回跳参数
        const backUrl = this.$route.query.backUrl
        if (backUrl) {
          // 若有回跳参数则跳转到回跳页面
          this.$router.replace(backUrl)
        } else {
          // 若没有回跳参数则跳转首页
          this.$router.replace('/')
        }
      }, 2000)
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  padding: 49px 29px;

  .title {
    margin-bottom: 20px;

    h3 {
      font-size: 26px;
      font-weight: normal;
    }

    p {
      color: #b8b8b8;
      font-size: 14px;
      line-height: 40px;
    }
  }

  .form-item {
    display: flex;
    align-items: center;
    margin-bottom: 14px;
    padding: 8px;
    border-bottom: 1px solid #f3f1f2;

    .inp {
      flex: 1;
      display: block;
      height: 32px;
      font-size: 14px;
      border: none;
      outline: none;
    }

    img {
      width: 94px;
      height: 31px;
    }

    button {
      height: 31px;
      padding-right: 9px;
      color: #cea26a;
      font-size: 13px;
      background-color: transparent;
      border: none;
    }
  }

  .login-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 42px;
    margin-top: 39px;
    color: #fff;
    border-radius: 39px;
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, .1);
    background: linear-gradient(90deg, #ecb53c, #ff9211);
    letter-spacing: 2px;
  }
}
</style>
