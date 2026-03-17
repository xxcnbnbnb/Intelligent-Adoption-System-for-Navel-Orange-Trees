const adminRoutes = [
  {
    path: '/admin',
    component: () => import('../views/admin/Layout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('../views/admin/Dashboard.vue'),
        meta: { title: '仪表盘' }
      },
      {
        path: 'profile',
        name: 'AdminProfile',
        component: () => import('../views/admin/Profile.vue'),
        meta: { title: '个人中心' }
      },
      {
        path: 'users',
        name: 'UserManagement',
        component: () => import('../views/admin/UserManagement.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: 'operations',
        name: 'OperationLogs',
        component: () => import('../views/admin/OperationLogs.vue'),
        meta: { title: '操作日志' }
      },
      {
        path: 'trees',
        name: 'TreeManagement',
        component: () => import('../views/admin/TreeManagement.vue'),
        meta: { title: '树木管理' }
      },
      {
        path: 'harvests',
        name: 'HarvestManagement',
        component: () => import('../views/admin/HarvestManagement.vue'),
        meta: { title: '收获管理' }
      },
      {
        path: 'adoptions',
        name: 'AdoptionManagement',
        component: () => import('../views/admin/AdoptionManagement.vue'),
        meta: { title: '认养订单管理' }
      }
    ]
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('../views/admin/Login.vue'),
    meta: { title: '管理员登录' }
  }
];

export default adminRoutes;