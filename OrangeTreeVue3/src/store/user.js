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