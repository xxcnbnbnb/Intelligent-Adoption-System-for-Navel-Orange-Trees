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