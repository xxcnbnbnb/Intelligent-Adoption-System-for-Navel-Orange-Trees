import { createRouter, createWebHistory } from 'vue-router';
import userRoutes from './user';
import adminRoutes from './admin';
import { useUserStore, useAdminStore } from '../store';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/user/home'
    },
    ...userRoutes,
    ...adminRoutes,
    {
      path: '/:pathMatch(.*)*',
      redirect: '/user/home'
    }
  ]
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const adminStore = useAdminStore();
  
  // 检查用户端路由
  if (to.path.startsWith('/user/')) {
    if (to.path === '/user/login' || to.path === '/user/register') {
      next();
    } else {
      if (userStore.isLoggedIn) {
        next();
      } else {
        next('/user/login');
      }
    }
  }
  
  // 检查管理员端路由
  else if (to.path.startsWith('/admin/')) {
    if (to.path === '/admin/login') {
      next();
    } else {
      if (adminStore.isLoggedIn) {
        next();
      } else {
        next('/admin/login');
      }
    }
  }
  
  else {
    next();
  }
});

export default router;