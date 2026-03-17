<template>
  <div class="profile-container">
    <el-card>
      <template #header>
        <h2>个人中心</h2>
      </template>
      
      <div class="profile-content">
        <div class="profile-info">
          <div class="avatar-section">
            <el-avatar :size="120" :src="userInfo.avatar || '/src/assets/vue.svg'">
              {{ userInfo.nickname?.charAt(0) || 'U' }}
            </el-avatar>
            <h3>{{ userInfo.nickname }}</h3>
            <p>{{ userInfo.phone }}</p>
          </div>
          
          <el-descriptions :column="1" border class="info-details">
            <el-descriptions-item label="用户ID">{{ userInfo.id }}</el-descriptions-item>
            <el-descriptions-item label="注册时间">{{ formatDate(userInfo.createdAt) }}</el-descriptions-item>
            <el-descriptions-item label="最后登录">{{ formatDate(userInfo.lastLogin) }}</el-descriptions-item>
            <el-descriptions-item label="认养数量">{{ adoptionCount }}</el-descriptions-item>
          </el-descriptions>
        </div>
        
        <div class="profile-actions">
          <el-button type="primary" @click="openEditDialog">编辑资料</el-button>
          <el-button type="warning" @click="changePassword">修改密码</el-button>
        </div>
      </div>
    </el-card>
    
    <!-- 编辑资料对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑资料"
      width="500px"
    >
      <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="80px">
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="editForm.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-change="handleAvatarChange"
            :auto-upload="false"
          >
            <img v-if="editForm.avatar" :src="editForm.avatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitEdit">保存修改</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 修改密码对话框 -->
    <el-dialog
      v-model="passwordDialogVisible"
      title="修改密码"
      width="500px"
    >
      <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="80px">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" type="password" placeholder="请输入原密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" placeholder="请确认新密码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="passwordDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitPassword">确认修改</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue';
import { useUserStore } from '../../store/user';
import { userApi } from '../../services/user';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';

export default {
  name: 'Profile',
  setup() {
    const userStore = useUserStore();
    const editFormRef = ref(null);
    const passwordFormRef = ref(null);
    
    const editDialogVisible = ref(false);
    const passwordDialogVisible = ref(false);
    const adoptionCount = ref(0);
    
    const userInfo = reactive({
      id: '',
      nickname: '',
      phone: '',
      avatar: '',
      createdAt: '',
      lastLogin: ''
    });
    
    const editForm = reactive({
      nickname: '',
      phone: '',
      avatar: ''
    });
    
    const passwordForm = reactive({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    const editRules = {
      nickname: [
        { required: true, message: '请输入昵称', trigger: 'blur' }
      ],
      phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
      ]
    };
    
    const passwordRules = {
      oldPassword: [
        { required: true, message: '请输入原密码', trigger: 'blur' }
      ],
      newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '请确认密码', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (value !== passwordForm.newPassword) {
              callback(new Error('两次输入密码不一致'));
            } else {
              callback();
            }
          },
          trigger: 'blur'
        }
      ]
    };
    
    const fetchUserProfile = async () => {
      try {
        await userStore.getProfile();
        const profile = userStore.userInfo;
        if (profile) {
          Object.assign(userInfo, profile);
          Object.assign(editForm, profile);
        }
        
        // 获取认养数量
        const response = await userApi.getUserAdoptions({ limit: 1 });
        if (response.success) {
          adoptionCount.value = response.pagination?.total || 0;
        }
      } catch (error) {
        ElMessage.error('获取个人资料失败');
        console.error('获取个人资料失败:', error);
      }
    };
    
    const formatDate = (dateString) => {
      if (!dateString) return '-';
      const date = new Date(dateString);
      return date.toLocaleString();
    };
    
    const openEditDialog = () => {
      editDialogVisible.value = true;
    };
    
    const changePassword = () => {
      passwordDialogVisible.value = true;
    };
    
    const handleAvatarChange = (file) => {
      // 这里可以实现文件上传逻辑
      // 暂时使用本地文件预览
      const reader = new FileReader();
      reader.onload = (e) => {
        editForm.avatar = e.target.result;
      };
      reader.readAsDataURL(file.raw);
    };
    
    const submitEdit = async () => {
      if (!editFormRef.value) return;
      
      try {
        await editFormRef.value.validate();
        const response = await userApi.updateProfile(editForm);
        if (response.success) {
          ElMessage.success('资料更新成功');
          editDialogVisible.value = false;
          fetchUserProfile();
        } else {
          ElMessage.error(response.message);
        }
      } catch (error) {
        ElMessage.error('更新失败，请重试');
        console.error('更新资料失败:', error);
      }
    };
    
    const submitPassword = async () => {
      if (!passwordFormRef.value) return;
      
      try {
        await passwordFormRef.value.validate();
        const response = await userApi.updatePassword(passwordForm);
        if (response.success) {
          ElMessage.success('密码修改成功');
          passwordDialogVisible.value = false;
          // 重置表单
          passwordForm.oldPassword = '';
          passwordForm.newPassword = '';
          passwordForm.confirmPassword = '';
        } else {
          ElMessage.error(response.message);
        }
      } catch (error) {
        ElMessage.error('修改失败，请重试');
        console.error('修改密码失败:', error);
      }
    };
    
    onMounted(() => {
      fetchUserProfile();
    });
    
    return {
      userInfo,
      editForm,
      passwordForm,
      editDialogVisible,
      passwordDialogVisible,
      adoptionCount,
      editRules,
      passwordRules,
      editFormRef,
      passwordFormRef,
      formatDate,
      openEditDialog,
      changePassword,
      handleAvatarChange,
      submitEdit,
      submitPassword
    };
  }
};
</script>

<style scoped lang="scss">
.profile-container {
  padding: var(--spacing-lg);
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.profile-info {
  display: flex;
  gap: var(--spacing-xl);
  align-items: flex-start;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
  
  .avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
    
    h3 {
      margin: 0;
      color: var(--text-color);
    }
    
    p {
      margin: 0;
      color: var(--text-light);
    }
  }
  
  .info-details {
    flex: 1;
  }
}

.profile-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
}

.avatar-uploader {
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  
  .avatar-uploader-icon {
    width: 100px;
    height: 100px;
    line-height: 100px;
    font-size: 24px;
    color: var(--text-light);
    background-color: var(--background-color);
    border-radius: 50%;
  }
}
</style>