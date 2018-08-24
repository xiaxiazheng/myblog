// import VueRouter from 'vue-router'
// Vue.use(VueRouter)

export default new VueRouter({
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