<template>
  <div class="adoption-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>认养订单</h2>
        </div>
      </template>
      
      <!-- 筛选条件 -->
      <el-card class="filter-card" shadow="hover">
        <template #header>
          <div class="filter-header">
            <span>筛选条件</span>
            <el-button type="text" @click="toggleFilter">
              {{ filterVisible ? '收起' : '展开' }}
              <el-icon class="collapse-icon">
                <component :is="filterVisible ? 'ArrowUp' : 'ArrowDown'" />
              </el-icon>
            </el-button>
          </div>
        </template>
        <div v-show="filterVisible">
          <el-form :model="filterForm" label-width="100px">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="订单状态">
                  <el-select v-model="filterForm.status" placeholder="选择状态" style="width: 100%">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="未支付" value="unpaid"></el-option>
                    <el-option label="已支付" value="paid"></el-option>
                    <el-option label="已取消" value="canceled"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="用户ID">
                  <el-input v-model="filterForm.user_id" placeholder="输入用户ID" style="width: 100%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="树木ID">
                  <el-input v-model="filterForm.tree_id" placeholder="输入树木ID" style="width: 100%"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-top: 20px;">
              <el-col :span="24">
                <el-form-item label="操作">
                  <div class="filter-buttons">
                    <el-button type="primary" @click="handleFilter">查询</el-button>
                    <el-button @click="resetFilter">重置</el-button>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>
      
      <!-- 订单列表 -->
      <el-table :data="adoptions" style="width: 100%" border>
        <el-table-column prop="id" label="订单ID" width="100"></el-table-column>
        <el-table-column prop="userNickname" label="用户昵称" width="120"></el-table-column>
        <el-table-column prop="userPhone" label="用户电话" width="150"></el-table-column>
        <el-table-column prop="treeNo" label="树木编号" width="120"></el-table-column>
        <el-table-column prop="treeVariety" label="树木品种" width="120"></el-table-column>
        <el-table-column prop="years" label="认养年限" width="100"></el-table-column>
        <el-table-column prop="totalPrice" label="总金额" width="100">
          <template #default="scope">
            {{ scope.row.totalPrice }} 元
          </template>
        </el-table-column>
        <el-table-column prop="status" label="订单状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180"></el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" type="primary" @click="viewDetail(scope.row.id)">查看详情</el-button>
            <el-button size="small" type="warning" @click="editStatus(scope.row)">修改状态</el-button>
            <el-button size="small" type="danger" @click="deleteAdoption(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagination.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
        ></el-pagination>
      </div>
    </el-card>
    
    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="订单详情"
      width="700px"
    >
      <div v-if="currentAdoption" class="adoption-detail">
        <el-row :gutter="20">
          <el-col :span="12">
            <h3>订单信息</h3>
            <el-descriptions :column="1" border>
              <el-descriptions-item label="订单ID">{{ currentAdoption.id }}</el-descriptions-item>
              <el-descriptions-item label="协议编号">{{ currentAdoption.agreement_no }}</el-descriptions-item>
              <el-descriptions-item label="认养年限">{{ currentAdoption.adopt_years }} 年</el-descriptions-item>
              <el-descriptions-item label="总金额">{{ currentAdoption.total_amount }} 元</el-descriptions-item>
              <el-descriptions-item label="支付状态">
                <el-tag :type="getStatusType(currentAdoption.pay_status)">
                  {{ getStatusText(currentAdoption.pay_status) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="认养开始日期">{{ currentAdoption.start_date }}</el-descriptions-item>
              <el-descriptions-item label="认养结束日期">{{ currentAdoption.end_date }}</el-descriptions-item>
              <el-descriptions-item label="创建时间">{{ currentAdoption.created_at }}</el-descriptions-item>
            </el-descriptions>
          </el-col>
          <el-col :span="12">
            <h3>用户信息</h3>
            <el-descriptions :column="1" border>
              <el-descriptions-item label="用户ID">{{ currentAdoption.user_info?.id }}</el-descriptions-item>
              <el-descriptions-item label="用户昵称">{{ currentAdoption.user_info?.nickname }}</el-descriptions-item>
              <el-descriptions-item label="联系电话">{{ currentAdoption.user_info?.phone }}</el-descriptions-item>
              <el-descriptions-item label="邮箱">{{ currentAdoption.user_info?.email }}</el-descriptions-item>
            </el-descriptions>
            <h3 style="margin-top: 20px;">树木信息</h3>
            <el-descriptions :column="1" border>
              <el-descriptions-item label="树木ID">{{ currentAdoption.tree_info?.id }}</el-descriptions-item>
              <el-descriptions-item label="树木编号">{{ currentAdoption.tree_info?.tree_no }}</el-descriptions-item>
              <el-descriptions-item label="树木品种">{{ currentAdoption.tree_info?.variety }}</el-descriptions-item>
              <el-descriptions-item label="树木年龄">{{ currentAdoption.tree_info?.age }} 年</el-descriptions-item>
              <el-descriptions-item label="种植位置">{{ currentAdoption.tree_info?.location }}</el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>
        <div v-if="currentAdoption.logistics_info" style="margin-top: 20px;">
          <h3>物流信息</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="物流单号">{{ currentAdoption.logistics_info.tracking_number }}</el-descriptions-item>
            <el-descriptions-item label="物流公司">{{ currentAdoption.logistics_info.carrier }}</el-descriptions-item>
            <el-descriptions-item label="收货地址">{{ currentAdoption.logistics_info.address }}</el-descriptions-item>
            <el-descriptions-item label="收货人">{{ currentAdoption.logistics_info.recipient }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ currentAdoption.logistics_info.phone }}</el-descriptions-item>
            <el-descriptions-item label="发货时间">{{ currentAdoption.logistics_info.created_at }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 状态编辑对话框 -->
    <el-dialog
      v-model="statusDialogVisible"
      title="修改订单状态"
      width="400px"
    >
      <el-form :model="statusForm" :rules="statusRules" ref="statusFormRef" label-width="80px">
        <el-form-item label="订单状态" prop="status">
          <el-select v-model="statusForm.status" placeholder="选择状态">
            <el-option label="未支付" value="unpaid"></el-option>
            <el-option label="已支付" value="paid"></el-option>
            <el-option label="已取消" value="canceled"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="statusDialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="loading" @click="saveStatus">
            {{ loading ? '保存中...' : '保存' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue';
import { adminApi } from '../../services/admin';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue';

export default {
  name: 'AdoptionManagement',
  setup() {
    const adoptions = ref([]);
    const loading = ref(false);
    const detailDialogVisible = ref(false);
    const statusDialogVisible = ref(false);
    const currentAdoption = ref(null);
    const currentAdoptionId = ref(null);
    const statusFormRef = ref(null);
    const filterVisible = ref(true);
    
    const filterForm = reactive({
      status: '',
      user_id: '',
      tree_id: ''
    });
    
    const statusForm = reactive({
      status: ''
    });
    
    const statusRules = {
      status: [
        { required: true, message: '请选择订单状态', trigger: 'change' }
      ]
    };
    
    const pagination = reactive({
      page: 1,
      limit: 10,
      total: 0
    });
    
    // 获取订单列表
    const getAdoptions = async () => {
      try {
        loading.value = true;
        const params = {
          page: pagination.page,
          limit: pagination.limit,
          status: filterForm.status,
          user_id: filterForm.user_id,
          tree_id: filterForm.tree_id
        };
        const response = await adminApi.getAdoptions(params);
        if (response.success) {
          adoptions.value = response.data;
          pagination.total = response.pagination.total;
        }
      } catch (error) {
        console.error('获取订单列表失败:', error);
        ElMessage.error('获取订单列表失败');
      } finally {
        loading.value = false;
      }
    };
    
    // 查看详情
    const viewDetail = async (id) => {
      try {
        loading.value = true;
        const response = await adminApi.getAdoptionById(id);
        if (response.success) {
          currentAdoption.value = response.data;
          detailDialogVisible.value = true;
        }
      } catch (error) {
        console.error('获取订单详情失败:', error);
        ElMessage.error('获取订单详情失败');
      } finally {
        loading.value = false;
      }
    };
    
    // 编辑状态
    const editStatus = (adoption) => {
      currentAdoptionId.value = adoption.id;
      statusForm.status = adoption.status;
      statusDialogVisible.value = true;
    };
    
    // 保存状态
    const saveStatus = async () => {
      if (!statusFormRef.value) return;
      
      try {
        await statusFormRef.value.validate();
        loading.value = true;
        const response = await adminApi.updateAdoptionStatus(currentAdoptionId.value, {
          status: statusForm.status
        });
        if (response.success) {
          getAdoptions();
          statusDialogVisible.value = false;
          ElMessage.success('状态更新成功');
        }
      } catch (error) {
        console.error('更新状态失败:', error);
        ElMessage.error('更新状态失败');
      } finally {
        loading.value = false;
      }
    };
    
    // 删除订单
    const deleteAdoption = async (id) => {
      try {
        await ElMessageBox.confirm('确定要删除这个订单吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        
        loading.value = true;
        const response = await adminApi.deleteAdoption(id);
        if (response.success) {
          getAdoptions();
          ElMessage.success('删除成功');
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除订单失败:', error);
          ElMessage.error('删除订单失败');
        }
      } finally {
        loading.value = false;
      }
    };
    
    // 处理筛选
    const handleFilter = () => {
      pagination.page = 1;
      getAdoptions();
    };
    
    // 重置筛选
    const resetFilter = () => {
      filterForm.status = '';
      filterForm.user_id = '';
      filterForm.tree_id = '';
      pagination.page = 1;
      getAdoptions();
    };
    
    // 切换筛选面板
    const toggleFilter = () => {
      filterVisible.value = !filterVisible.value;
    };
    
    // 处理页码变化
    const handleSizeChange = (size) => {
      pagination.limit = size;
      getAdoptions();
    };
    
    // 处理页数变化
    const handleCurrentChange = (current) => {
      pagination.page = current;
      getAdoptions();
    };
    
    // 获取状态类型
    const getStatusType = (status) => {
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
    
    // 获取状态文本
    const getStatusText = (status) => {
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
    
    onMounted(() => {
      getAdoptions();
    });
    
    return {
      adoptions,
      loading,
      detailDialogVisible,
      statusDialogVisible,
      currentAdoption,
      filterForm,
      statusForm,
      statusRules,
      statusFormRef,
      pagination,
      filterVisible,
      getAdoptions,
      viewDetail,
      editStatus,
      saveStatus,
      deleteAdoption,
      handleFilter,
      resetFilter,
      toggleFilter,
      handleSizeChange,
      handleCurrentChange,
      getStatusType,
      getStatusText
    };
  }
};
</script>

<style scoped>
.adoption-management {
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

.filter-card {
  margin-bottom: var(--spacing-md);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.collapse-icon {
  transition: transform 0.3s;
}

.filter-buttons {
  display: flex;
  gap: var(--spacing-sm);
}

.pagination {
  margin-top: var(--spacing-md);
  display: flex;
  justify-content: flex-end;
}

.adoption-detail {
  line-height: 1.6;
}

.adoption-detail h3 {
  margin-bottom: var(--spacing-sm);
  color: var(--text-color);
  font-size: var(--font-size-md);
}

.dialog-footer {
  text-align: right;
}
</style>
