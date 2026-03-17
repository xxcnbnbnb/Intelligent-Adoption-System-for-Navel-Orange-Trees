<template>
  <div class="admin-layout">
    <!-- 侧边导航栏 -->
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <h3>管理员后台</h3>
      </div>
      <nav class="sidebar-menu">
        <router-link to="/admin/dashboard" class="menu-item">
          <span class="menu-icon">📊</span>
          <span class="menu-text">数据显示</span>
        </router-link>
        <router-link to="/admin/profile" class="menu-item">
          <span class="menu-icon">👤</span>
          <span class="menu-text">个人中心</span>
        </router-link>
        <router-link to="/admin/users" class="menu-item">
          <span class="menu-icon">👥</span>
          <span class="menu-text">用户管理</span>
        </router-link>
        <router-link to="/admin/operations" class="menu-item">
          <span class="menu-icon">📋</span>
          <span class="menu-text">操作日志</span>
        </router-link>
        <router-link to="/admin/trees" class="menu-item">
          <span class="menu-icon">🌳</span>
          <span class="menu-text">树木管理</span>
        </router-link>
        <router-link to="/admin/harvests" class="menu-item">
          <span class="menu-icon">🍊</span>
          <span class="menu-text">收获管理</span>
        </router-link>
        <router-link to="/admin/adoptions" class="menu-item">
          <span class="menu-icon">📋</span>
          <span class="menu-text">认养订单</span>
        </router-link>
        <a href="#" class="menu-item logout" @click.prevent="handleLogout">
          <span class="menu-icon">🚪</span>
          <span class="menu-text">退出登录</span>
        </a>
      </nav>
    </aside>
    
    <!-- 主内容区域 -->
    <div class="admin-content">
      <!-- 顶部导航栏 -->
      <header class="admin-header">
        <div class="header-content">
          <h2>{{ currentRoute.meta.title || '管理员后台' }}</h2>
          <div class="admin-info">
            <span class="admin-name">{{ adminStore.adminInfo?.real_name || '管理员' }}</span>
          </div>
        </div>
      </header>
      
      <!-- 内容区域 -->
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAdminStore } from '../../store';

export default {
  name: 'AdminLayout',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const adminStore = useAdminStore();
    
    // 当前路由信息
    const currentRoute = computed(() => route);
    
    // 退出登录
    const handleLogout = () => {
      adminStore.logout();
      router.push('/admin/login');
    };
    
    // 页面加载时获取管理员信息
    onMounted(() => {
      if (adminStore.isLoggedIn) {
        adminStore.getProfile();
      }
    });
    
    return {
      currentRoute,
      adminStore,
      handleLogout
    };
  }
};
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--background-color);
}

.admin-sidebar {
  width: 240px;
  background-color: var(--white);
  box-shadow: var(--shadow-sm);
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  z-index: 100;
}

.sidebar-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}

.sidebar-header h3 {
  color: var(--primary-color);
  margin: 0;
  font-size: var(--font-size-lg);
}

.sidebar-menu {
  padding: var(--spacing-md) 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  text-decoration: none;
  color: var(--text-color);
  transition: all var(--transition-fast);
  border-left: 3px solid transparent;
}

.menu-item:hover,
.menu-item.router-link-active {
  background-color: rgba(76, 175, 80, 0.1);
  color: var(--primary-color);
  border-left-color: var(--primary-color);
}

.menu-icon {
  font-size: var(--font-size-lg);
  width: 24px;
  text-align: center;
}

.menu-text {
  font-size: var(--font-size-md);
  font-weight: 500;
}

.menu-item.logout {
  margin-top: var(--spacing-lg);
  color: var(--error-color);
}

.menu-item.logout:hover {
  background-color: rgba(244, 67, 54, 0.1);
  border-left-color: var(--error-color);
}

.admin-content {
  flex: 1;
  margin-left: 240px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.admin-header {
  background-color: var(--white);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h2 {
  margin: 0;
  font-size: var(--font-size-lg);
  color: var(--text-color);
}

.admin-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.admin-name {
  font-size: var(--font-size-md);
  font-weight: 500;
  color: var(--text-color);
}

.main-content {
  flex: 1;
  padding: var(--spacing-lg);
  overflow-y: auto;
}

@media (max-width: 768px) {
  .admin-sidebar {
    width: 200px;
  }
  
  .admin-content {
    margin-left: 200px;
  }
  
  .sidebar-header h3 {
    font-size: var(--font-size-md);
  }
  
  .menu-text {
    font-size: var(--font-size-sm);
  }
  
  .main-content {
    padding: var(--spacing-md);
  }
}

@media (max-width: 480px) {
  .admin-sidebar {
    width: 60px;
  }
  
  .admin-content {
    margin-left: 60px;
  }
  
  .sidebar-header h3,
  .menu-text {
    display: none;
  }
  
  .menu-icon {
    font-size: var(--font-size-xl);
  }
}
</style>