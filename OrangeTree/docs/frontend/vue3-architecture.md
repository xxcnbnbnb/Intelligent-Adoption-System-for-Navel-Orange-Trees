# 脐橙树认养系统 - Vue3+Vite 前端架构文档

## 📋 目录

- [项目概述](#项目概述)
- [技术栈选择](#技术栈选择)
- [项目结构设计](#项目结构设计)
- [核心功能模块](#核心功能模块)
- [API接口集成](#api接口集成)
- [状态管理方案](#状态管理方案)
- [路由设计](#路由设计)
- [权限管理](#权限管理)
- [样式设计](#样式设计)
- [开发与部署](#开发与部署)

---

## 项目概述

脐橙树认养系统前端基于Vue3+Vite构建，旨在为用户和管理员提供直观、高效的交互界面。系统分为用户端和管理员端两大部分，实现完整的脐橙树认养业务流程。

### 主要功能

**用户端功能：**
- 用户登录/注册
- 个人资料管理
- 树木浏览与筛选
- 树木详情查看
- 认养订单创建与管理
- 生长记录查看
- 物流信息管理
- 用户互动（树木命名、祝福留言、分享）

**管理员端功能：**
- 管理员登录
- 个人资料管理
- 角色权限管理
- 操作日志查看
- 树木管理
- 收获管理

---

## 技术栈选择

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | 3.x | 前端框架 |
| Vite | 5.x | 构建工具 |
| Vue Router | 4.x | 路由管理 |
| Pinia | 2.x | 状态管理 |
| Axios | 1.x | API请求 |
| Element Plus | 2.x | UI组件库 |
| SCSS | 1.x | 样式预处理器 |
| ESLint | 8.x | 代码规范 |
| Prettier | 3.x | 代码格式化 |

---

## 项目结构设计

```
frontend/
├── public/                 # 静态资源
│   ├── favicon.ico
│   └── logo.png
├── src/
│   ├── assets/            # 资源文件
│   │   ├── images/        # 图片资源
│   │   ├── styles/        # 全局样式
│   │   └── icons/         # 图标资源
│   ├── components/        # 通用组件
│   │   ├── common/        # 基础通用组件
│   │   ├── user/          # 用户端组件
│   │   └── admin/         # 管理员端组件
│   ├── views/             # 页面组件
│   │   ├── user/          # 用户端页面
│   │   │   ├── Login.vue
│   │   │   ├── Register.vue
│   │   │   ├── Home.vue
│   │   │   ├── Profile.vue
│   │   │   ├── TreeList.vue
│   │   │   ├── TreeDetail.vue
│   │   │   ├── AdoptionList.vue
│   │   │   ├── AdoptionDetail.vue
│   │   │   ├── GrowthRecords.vue
│   │   │   ├── Logistics.vue
│   │   │   └── Interaction.vue
│   │   └── admin/         # 管理员端页面
│   │       ├── Login.vue
│   │       ├── Dashboard.vue
│   │       ├── Profile.vue
│   │       ├── RoleManagement.vue
│   │       ├── OperationLogs.vue
│   │       ├── TreeManagement.vue
│   │       └── HarvestManagement.vue
│   ├── router/            # 路由配置
│   │   ├── index.js
│   │   ├── user.js
│   │   └── admin.js
│   ├── store/             # 状态管理
│   │   ├── index.js
│   │   ├── user.js
│   │   ├── admin.js
│   │   └── tree.js
│   ├── services/          # API服务
│   │   ├── api.js         # API基础配置
│   │   ├── user.js        # 用户端API
│   │   └── admin.js       # 管理员端API
│   ├── utils/             # 工具函数
│   │   ├── auth.js        # 认证相关
│   │   ├── request.js     # 请求封装
│   │   └── validator.js   # 表单验证
│   ├── App.vue            # 根组件
│   └── main.js            # 入口文件
├── .env.development       # 开发环境配置
├── .env.production        # 生产环境配置
├── vite.config.js         # Vite配置
├── package.json           # 项目依赖
└── README.md              # 项目说明
```

---

## 核心功能模块

### 1. 用户认证模块

**功能：**
- 用户登录/注册
- 管理员登录
- JWT令牌管理
- 权限验证

**关键组件：**
- `Login.vue`：登录页面
- `Register.vue`：注册页面
- `auth.js`：认证工具
- `AuthGuard`：路由守卫

### 2. 树木管理模块

**功能：**
- 树木列表展示
- 树木筛选与搜索
- 树木详情查看
- 360°全景展示

**关键组件：**
- `TreeList.vue`：树木列表页面
- `TreeDetail.vue`：树木详情页面
- `TreeCard.vue`：树木卡片组件
- `TreeFilter.vue`：树木筛选组件

### 3. 认养订单模块

**功能：**
- 创建认养订单
- 订单列表管理
- 订单详情查看
- 订单状态更新

**关键组件：**
- `AdoptionList.vue`：订单列表页面
- `AdoptionDetail.vue`：订单详情页面
- `AdoptionForm.vue`：订单创建表单

### 4. 生长记录模块

**功能：**
- 生长记录列表
- 生长记录详情
- 图片/视频展示

**关键组件：**
- `GrowthRecords.vue`：生长记录列表页面
- `GrowthDetail.vue`：生长记录详情页面
- `MediaViewer.vue`：媒体查看器组件

### 5. 物流信息模块

**功能：**
- 物流信息查看
- 确认收货
- 物流状态追踪

**关键组件：**
- `Logistics.vue`：物流信息页面
- `LogisticsStatus.vue`：物流状态组件

### 6. 用户互动模块

**功能：**
- 树木命名
- 祝福留言
- 社交分享
- 互动记录查看

**关键组件：**
- `Interaction.vue`：互动页面
- `BlessingForm.vue`：祝福表单组件
- `ShareButton.vue`：分享按钮组件

### 7. 管理员后台模块

**功能：**
- 角色权限管理
- 操作日志查看
- 树木管理
- 收获管理

**关键组件：**
- `Dashboard.vue`：管理员仪表盘
- `RoleManagement.vue`：角色管理页面
- `OperationLogs.vue`：操作日志页面
- `TreeManagement.vue`：树木管理页面
- `HarvestManagement.vue`：收获管理页面

---

## API接口集成

### 1. API基础配置

```javascript
// src/services/api.js
import axios from 'axios';
import { getToken } from '../utils/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    if (error.response && error.response.status === 401) {
      // 处理未授权
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 2. 用户端API

```javascript
// src/services/user.js
import api from './api';

export const userApi = {
  // 登录
  login: (data) => api.post('/user/login', data),
  
  // 获取个人资料
  getProfile: () => api.get('/user/profile'),
  
  // 更新个人资料
  updateProfile: (data) => api.put('/user/profile', data),
  
  // 获取树木列表
  getTrees: (params) => api.get('/user/trees', { params }),
  
  // 获取树木详情
  getTreeById: (id) => api.get(`/user/trees/${id}`),
  
  // 创建认养订单
  createAdoption: (data) => api.post('/user/adoptions', data),
  
  // 获取订单列表
  getUserAdoptions: (params) => api.get('/user/adoptions', { params }),
  
  // 获取订单详情
  getAdoptionById: (id) => api.get(`/user/adoptions/${id}`),
  
  // 更新订单状态
  updateAdoptionStatus: (id, data) => api.put(`/user/adoptions/${id}/status`, data),
  
  // 获取生长记录
  getGrowthRecords: (treeId, params) => api.get(`/user/trees/${treeId}/growth`, { params }),
  
  // 获取生长记录详情
  getGrowthRecordById: (id) => api.get(`/user/growth/${id}`),
  
  // 获取物流信息
  getLogistics: (adoptionId) => api.get(`/user/adoptions/${adoptionId}/logistics`),
  
  // 确认收货
  receiveLogistics: (id) => api.put(`/user/logistics/${id}/receive`),
  
  // 创建互动记录
  createInteraction: (data) => api.post('/user/interactions', data),
  
  // 获取树木互动记录
  getTreeInteractions: (treeId, params) => api.get(`/user/trees/${treeId}/interactions`, { params })
};
```

### 3. 管理员端API

```javascript
// src/services/admin.js
import api from './api';

export const adminApi = {
  // 登录
  login: (data) => api.post('/admin/login', data),
  
  // 获取个人资料
  getProfile: () => api.get('/admin/profile'),
  
  // 更新个人资料
  updateProfile: (data) => api.put('/admin/profile', data),
  
  // 获取角色列表
  getRoles: (params) => api.get('/admin/roles', { params }),
  
  // 创建角色
  createRole: (data) => api.post('/admin/roles', data),
  
  // 更新角色
  updateRole: (id, data) => api.put(`/admin/roles/${id}`, data),
  
  // 删除角色
  deleteRole: (id) => api.delete(`/admin/roles/${id}`),
  
  // 获取操作日志
  getOperations: (params) => api.get('/admin/operations', { params }),
  
  // 获取操作日志详情
  getOperationById: (id) => api.get(`/admin/operations/${id}`),
  
  // 获取树木管理列表
  getTrees: (params) => api.get('/admin/trees', { params }),
  
  // 创建树木管理记录
  createTree: (data) => api.post('/admin/trees', data),
  
  // 更新树木管理记录
  updateTree: (id, data) => api.put(`/admin/trees/${id}`, data),
  
  // 删除树木管理记录
  deleteTree: (id) => api.delete(`/admin/trees/${id}`),
  
  // 获取收获记录列表
  getHarvests: (params) => api.get('/admin/harvests', { params }),
  
  // 创建收获记录
  createHarvest: (data) => api.post('/admin/harvests', data),
  
  // 更新收获记录
  updateHarvest: (id, data) => api.put(`/admin/harvests/${id}`, data)
};
```

---

## 状态管理方案

使用Pinia进行状态管理，分为用户、管理员和树木三个主要模块：

### 1. 用户状态

```javascript
// src/store/user.js
import { defineStore } from 'pinia';
import { userApi } from '../services/user';
import { setToken, removeToken } from '../utils/auth';

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    token: localStorage.getItem('token') || null,
    isLoggedIn: !!localStorage.getItem('token'),
    loading: false,
    error: null
  }),
  
  actions: {
    async login(credentials) {
      this.loading = true;
      this.error = null;
      try {
        const response = await userApi.login(credentials);
        if (response.success) {
          this.token = response.data.token;
          this.userInfo = response.data.user;
          this.isLoggedIn = true;
          setToken(response.data.token);
          return response;
        } else {
          this.error = response.message;
          throw new Error(response.message);
        }
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async getProfile() {
      if (!this.isLoggedIn) return;
      try {
        const response = await userApi.getProfile();
        if (response.success) {
          this.userInfo = response.data;
        }
      } catch (error) {
        console.error('获取个人资料失败:', error);
      }
    },
    
    logout() {
      this.userInfo = null;
      this.token = null;
      this.isLoggedIn = false;
      removeToken();
    }
  }
});
```

### 2. 管理员状态

```javascript
// src/store/admin.js
import { defineStore } from 'pinia';
import { adminApi } from '../services/admin';
import { setToken, removeToken } from '../utils/auth';

export const useAdminStore = defineStore('admin', {
  state: () => ({
    adminInfo: null,
    token: localStorage.getItem('adminToken') || null,
    isLoggedIn: !!localStorage.getItem('adminToken'),
    loading: false,
    error: null
  }),
  
  actions: {
    async login(credentials) {
      this.loading = true;
      this.error = null;
      try {
        const response = await adminApi.login(credentials);
        if (response.success) {
          this.token = response.data.token;
          this.adminInfo = response.data.admin;
          this.isLoggedIn = true;
          setToken(response.data.token, 'adminToken');
          return response;
        } else {
          this.error = response.message;
          throw new Error(response.message);
        }
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async getProfile() {
      if (!this.isLoggedIn) return;
      try {
        const response = await adminApi.getProfile();
        if (response.success) {
          this.adminInfo = response.data;
        }
      } catch (error) {
        console.error('获取管理员资料失败:', error);
      }
    },
    
    logout() {
      this.adminInfo = null;
      this.token = null;
      this.isLoggedIn = false;
      removeToken('adminToken');
    }
  }
});
```

### 3. 树木状态

```javascript
// src/store/tree.js
import { defineStore } from 'pinia';
import { userApi } from '../services/user';

export const useTreeStore = defineStore('tree', {
  state: () => ({
    trees: [],
    currentTree: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      pages: 1
    }
  }),
  
  actions: {
    async getTrees(params) {
      this.loading = true;
      this.error = null;
      try {
        const response = await userApi.getTrees(params);
        if (response.success) {
          this.trees = response.data;
          this.pagination = response.pagination || this.pagination;
        }
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    
    async getTreeById(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await userApi.getTreeById(id);
        if (response.success) {
          this.currentTree = response.data;
        }
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    }
  }
});
```

---

## 路由设计

### 1. 主路由配置

```javascript
// src/router/index.js
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
```

### 2. 用户端路由

```javascript
// src/router/user.js
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
```

### 3. 管理员端路由

```javascript
// src/router/admin.js
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
        path: 'roles',
        name: 'RoleManagement',
        component: () => import('../views/admin/RoleManagement.vue'),
        meta: { title: '角色管理' }
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
```

---

## 权限管理

### 1. 认证工具

```javascript
// src/utils/auth.js
// 存储令牌
export const setToken = (token, key = 'token') => {
  localStorage.setItem(key, token);
};

// 获取令牌
export const getToken = (key = 'token') => {
  return localStorage.getItem(key);
};

// 删除令牌
export const removeToken = (key = 'token') => {
  localStorage.removeItem(key);
};

// 检查是否登录
export const isLoggedIn = (key = 'token') => {
  return !!localStorage.getItem(key);
};
```

### 2. 权限指令

```javascript
// src/directives/permission.js
import { useAdminStore } from '../store';

export const permission = {
  mounted(el, binding) {
    const adminStore = useAdminStore();
    const { value } = binding;
    
    if (value && value.length > 0) {
      const hasPermission = value.some(permission => {
        // 这里需要根据实际的权限系统进行判断
        // 示例：检查管理员角色是否有对应权限
        return adminStore.adminInfo?.role_id === 1; // 假设1是超级管理员
      });
      
      if (!hasPermission) {
        el.style.display = 'none';
      }
    }
  }
};
```

---

## 样式设计

### 1. 全局样式

```scss
// src/assets/styles/global.scss
:root {
  // 颜色变量
  --primary-color: #4CAF50;
  --secondary-color: #8BC34A;
  --accent-color: #FF9800;
  --text-color: #333333;
  --text-light: #666666;
  --background-color: #f5f5f5;
  --white: #ffffff;
  --border-color: #e0e0e0;
  --success-color: #4CAF50;
  --warning-color: #FF9800;
  --error-color: #f44336;
  --info-color: #2196F3;
  
  // 间距
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  // 圆角
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  
  // 阴影
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.1);
  
  // 字体
  --font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-md: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 24px;
  
  // 过渡
  --transition-fast: 0.2s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family);
  font-size: var(--font-size-md);
  color: var(--text-color);
  background-color: var(--background-color);
  line-height: 1.6;
}

// 容器
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

// 卡片
.card {
  background-color: var(--white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  transition: box-shadow var(--transition-normal);
  
  &:hover {
    box-shadow: var(--shadow-md);
  }
}

// 按钮
.btn {
  display: inline-block;
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-md);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  text-decoration: none;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &-primary {
    background-color: var(--primary-color);
    color: var(--white);
    
    &:hover:not(:disabled) {
      background-color: darken(var(--primary-color), 10%);
    }
  }
  
  &-secondary {
    background-color: var(--secondary-color);
    color: var(--white);
    
    &:hover:not(:disabled) {
      background-color: darken(var(--secondary-color), 10%);
    }
  }
  
  &-accent {
    background-color: var(--accent-color);
    color: var(--white);
    
    &:hover:not(:disabled) {
      background-color: darken(var(--accent-color), 10%);
    }
  }
  
  &-outline {
    background-color: transparent;
    border: 1px solid var(--primary-color);
    color: var(--primary-color);
    
    &:hover:not(:disabled) {
      background-color: var(--primary-color);
      color: var(--white);
    }
  }
}

// 表单
.form {
  &-group {
    margin-bottom: var(--spacing-md);
    
    label {
      display: block;
      margin-bottom: var(--spacing-xs);
      font-weight: 500;
    }
    
    input,
    select,
    textarea {
      width: 100%;
      padding: var(--spacing-sm);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius-sm);
      font-size: var(--font-size-md);
      transition: border-color var(--transition-fast);
      
      &:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
      }
      
      &.error {
        border-color: var(--error-color);
      }
    }
    
    .error-message {
      color: var(--error-color);
      font-size: var(--font-size-xs);
      margin-top: var(--spacing-xs);
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  :root {
    --font-size-md: 14px;
    --font-size-lg: 16px;
    --font-size-xl: 20px;
  }
  
  .container {
    padding: 0 var(--spacing-sm);
  }
  
  .card {
    padding: var(--spacing-md);
  }
}
```

### 2. 主题配置

```javascript
// src/plugins/element.js
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn';

// 自定义主题
const themeConfig = {
  colors: {
    primary: '#4CAF50',
    success: '#4CAF50',
    warning: '#FF9800',
    danger: '#f44336',
    info: '#2196F3'
  }
};

export default {
  install(app) {
    app.use(ElementPlus, {
      locale: zhCn,
      size: 'default'
    });
  }
};
```

---

## 开发与部署

### 1. 开发环境

**安装依赖：**
```bash
cd frontend
npm install
```

**启动开发服务器：**
```bash
npm run dev
```

**代码规范检查：**
```bash
npm run lint
```

### 2. 生产环境

**构建：**
```bash
npm run build
```

**预览生产构建：**
```bash
npm run preview
```

### 3. 环境配置

**开发环境配置 (.env.development)：**
```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE=脐橙树认养系统
VITE_APP_ENV=development
```

**生产环境配置 (.env.production)：**
```
VITE_API_BASE_URL=https://api.example.com/api
VITE_APP_TITLE=脐橙树认养系统
VITE_APP_ENV=production
```

---

## 项目初始化命令

### 创建Vue3+Vite项目

```bash
npm create vite@latest frontend -- --template vue
cd frontend
npm install
```

### 安装必要依赖

```bash
npm install vue-router@4 pinia axios element-plus sass eslint prettier
```

### 初始化项目结构

按照上述项目结构设计创建相应的目录和文件。

---

## 总结

本前端架构文档基于Vue3+Vite技术栈，设计了一个完整的脐橙树认养系统前端方案。该方案包含：

1. **完整的项目结构**：清晰的目录组织和文件结构
2. **全面的功能模块**：覆盖用户端和管理员端的所有功能
3. **规范的API集成**：统一的API调用方式和错误处理
4. **高效的状态管理**：使用Pinia进行状态管理
5. **安全的权限控制**：完善的认证和授权机制
6. **美观的样式设计**：统一的设计风格和响应式布局
7. **规范的开发流程**：完整的开发和部署流程

通过本架构方案，可以快速构建一个功能完整、用户体验良好的脐橙树认养系统前端应用。