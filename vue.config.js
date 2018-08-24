module.exports = {
  configureWebpack: {
    plugins: [
      // new MyAwesomeWebpackPlugin()
    ],
    externals:{
      'vue': 'Vue',
      'ELEMENT': 'element-ui'
    }
  }
}