import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
		{
			path: '/',
			name: 'Home',
			component: resolve => require(['@/components/Home'], resolve)
		},
		{
			path: '/admin',
			name: 'Login',
			component: resolve => require(['@/components/Login'], resolve)
		}
  ]
});