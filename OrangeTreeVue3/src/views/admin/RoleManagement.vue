<template>
  <div class="role-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>角色管理</h2>
          <el-button type="primary" @click="openAddRoleDialog">添加角色</el-button>
        </div>
      </template>
      
      <div class="role-list">
        <div v-for="role in roles" :key="role.id" class="role-card">
          <div class="role-header">
            <h3>{{ role.role_name }}</h3>
            <div class="role-actions">
              <el-button size="small" type="primary" @click="editRole(role)">编辑</el-button>
              <el-button size="small" type="danger" @click="deleteRole(role.id)">删除</el-button>
            </div>
          </div>
          <div class="role-permissions">
            <h4>权限</h4>
            <div class="permissions-grid">
              <div v-for="(actions, module) in role.permissions" :key="module" class="permission-item">
                <span class="permission-module">{{ module }}</span>
                <span class="permission-actions">{{ actions.join(', ') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
    
    <!-- 添加/编辑角色对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
    >
      <el-form :model="roleForm" :rules="roleRules" ref="roleFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="role_name">
          <el-input v-model="roleForm.role_name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="权限">
          <div class="permissions-checkboxes">
            <div class="permission-group">
              <h4>用户管理</h4>
              <el-checkbox-group v-model="roleForm.permissions.user">
                <el-checkbox label="read">查看</el-checkbox>
                <el-checkbox label="write">编辑</el-checkbox>
                <el-checkbox label="delete">删除</el-checkbox>
              </el-checkbox-group>
            </div>
            <div class="permission-group">
              <h4>树木管理</h4>
              <el-checkbox-group v-model="roleForm.permissions.tree">
                <el-checkbox label="read">查看</el-checkbox>
                <el-checkbox label="write">编辑</el-checkbox>
                <el-checkbox label="delete">删除</el-checkbox>
              </el-checkbox-group>
            </div>
            <div class="permission-group">
              <h4>认养管理</h4>
              <el-checkbox-group v-model="roleForm.permissions.adoption">
                <el-checkbox label="read">查看</el-checkbox>
                <el-checkbox label="write">编辑</el-checkbox>
                <el-checkbox label="delete">删除</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelRole">取消</el-button>
          <el-button type="primary" :loading="loading" @click="saveRole">
            {{ loading ? '保存中...' : '保存' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { adminApi } from '../../services/admin';
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
  name: 'RoleManagement',
  setup() {
    const roles = ref([]);
    const loading = ref(false);
    const dialogVisible = ref(false);
    const dialogTitle = ref('添加角色');
    const currentRoleId = ref(null);
    const roleFormRef = ref(null);
    const roleForm = ref({
      role_name: '',
      permissions: {
        user: [],
        tree: [],
        adoption: []
      }
    });
    
    const roleRules = {
      role_name: [
        { required: true, message: '请输入角色名称', trigger: 'blur' }
      ]
    };
    
    // 获取角色列表
    const getRoles = async () => {
      try {
        const response = await adminApi.getRoles();
        if (response.success) {
          roles.value = response.data;
        }
      } catch (error) {
        console.error('获取角色列表失败:', error);
        ElMessage.error('获取角色列表失败');
      }
    };
    
    // 打开添加角色对话框
    const openAddRoleDialog = () => {
      roleForm.value = {
        role_name: '',
        permissions: {
          user: [],
          tree: [],
          adoption: []
        }
      };
      currentRoleId.value = null;
      dialogTitle.value = '添加角色';
      dialogVisible.value = true;
    };
    
    // 编辑角色
    const editRole = (role) => {
      roleForm.value = {
        role_name: role.role_name,
        permissions: { ...role.permissions }
      };
      currentRoleId.value = role.id;
      dialogTitle.value = '编辑角色';
      dialogVisible.value = true;
    };
    
    // 保存角色
    const saveRole = async () => {
      if (!roleFormRef.value) return;
      
      try {
        await roleFormRef.value.validate();
        loading.value = true;
        let response;
        if (currentRoleId.value) {
          // 更新角色
          response = await adminApi.updateRole(currentRoleId.value, roleForm.value);
        } else {
          // 创建角色
          response = await adminApi.createRole(roleForm.value);
        }
        if (response.success) {
          getRoles();
          cancelRole();
          ElMessage.success('保存成功');
        }
      } catch (error) {
        console.error('保存角色失败:', error);
        ElMessage.error('保存失败，请重试');
      } finally {
        loading.value = false;
      }
    };
    
    // 取消编辑
    const cancelRole = () => {
      dialogVisible.value = false;
      currentRoleId.value = null;
    };
    
    // 删除角色
    const deleteRole = async (id) => {
      try {
        await ElMessageBox.confirm('确定要删除这个角色吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        
        const response = await adminApi.deleteRole(id);
        if (response.success) {
          getRoles();
          ElMessage.success('删除成功');
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除角色失败:', error);
          ElMessage.error('删除失败，请重试');
        }
      }
    };
    
    onMounted(() => {
      getRoles();
    });
    
    return {
      roles,
      loading,
      dialogVisible,
      dialogTitle,
      roleForm,
      roleRules,
      roleFormRef,
      openAddRoleDialog,
      editRole,
      saveRole,
      cancelRole,
      deleteRole
    };
  }
};
</script>

<style scoped>
.role-management {
  padding: var(--spacing-md);
}

.role-management h2 {
  margin-bottom: var(--spacing-lg);
  color: var(--text-color);
}

.role-actions {
  margin-bottom: var(--spacing-lg);
}

.role-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--spacing-md);
}

.role-card {
  background-color: var(--white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-md);
}

.role-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--border-color);
}

.role-header h3 {
  margin: 0;
  color: var(--text-color);
}

.role-permissions h4 {
  margin-bottom: var(--spacing-sm);
  color: var(--text-color);
  font-size: var(--font-size-md);
}

.permissions-grid {
  display: grid;
  gap: var(--spacing-sm);
}

.permission-item {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-sm);
  background-color: var(--background-color);
  border-radius: var(--border-radius-sm);
}

.permission-module {
  font-weight: 500;
  color: var(--text-color);
}

.permission-actions {
  color: var(--text-light);
  font-size: var(--font-size-sm);
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-content {
  background-color: var(--white);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  width: 100%;
  max-width: 500px;
  box-shadow: var(--shadow-lg);
}

.dialog-content h3 {
  margin-bottom: var(--spacing-md);
  color: var(--text-color);
}

.permissions-checkboxes {
  display: grid;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.permission-group h4 {
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-md);
  color: var(--text-color);
}

.permission-group label {
  display: inline-block;
  margin-right: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-sm);
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

@media (max-width: 768px) {
  .role-list {
    grid-template-columns: 1fr;
  }
  
  .dialog-content {
    margin: var(--spacing-md);
    max-width: none;
  }
  
  .role-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .role-actions {
    display: flex;
    gap: var(--spacing-sm);
  }
}
</style>