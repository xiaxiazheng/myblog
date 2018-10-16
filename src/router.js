export default new VueRouter({
  routes: [
		{
			path: '',
			// 这里不用设置name
			component: resolve => require(['@/views/Home'], resolve),
			children: [
				{
					path: '',  // 因为在这里已经设置了默认的路由
					name: 'Main',
					component: resolve => require(['@/views/home/Main'], resolve),
				},
				{
					path: 'tree',
					name: 'Tree',
					component: resolve => require(['@/views/home/Tree'], resolve),
				},
				{
					path: 'photowall',
					name: 'PhotoWall',
					component: resolve => require(['@/views/home/PhotoWall'], resolve),
				}
			]
		},
		{
			path: '/login',
			name: 'Login',
			component: resolve => require(['@/views/Login'], resolve),
		},
		{
			path: '/admin',
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
					path: 'adminphotowall',
					name: 'AdminPhotoWall',
					component: resolve => require(['@/views/admin/AdminPhotoWall'], resolve),
				}
			]
		},
  ]
});