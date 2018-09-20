import App from './App.vue'
import router from './router.js' 

// 使页面pre代码高亮
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css' //样式文件
Vue.directive('highlight',function (el) {
  let blocks = el.querySelectorAll('pre');
  blocks.forEach((block)=>{
    hljs.highlightBlock(block)
  })
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
