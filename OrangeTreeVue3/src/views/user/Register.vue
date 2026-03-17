<template>
  <div class="register-container">
    <div class="register-form-wrapper">
      <h2>用户注册</h2>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" type="password" placeholder="请确认密码" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="loading">注册</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
        <el-form-item>
          <span>已有账号？</span>
          <el-link type="primary" @click="goToLogin">立即登录</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { userApi } from '../../services/user';

export default {
  name: 'Register',
  setup() {
    const router = useRouter();
    const formRef = ref(null);
    const loading = ref(false);
    
    const form = reactive({
      phone: '',
      password: '',
      confirmPassword: '',
      nickname: ''
    });
    
    const rules = {
      phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '请确认密码', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (value !== form.password) {
              callback(new Error('两次输入密码不一致'));
            } else {
              callback();
            }
          },
          trigger: 'blur'
        }
      ],
      nickname: [
        { required: true, message: '请输入昵称', trigger: 'blur' }
      ]
    };
    
    const submitForm = async () => {
      if (!formRef.value) return;
      
      try {
        await formRef.value.validate();
        loading.value = true;
        
        const response = await userApi.register(form);
        if (response.success) {
          ElMessage.success('注册成功');
          router.push('/user/login');
        } else {
          ElMessage.error(response.message);
        }
      } catch (error) {
        ElMessage.error('注册失败，请重试');
        console.error('注册失败:', error);
      } finally {
        loading.value = false;
      }
    };
    
    const resetForm = () => {
      if (formRef.value) {
        formRef.value.resetFields();
      }
    };
    
    const goToLogin = () => {
      router.push('/user/login');
    };
    
    return {
      formRef,
      form,
      rules,
      loading,
      submitForm,
      resetForm,
      goToLogin
    };
  }
};
</script>

<style scoped lang="scss">
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--background-color);
}

.register-form-wrapper {
  background-color: var(--white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-xl);
  width: 100%;
  max-width: 400px;
  
  h2 {
    text-align: center;
    margin-bottom: var(--spacing-lg);
    color: var(--text-color);
  }
  
  .el-button {
    width: 100%;
    margin-bottom: var(--spacing-md);
  }
  
  .el-form-item:last-child {
    text-align: center;
    margin-top: var(--spacing-md);
  }
}
</style>