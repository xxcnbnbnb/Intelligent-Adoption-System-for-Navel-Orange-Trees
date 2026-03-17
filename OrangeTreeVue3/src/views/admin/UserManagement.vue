<template>
  <div class="user-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>用户管理</h2>
        </div>
      </template>
      
      <!-- 筛选条件 -->
      <div class="filter-section">
        <el-form :model="filterForm" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="手机号">
                <el-input v-model="filterForm.phone" placeholder="输入手机号" style="width: 100%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="昵称">
                <el-input v-model="filterForm.nickname" placeholder="输入昵称" style="width: 100%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="状态">
                <el-select v-model="filterForm.status" placeholder="选择状态" style="width: 100%">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="正常" value="active"></el-option>
                  <el-option label="禁用" value="disabled"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="text-right">
              <el-button type="primary" @click="handleFilter">查询</el-button>
              <el-button @click="resetFilter">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      
      <!-- 用户列表 -->
      <el-table :data="users" style="width: 100%" border>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="phone" label="手机号" width="150"></el-table-column>
        <el-table-column prop="nickname" label="昵称" width="150"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="vip_remark" label="大客户备注" width="200"></el-table-column>
        <el-table-column prop="created_at" label="注册时间" width="180"></el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="scope">
            <el-button size="small" type="primary" @click="viewDetail(scope.row.id)">查看详情</el-button>
            <el-button size="small" type="warning" @click="editUser(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteUser(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.limit"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="用户详情"
      width="900px"
    >
      <div v-if="currentUser" class="user-detail">
        <el-row :gutter="20">
          <el-col :span="12">
            <h3>基本信息</h3>
            <el-descriptions :column="1" border>
              <el-descriptions-item label="用户ID">{{ currentUser.id }}</el-descriptions-item>
              <el-descriptions-item label="手机号">{{ currentUser.phone }}</el-descriptions-item>
              <el-descriptions-item label="昵称">{{ currentUser.nickname }}</el-descriptions-item>
              <el-descriptions-item label="状态">
                <el-tag :type="getStatusType(currentUser.status)">
                  {{ getStatusText(currentUser.status) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="注册时间">{{ currentUser.created_at }}</el-descriptions-item>
              <el-descriptions-item label="大客户备注">{{ currentUser.vip_remark || '无' }}</el-descriptions-item>
            </el-descriptions>
          </el-col>
          <el-col :span="12">
            <h3>认养订单</h3>
            <el-table :data="currentUser.adoptions || []" style="width: 100%" border size="small">
              <el-table-column prop="id" label="订单ID" width="80"></el-table-column>
              <el-table-column prop="tree_no" label="树木编号" width="120"></el-table-column>
              <el-table-column prop="variety" label="品种" width="100"></el-table-column>
              <el-table-column prop="years" label="认养年限" width="100"></el-table-column>
              <el-table-column prop="total_amount" label="总金额" width="100">
                <template #default="scope">
                  {{ scope.row.total_amount }} 元
                </template>
              </el-table-column>
              <el-table-column prop="pay_status" label="支付状态" width="100">
                <template #default="scope">
                  <el-tag :type="getPaymentStatusType(scope.row.pay_status)">
                    {{ getPaymentStatusText(scope.row.pay_status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="created_at" label="创建时间" width="180"></el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <h3>认养果树</h3>
            <el-table :data="currentUser.trees || []" style="width: 100%" border size="small">
              <el-table-column prop="id" label="树木ID" width="80"></el-table-column>
              <el-table-column prop="tree_no" label="树木编号" width="120"></el-table-column>
              <el-table-column prop="variety" label="品种" width="100"></el-table-column>
              <el-table-column prop="age" label="树龄" width="80"></el-table-column>
              <el-table-column prop="location" label="位置" width="150"></el-table-column>
              <el-table-column prop="price" label="认养费用" width="100">
                <template #default="scope">
                  {{ scope.row.price }} 元/年
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="100">
                <template #default="scope">
                  <el-tag :type="getTreeStatusType(scope.row.status)">
                    {{ getTreeStatusText(scope.row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="created_at" label="创建时间" width="180"></el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 编辑对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="editDialogTitle"
      width="600px"
    >
      <el-form :model="userForm" :rules="userRules" ref="userFormRef" label-width="100px">
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="userForm.nickname" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="userForm.status" placeholder="请选择状态">
            <el-option label="正常" value="active"></el-option>
            <el-option label="禁用" value="disabled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="大客户备注" prop="vip_remark">
          <el-input
            v-model="userForm.vip_remark"
            type="textarea"
            :rows="4"
            placeholder="请输入大客户备注，便于后续服务和营销"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="loading" @click="saveUser">
            {{ loading ? '保存中...' : '保存' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { adminApi } from '../../services/admin';
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
  name: 'UserManagement',
  setup() {
    const users = ref([]);
    const loading = ref(false);
    const detailDialogVisible = ref(false);
    const editDialogVisible = ref(false);
    const editDialogTitle = ref('编辑用户');
    const currentUser = ref(null);
    const userFormRef = ref(null);
    
    const filterForm = reactive({
      phone: '',
      nickname: '',
      status: ''
    });
    
    const pagination = reactive({
      page: 1,
      limit: 10,
      total: 0
    });
    
    const userForm = reactive({
      id: '',
      nickname: '',
      status: 'active',
      vip_remark: ''
    });
    
    const userRules = {
      nickname: [
        { required: true, message: '请输入昵称', trigger: 'blur' }
      ],
      status: [
        { required: true, message: '请选择状态', trigger: 'change' }
      ]
    };
    
    const fetchUsers = async () => {
      try {
        loading.value = true;
        const params = {
          page: pagination.page,
          limit: pagination.limit,
          ...filterForm
        };
        
        const response = await adminApi.getUsers(params);
        if (response.success) {
          users.value = response.data;
          pagination.total = response.pagination?.total || 0;
        }
      } catch (error) {
        console.error('获取用户列表失败:', error);
        ElMessage.error('获取用户列表失败');
      } finally {
        loading.value = false;
      }
    };
    
    const viewDetail = async (userId) => {
      try {
        loading.value = true;
        const response = await adminApi.getUserById(userId);
        if (response.success) {
          currentUser.value = response.data;
          detailDialogVisible.value = true;
        }
      } catch (error) {
        console.error('获取用户详情失败:', error);
        ElMessage.error('获取用户详情失败');
      } finally {
        loading.value = false;
      }
    };
    
    const editUser = (user) => {
      editDialogTitle.value = '编辑用户';
      Object.assign(userForm, {
        id: user.id,
        nickname: user.nickname,
        status: user.status,
        vip_remark: user.vip_remark || ''
      });
      editDialogVisible.value = true;
    };
    
    const saveUser = async () => {
      if (!userFormRef.value) return;
      
      try {
        await userFormRef.value.validate();
        loading.value = true;
        const response = await adminApi.updateUser(userForm.id, {
          nickname: userForm.nickname,
          status: userForm.status,
          vip_remark: userForm.vip_remark
        });
        
        if (response.success) {
          ElMessage.success('用户更新成功');
          editDialogVisible.value = false;
          fetchUsers();
        } else {
          ElMessage.error(response.message);
        }
      } catch (error) {
        console.error('更新用户失败:', error);
        ElMessage.error('更新用户失败');
      } finally {
        loading.value = false;
      }
    };
    
    const deleteUser = async (userId) => {
      try {
        await ElMessageBox.confirm('确定要删除这个用户吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        
        loading.value = true;
        const response = await adminApi.deleteUser(userId);
        if (response.success) {
          ElMessage.success('删除成功');
          fetchUsers();
        } else {
          ElMessage.error(response.message);
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除用户失败:', error);
          ElMessage.error('删除用户失败');
        }
      } finally {
        loading.value = false;
      }
    };
    
    const handleFilter = () => {
      pagination.page = 1;
      fetchUsers();
    };
    
    const resetFilter = () => {
      filterForm.phone = '';
      filterForm.nickname = '';
      filterForm.status = '';
      pagination.page = 1;
      fetchUsers();
    };
    
    const handleSizeChange = async (size) => {
      pagination.limit = size;
      await fetchUsers();
    };
    
    const handleCurrentChange = async (current) => {
      pagination.page = current;
      await fetchUsers();
    };
    
    const getStatusType = (status) => {
      switch (status) {
        case 'active':
          return 'success';
        case 'disabled':
          return 'danger';
        default:
          return 'info';
      }
    };
    
    const getStatusText = (status) => {
      switch (status) {
        case 'active':
          return '正常';
        case 'disabled':
          return '禁用';
        default:
          return status;
      }
    };
    
    const getPaymentStatusType = (status) => {
      switch (status) {
        case 'unpaid':
          return 'warning';
        case 'paid':
          return 'success';
        case 'canceled':
          return 'danger';
        default:
          return 'info';
      }
    };
    
    const getPaymentStatusText = (status) => {
      switch (status) {
        case 'unpaid':
          return '未支付';
        case 'paid':
          return '已支付';
        case 'canceled':
          return '已取消';
        default:
          return status;
      }
    };
    
    const getTreeStatusType = (status) => {
      switch (status) {
        case 'available':
          return 'success';
        case 'adopted':
          return 'info';
        case 'maintaining':
          return 'warning';
        default:
          return 'info';
      }
    };
    
    const getTreeStatusText = (status) => {
      switch (status) {
        case 'available':
          return '可认养';
        case 'adopted':
          return '已认养';
        case 'maintaining':
          return '维护中';
        default:
          return status;
      }
    };
    
    onMounted(() => {
      fetchUsers();
    });
    
    return {
      users,
      loading,
      detailDialogVisible,
      editDialogVisible,
      editDialogTitle,
      currentUser,
      filterForm,
      pagination,
      userForm,
      userRules,
      userFormRef,
      fetchUsers,
      viewDetail,
      editUser,
      saveUser,
      deleteUser,
      handleFilter,
      resetFilter,
      handleSizeChange,
      handleCurrentChange,
      getStatusType,
      getStatusText,
      getPaymentStatusType,
      getPaymentStatusText,
      getTreeStatusType,
      getTreeStatusText
    };
  }
};
</script>

<style scoped lang="scss">
.user-management {
  padding: var(--spacing-md);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-section {
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: var(--background-color);
  border-radius: var(--border-radius-md);
}

.pagination {
  margin-top: var(--spacing-md);
  display: flex;
  justify-content: flex-end;
}

.user-detail {
  line-height: 1.6;
}

.user-detail h3 {
  margin-bottom: var(--spacing-sm);
  color: var(--text-color);
  font-size: var(--font-size-md);
}

.dialog-footer {
  text-align: right;
}
</style>
