<template>
  <div class="logistics-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>物流管理</h2>
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
                <el-form-item label="物流状态">
                  <el-select v-model="filterForm.status" placeholder="选择状态" style="width: 100%">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="待发货" value="pending"></el-option>
                    <el-option label="已发货" value="shipped"></el-option>
                    <el-option label="已签收" value="received"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="订单ID">
                  <el-input v-model="filterForm.adoption_id" placeholder="输入订单ID" style="width: 100%"></el-input>
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
      
      <!-- 物流列表 -->
      <el-table :data="logisticsList" style="width: 100%" border>
        <el-table-column prop="id" label="物流ID" width="100"></el-table-column>
        <el-table-column prop="adopt_id" label="订单ID" width="100"></el-table-column>
        <el-table-column prop="harvest_batch" label="收获批次" width="120"></el-table-column>
        <el-table-column prop="product_amount" label="产品数量" width="100">
          <template #default="scope">
            {{ scope.row.product_amount ? scope.row.product_amount + ' 斤' : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="receiver_name" label="收货人" width="120"></el-table-column>
        <el-table-column prop="receiver_phone" label="联系电话" width="150"></el-table-column>
        <el-table-column prop="receiver_address" label="收货地址" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="logistics_company" label="物流公司" width="120"></el-table-column>
        <el-table-column prop="logistics_no" label="物流单号" width="150"></el-table-column>
        <el-table-column prop="status" label="物流状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180"></el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" type="primary" @click="viewDetail(scope.row.id)">查看详情</el-button>
            <el-button size="small" type="warning" @click="editLogistics(scope.row)" v-if="scope.row.status === 'pending'">编辑</el-button>
            <el-button size="small" type="success" @click="shipLogistics(scope.row)" v-if="scope.row.status === 'pending'">发货</el-button>
            <el-button size="small" type="danger" @click="deleteLogistics(scope.row.id)">删除</el-button>
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
      title="物流详情"
      width="700px"
    >
      <div v-if="currentLogistics" class="logistics-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="物流ID">{{ currentLogistics.id }}</el-descriptions-item>
          <el-descriptions-item label="订单ID">{{ currentLogistics.adopt_id }}</el-descriptions-item>
          <el-descriptions-item label="收获批次">{{ currentLogistics.harvest_batch || '-' }}</el-descriptions-item>
          <el-descriptions-item label="产品数量">{{ currentLogistics.product_amount ? currentLogistics.product_amount + ' 斤' : '-' }}</el-descriptions-item>
          <el-descriptions-item label="收货人">{{ currentLogistics.receiver_name }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ currentLogistics.receiver_phone }}</el-descriptions-item>
          <el-descriptions-item label="收货地址" :span="2">{{ currentLogistics.receiver_address }}</el-descriptions-item>
          <el-descriptions-item label="物流公司">{{ currentLogistics.logistics_company || '-' }}</el-descriptions-item>
          <el-descriptions-item label="物流单号">{{ currentLogistics.logistics_no || '-' }}</el-descriptions-item>
          <el-descriptions-item label="物流状态">
            <el-tag :type="getStatusType(currentLogistics.status)">
              {{ getStatusText(currentLogistics.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="发货时间">{{ currentLogistics.send_time || '-' }}</el-descriptions-item>
          <el-descriptions-item label="签收时间">{{ currentLogistics.receive_time || '-' }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentLogistics.created_at }}</el-descriptions-item>
        </el-descriptions>
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
      title="编辑物流信息"
      width="600px"
    >
      <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="100px">
        <el-form-item label="收货人" prop="receiver_name">
          <el-input v-model="editForm.receiver_name" placeholder="请输入收货人"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="receiver_phone">
          <el-input v-model="editForm.receiver_phone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="收货地址" prop="receiver_address">
          <el-input v-model="editForm.receiver_address" type="textarea" :rows="3" placeholder="请输入收货地址"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="loading" @click="saveEdit">
            {{ loading ? '保存中...' : '保存' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 发货对话框 -->
    <el-dialog
      v-model="shipDialogVisible"
      title="发货"
      width="500px"
    >
      <el-form :model="shipForm" :rules="shipRules" ref="shipFormRef" label-width="100px">
        <el-form-item label="物流公司" prop="logistics_company">
          <el-input v-model="shipForm.logistics_company" placeholder="请输入物流公司"></el-input>
        </el-form-item>
        <el-form-item label="物流单号" prop="logistics_no">
          <el-input v-model="shipForm.logistics_no" placeholder="请输入物流单号"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="shipDialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="loading" @click="saveShip">
            {{ loading ? '发货中...' : '发货' }}
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
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue';

export default {
  name: 'LogisticsManagement',
  setup() {
    const logisticsList = ref([]);
    const loading = ref(false);
    const detailDialogVisible = ref(false);
    const editDialogVisible = ref(false);
    const shipDialogVisible = ref(false);
    const currentLogistics = ref(null);
    const currentLogisticsId = ref(null);
    const editFormRef = ref(null);
    const shipFormRef = ref(null);
    const filterVisible = ref(true);
    
    const filterForm = reactive({
      status: '',
      adoption_id: ''
    });
    
    const editForm = reactive({
      receiver_name: '',
      receiver_phone: '',
      receiver_address: ''
    });
    
    const editRules = {
      receiver_name: [
        { required: true, message: '请输入收货人', trigger: 'blur' }
      ],
      receiver_phone: [
        { required: true, message: '请输入联系电话', trigger: 'blur' }
      ],
      receiver_address: [
        { required: true, message: '请输入收货地址', trigger: 'blur' }
      ]
    };
    
    const shipForm = reactive({
      logistics_company: '',
      logistics_no: ''
    });
    
    const shipRules = {
      logistics_company: [
        { required: true, message: '请输入物流公司', trigger: 'blur' }
      ],
      logistics_no: [
        { required: true, message: '请输入物流单号', trigger: 'blur' }
      ]
    };
    
    const pagination = reactive({
      page: 1,
      limit: 10,
      total: 0
    });
    
    const getLogisticsList = async () => {
      try {
        loading.value = true;
        const params = {
          page: pagination.page,
          limit: pagination.limit,
          status: filterForm.status,
          adoption_id: filterForm.adoption_id
        };
        const response = await adminApi.getLogistics(params);
        if (response.success) {
          logisticsList.value = response.data;
          pagination.total = response.pagination.total;
        }
      } catch (error) {
        console.error('获取物流列表失败:', error);
        ElMessage.error('获取物流列表失败');
      } finally {
        loading.value = false;
      }
    };
    
    const viewDetail = async (id) => {
      try {
        loading.value = true;
        const response = await adminApi.getLogisticsById(id);
        if (response.success) {
          currentLogistics.value = response.data;
          detailDialogVisible.value = true;
        }
      } catch (error) {
        console.error('获取物流详情失败:', error);
        ElMessage.error('获取物流详情失败');
      } finally {
        loading.value = false;
      }
    };
    
    const editLogistics = (logistics) => {
      currentLogisticsId.value = logistics.id;
      editForm.receiver_name = logistics.receiver_name;
      editForm.receiver_phone = logistics.receiver_phone;
      editForm.receiver_address = logistics.receiver_address;
      editDialogVisible.value = true;
    };
    
    const saveEdit = async () => {
      if (!editFormRef.value) return;
      
      try {
        await editFormRef.value.validate();
        loading.value = true;
        const response = await adminApi.updateLogistics(currentLogisticsId.value, editForm);
        if (response.success) {
          getLogisticsList();
          editDialogVisible.value = false;
          ElMessage.success('更新成功');
        }
      } catch (error) {
        console.error('更新物流信息失败:', error);
        ElMessage.error('更新物流信息失败');
      } finally {
        loading.value = false;
      }
    };
    
    const shipLogistics = (logistics) => {
      currentLogisticsId.value = logistics.id;
      shipForm.logistics_company = logistics.logistics_company || '';
      shipForm.logistics_no = logistics.logistics_no || '';
      shipDialogVisible.value = true;
    };
    
    const saveShip = async () => {
      if (!shipFormRef.value) return;
      
      try {
        await shipFormRef.value.validate();
        loading.value = true;
        const response = await adminApi.shipLogistics(currentLogisticsId.value, shipForm);
        if (response.success) {
          getLogisticsList();
          shipDialogVisible.value = false;
          ElMessage.success('发货成功');
        }
      } catch (error) {
        console.error('发货失败:', error);
        ElMessage.error('发货失败');
      } finally {
        loading.value = false;
      }
    };
    
    const deleteLogistics = async (id) => {
      try {
        await ElMessageBox.confirm('确定要删除这个物流信息吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        
        loading.value = true;
        const response = await adminApi.deleteLogistics(id);
        if (response.success) {
          getLogisticsList();
          ElMessage.success('删除成功');
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除物流信息失败:', error);
          ElMessage.error('删除物流信息失败');
        }
      } finally {
        loading.value = false;
      }
    };
    
    const handleFilter = () => {
      pagination.page = 1;
      getLogisticsList();
    };
    
    const resetFilter = () => {
      filterForm.status = '';
      filterForm.adoption_id = '';
      pagination.page = 1;
      getLogisticsList();
    };
    
    const toggleFilter = () => {
      filterVisible.value = !filterVisible.value;
    };
    
    const handleSizeChange = (size) => {
      pagination.limit = size;
      getLogisticsList();
    };
    
    const handleCurrentChange = (current) => {
      pagination.page = current;
      getLogisticsList();
    };
    
    const getStatusType = (status) => {
      switch (status) {
        case 'pending':
          return 'warning';
        case 'shipped':
          return 'primary';
        case 'received':
          return 'success';
        default:
          return 'info';
      }
    };
    
    const getStatusText = (status) => {
      switch (status) {
        case 'pending':
          return '待发货';
        case 'shipped':
          return '已发货';
        case 'received':
          return '已签收';
        default:
          return status;
      }
    };
    
    onMounted(() => {
      getLogisticsList();
    });
    
    return {
      logisticsList,
      loading,
      detailDialogVisible,
      editDialogVisible,
      shipDialogVisible,
      currentLogistics,
      filterForm,
      editForm,
      editRules,
      editFormRef,
      shipForm,
      shipRules,
      shipFormRef,
      pagination,
      filterVisible,
      getLogisticsList,
      viewDetail,
      editLogistics,
      saveEdit,
      shipLogistics,
      saveShip,
      deleteLogistics,
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
.logistics-management {
  padding: var(--spacing-md);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.logistics-detail {
  line-height: 1.6;
}

.dialog-footer {
  text-align: right;
}
</style>