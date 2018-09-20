export default new VueRouter({
  routes: [
		{
			path: '/',
			name: 'Home',
			component: resolve => require(['@/views/Home'], resolve),
			children: [
				{
					path: '',
					name: 'Main',
					component: resolve => require(['@/views/home/Main'], resolve),
				},
				{
					path: 'tree',
					name: 'Tree',
					component: resolve => require(['@/views/home/Tree'], resolve),
				},
				{
					path: 'wait',
					name: 'Wait',
					component: resolve => require(['@/views/home/Wait'], resolve),
				}
			]
		},
		{
			path: '/login',
			name: 'Login',
			component: resolve => require(['@/components/Login'], resolve)
		},
		{
			path: '/admin',
			name: 'admin',
			component: resolve => require(['@/views/Admin'], resolve),
			children: [
				{
					path: '',
					name: 'AdminMain',
					component: resolve => require(['@/views/admin/AdminMain'], resolve),
				},
				{
					path: 'admintree',
					name: 'AdminTree',
					component: resolve => require(['@/views/admin/AdminTree'], resolve),
				},
				{
					path: 'adminwait',
					name: 'AdminWait',
					component: resolve => require(['@/views/admin/AdminWait'], resolve),
				}
			]
		}
  ]
});