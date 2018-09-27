const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
  // assetsDir: "static", // 会全部打包到static文件夹中
  configureWebpack: {
    plugins: [
      // new BundleAnalyzerPlugin()  // 这个如果不是要打包查看打包情况的话还是注释掉吧
    ],
    externals:{
      'vue': 'Vue',
      'ELEMENT': 'element-ui',
      'VueRouter': 'VueRouter',
    },
  }
}