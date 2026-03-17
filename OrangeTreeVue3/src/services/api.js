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
    // 根据当前路径选择使用哪个token
    let token;
    if (window.location.pathname.startsWith('/admin/')) {
      token = getToken('adminToken');
    } else {
      token = getToken('token');
    }
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
      // 检查当前路径，决定跳转到哪个登录页面
      if (window.location.pathname.startsWith('/admin/')) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
      } else {
        localStorage.removeItem('token');
        window.location.href = '/user/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;