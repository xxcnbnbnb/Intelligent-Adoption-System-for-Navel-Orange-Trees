<template>
  <div class="user-layout">
    <!-- 顶部导航栏 -->
    <header class="user-header">
      <div class="container">
        <div class="header-content">
          <div class="logo">
            <router-link to="/user/home">脐橙树认养系统</router-link>
          </div>
          <nav class="nav-menu">
            <router-link to="/user/home" class="nav-item">首页</router-link>
            <router-link to="/user/trees" class="nav-item">树木列表</router-link>
            <router-link to="/user/adoptions" class="nav-item">认养订单</router-link>
            <router-link to="/user/logistics" class="nav-item">物流信息</router-link>
          </nav>
          <div class="user-info">
            <div class="user-avatar" @click="toggleUserMenu">
              <span>{{ userStore.userInfo?.nickname || '用户' }}</span>
            </div>
            <div v-if="userMenuVisible" class="user-menu">
              <router-link to="/user/profile" class="menu-item">个人中心</router-link>
              <a href="#" class="menu-item" @click.prevent="handleLogout">退出登录</a>
            </div>
          </div>
        </div>
      </div>
    </header>
    
    <!-- 主要内容区域 -->
    <main class="user-main">
      <div class="container">
        <router-view />
      </div>
    </main>
    
    <!-- 底部信息 -->
    <footer class="user-footer">
      <div class="container">
        <p>© 2026 脐橙树认养系统 - 版权所有</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../store';

export default {
  name: 'UserLayout',
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    const userMenuVisible = ref(false);
    
    // 切换用户菜单
    const toggleUserMenu = () => {
      userMenuVisible.value = !userMenuVisible.value;
    };
    
    // 退出登录
    const handleLogout = () => {
      userStore.logout();
      router.push('/user/login');
    };
    
    // 页面加载时获取用户信息
    onMounted(() => {
      if (userStore.isLoggedIn) {
        userStore.getProfile();
      }
    });
    
    return {
      userStore,
      userMenuVisible,
      toggleUserMenu,
      handleLogout
    };
  }
};
</script>

<style scoped>
.user-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.user-header {
  background-color: var(--white);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) 0;
}

.logo {
  font-size: var(--font-size-xl);
  font-weight: bold;
  color: var(--primary-color);
}

.logo a {
  text-decoration: none;
  color: inherit;
}

.nav-menu {
  display: flex;
  gap: var(--spacing-lg);
}

.nav-item {
  text-decoration: none;
  color: var(--text-color);
  font-size: var(--font-size-md);
  font-weight: 500;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  transition: all var(--transition-fast);
}

.nav-item:hover,
.nav-item.router-link-active {
  color: var(--primary-color);
  background-color: rgba(76, 175, 80, 0.1);
}

.user-info {
  position: relative;
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.user-avatar:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.user-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: var(--white);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-sm) 0;
  min-width: 150px;
  margin-top: var(--spacing-xs);
  z-index: 1000;
}

.menu-item {
  display: block;
  padding: var(--spacing-sm) var(--spacing-md);
  text-decoration: none;
  color: var(--text-color);
  font-size: var(--font-size-sm);
  transition: background-color var(--transition-fast);
}

.menu-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.user-main {
  flex: 1;
  padding: var(--spacing-lg) 0;
}

.user-footer {
  background-color: var(--white);
  border-top: 1px solid var(--border-color);
  padding: var(--spacing-lg) 0;
  margin-top: auto;
}

.user-footer p {
  text-align: center;
  color: var(--text-light);
  font-size: var(--font-size-sm);
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: var(--spacing-md);
    padding: var(--spacing-sm) 0;
  }
  
  .nav-menu {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .user-info {
    align-self: flex-end;
  }
}
</style>