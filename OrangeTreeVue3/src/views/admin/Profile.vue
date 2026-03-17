<template>
  <div class="profile">
    <h2>个人中心</h2>
    <div class="profile-card">
      <h3>个人信息</h3>
      <form @submit.prevent="handleUpdate">
        <div class="form-group">
          <label for="username">用户名</label>
          <input 
            type="text" 
            id="username" 
            v-model="form.username" 
            class="form-control" 
            disabled
          >
        </div>
        <div class="form-group">
          <label for="real_name">真实姓名</label>
          <input 
            type="text" 
            id="real_name" 
            v-model="form.real_name" 
            class="form-control"
          >
        </div>
        <div class="form-group">
          <label for="phone">手机号</label>
          <input 
            type="text" 
            id="phone" 
            v-model="form.phone" 
            class="form-control"
          >
        </div>
        <div class="form-group">
          <label for="role_id">角色</label>
          <input 
            type="text" 
            id="role_id" 
            :value="roleName" 
            class="form-control" 
            disabled
          >
        </div>
        <div class="form-group">
          <label for="status">状态</label>
          <input 
            type="text" 
            id="status" 
            :value="form.status === 'active' ? '活跃' : '禁用'" 
            class="form-control" 
            disabled
          >
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? '更新中...' : '更新信息' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useAdminStore } from '../../store';
import { adminApi } from '../../services/admin';

export default {
  name: 'AdminProfile',
  setup() {
    const adminStore = useAdminStore();
    const loading = ref(false);
    const form = ref({
      username: '',
      real_name: '',
      phone: '',
      role_id: '',
      status: ''
    });
    
    // 角色名称
    const roleName = computed(() => {
      const roleMap = {
        1: '超级管理员',
        2: '操作员'
      };
      return roleMap[form.value.role_id] || '未知角色';
    });
    
    // 获取管理员信息
    const getProfile = async () => {
      try {
        const response = await adminApi.getProfile();
        if (response.success) {
          form.value = response.data;
        }
      } catch (error) {
        console.error('获取管理员信息失败:', error);
      }
    };
    
    // 更新管理员信息
    const handleUpdate = async () => {
      loading.value = true;
      try {
        const response = await adminApi.updateProfile({
          real_name: form.value.real_name,
          phone: form.value.phone
        });
        if (response.success) {
          // 更新成功
          adminStore.getProfile();
          alert('更新成功');
        }
      } catch (error) {
        console.error('更新管理员信息失败:', error);
        alert('更新失败，请重试');
      } finally {
        loading.value = false;
      }
    };
    
    onMounted(() => {
      getProfile();
    });
    
    return {
      form,
      loading,
      roleName,
      handleUpdate
    };
  }
};
</script>

<style scoped>
.profile {
  padding: var(--spacing-md);
}

.profile h2 {
  margin-bottom: var(--spacing-lg);
  color: var(--text-color);
}

.profile-card {
  background-color: var(--white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-lg);
}

.profile-card h3 {
  margin-bottom: var(--spacing-md);
  color: var(--text-color);
  font-size: var(--font-size-lg);
}

.form-group {
  margin-bottom: var(--spacing-md);
}

label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
  color: var(--text-color);
}

.form-control {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-md);
  transition: border-color var(--transition-fast);
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.form-control:disabled {
  background-color: var(--background-color);
  cursor: not-allowed;
}

.form-actions {
  margin-top: var(--spacing-lg);
  text-align: right;
}

@media (max-width: 768px) {
  .profile-card {
    padding: var(--spacing-md);
  }
  
  .form-actions {
    text-align: center;
  }
}
</style>