<template>
  <div class="login-container">
    <div class="login-card">
      <h2>用户登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="phone">手机号</label>
          <input 
            type="text" 
            id="phone" 
            v-model="form.phone" 
            placeholder="请输入手机号"
            class="form-control"
          >
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input 
            type="password" 
            id="password" 
            v-model="form.password" 
            placeholder="请输入密码"
            class="form-control"
          >
        </div>
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
        <div class="login-footer">
          <router-link to="/user/register" class="register-link">注册新账号</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../store';

export default {
  name: 'UserLogin',
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    
    const form = ref({
      phone: '',
      password: ''
    });
    
    const loading = ref(false);
    const error = ref('');
    
    const handleLogin = async () => {
      if (!form.value.phone || !form.value.password) {
        error.value = '请输入手机号和密码';
        return;
      }
      
      loading.value = true;
      error.value = '';
      
      try {
        await userStore.login(form.value);
        router.push('/user/home');
      } catch (err) {
        error.value = err.message || '登录失败，请重试';
      } finally {
        loading.value = false;
      }
    };
    
    return {
      form,
      loading,
      error,
      handleLogin
    };
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--background-color);
}

.login-card {
  background-color: var(--white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-xl);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  margin-bottom: var(--spacing-lg);
  color: var(--text-color);
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

.btn-block {
  width: 100%;
  margin-top: var(--spacing-lg);
  padding: var(--spacing-sm) 0;
}

.error-message {
  color: var(--error-color);
  font-size: var(--font-size-sm);
  margin: var(--spacing-sm) 0;
}

.login-footer {
  margin-top: var(--spacing-md);
  text-align: center;
}

.register-link {
  color: var(--primary-color);
  text-decoration: none;
  font-size: var(--font-size-sm);
}

.register-link:hover {
  text-decoration: underline;
}
</style>