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