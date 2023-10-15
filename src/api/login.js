// 登录页接口请求文件

import request from '@/utils/request' // 导入请求配置文件

// 1.获取图形验证码
export const getPicCodeApi = () => {
  return request.get('/captcha/image')
}

// 2.获取短信验证码
export const getMsgCodeApi = (captchaCode, captchaKey, mobile) => {
  return request.post('/captcha/sendSmsCaptcha', {
    form: {
      captchaCode, // 图形验证码
      captchaKey, // 图形验证码ID
      mobile // 手机号
    }
  })
}

// 3.登录接口请求
export const codeLogin = (mobile, smsCode) => {
  return request.post('/passport/login', {
    form: {
      isParty: false, // 是否第三方登录
      partyData: {}, // 第三方信息
      mobile, // 手机号
      smsCode // 短信验证码
    }
  })
}
