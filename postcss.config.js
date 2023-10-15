// postcss配置文件

module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
      // vw适配的标准屏的宽度(iPhoneX:375)
      viewportWidth: 375
    }
  }
}
