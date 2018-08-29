// import Vue from 'vue'
import App from './App.vue'
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// Vue.use(ElementUI);
import router from './router' 
console.log(window);
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
