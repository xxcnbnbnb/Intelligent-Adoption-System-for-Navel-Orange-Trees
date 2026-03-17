const userRoutes = [
  {
    path: '/user',
    component: () => import('../views/user/Layout.vue'),
    children: [
      {
        path: 'home',
        name: 'UserHome',
        component: () => import('../views/user/Home.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('../views/user/Profile.vue'),
        meta: { title: '个人中心' }
      },
      {
        path: 'trees',
        name: 'TreeList',
        component: () => import('../views/user/TreeList.vue'),
        meta: { title: '树木列表' }
      },
      {
        path: 'trees/:id',
        name: 'TreeDetail',
        component: () => import('../views/user/TreeDetail.vue'),
        meta: { title: '树木详情' }
      },
      {
        path: 'adoptions',
        name: 'AdoptionList',
        component: () => import('../views/user/AdoptionList.vue'),
        meta: { title: '认养订单' }
      },
      {
        path: 'adoptions/:id',
        name: 'AdoptionDetail',
        component: () => import('../views/user/AdoptionDetail.vue'),
        meta: { title: '订单详情' }
      },
      {
        path: 'growth/:treeId',
        name: 'GrowthRecords',
        component: () => import('../views/user/GrowthRecords.vue'),
        meta: { title: '生长记录' }
      },
      {
        path: 'logistics/:adoptionId',
        name: 'Logistics',
        component: () => import('../views/user/Logistics.vue'),
        meta: { title: '物流信息' }
      },
      {
        path: 'interaction/:treeId',
        name: 'Interaction',
        component: () => import('../views/user/Interaction.vue'),
        meta: { title: '树木互动' }
      }
    ]
  },
  {
    path: '/user/login',
    name: 'UserLogin',
    component: () => import('../views/user/Login.vue'),
    meta: { title: '用户登录' }
  },
  {
    path: '/user/register',
    name: 'UserRegister',
    component: () => import('../views/user/Register.vue'),
    meta: { title: '用户注册' }
  }
];

export default userRoutes;