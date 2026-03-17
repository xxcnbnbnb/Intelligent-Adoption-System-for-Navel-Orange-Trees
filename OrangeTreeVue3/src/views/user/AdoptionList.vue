<template>
  <div class="adoption-list-container">
    <el-card>
      <template #header>
        <h2>认养订单</h2>
      </template>
      
      <div class="filter-section">
        <el-form :model="filterForm" label-width="80px">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="订单状态">
                <el-select v-model="filterForm.status" placeholder="请选择订单状态">
                  <el-option label="全部" value="" />
                  <el-option label="待支付" value="pending" />
                  <el-option label="已支付" value="paid" />
                  <el-option label="已完成" value="completed" />
                  <el-option label="已取消" value="cancelled" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="订单号">
                <el-input v-model="filterForm.orderNo" placeholder="请输入订单号" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="树木编号">
                <el-input v-model="filterForm.treeId" placeholder="请输入树木编号" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="text-right">
              <el-button type="primary" @click="searchAdoptions">查询</el-button>
              <el-button @click="resetFilter">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      
      <el-table :data="adoptions" style="width: 100%">
        <el-table-column prop="id" label="订单号" width="180" />
        <el-table-column prop="treeId" label="树木编号" width="120" />
        <el-table-column prop="treeName" label="树木名称" width="150" />
        <el-table-column prop="years" label="认养年限" width="100" />
        <el-table-column prop="totalPrice" label="总费用" width="100">
          <template #default="scope">
            ¥{{ scope.row.totalPrice }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" type="primary" @click="viewAdoptionDetail(scope.row.id)">查看详情</el-button>
            <el-button 
              v-if="scope.row.status === 'pending'" 
              size="small" 
              type="success" 
              @click="payOrder(scope.row.id)"
            >
              去支付
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
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
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { userApi } from '../../services/user';
import { ElMessage } from 'element-plus';

export default {
  name: 'AdoptionList',
  setup() {
    const router = useRouter();
    const adoptions = ref([]);
    
    const filterForm = reactive({
      status: '',
      orderNo: '',
      treeId: ''
    });
    
    const pagination = reactive({
      page: 1,
      limit: 10,
      total: 0
    });
    
    const searchAdoptions = async () => {
      pagination.page = 1;
      await fetchAdoptions();
    };
    
    const resetFilter = () => {
      filterForm.status = '';
      filterForm.orderNo = '';
      filterForm.treeId = '';
      searchAdoptions();
    };
    
    const fetchAdoptions = async () => {
      try {
        const params = {
          page: pagination.page,
          limit: pagination.limit,
          ...filterForm
        };
        
        const response = await userApi.getUserAdoptions(params);
        if (response.success) {
          adoptions.value = response.data;
          pagination.total = response.pagination?.total || 0;
        }
      } catch (error) {
        ElMessage.error('获取订单列表失败');
        console.error('获取订单列表失败:', error);
      }
    };
    
    const handleSizeChange = async (size) => {
      pagination.limit = size;
      await fetchAdoptions();
    };
    
    const handleCurrentChange = async (current) => {
      pagination.page = current;
      await fetchAdoptions();
    };
    
    const viewAdoptionDetail = (adoptionId) => {
      router.push(`/user/adoptions/${adoptionId}`);
    };
    
    const payOrder = (adoptionId) => {
      // 这里可以实现支付逻辑
      ElMessage.info('跳转到支付页面');
    };
    
    const getStatusType = (status) => {
      switch (status) {
        case 'pending': return 'warning';
        case 'paid': return 'primary';
        case 'completed': return 'success';
        case 'cancelled': return 'danger';
        default: return '';
      }
    };
    
    const getStatusText = (status) => {
      switch (status) {
        case 'pending': return '待支付';
        case 'paid': return '已支付';
        case 'completed': return '已完成';
        case 'cancelled': return '已取消';
        default: return status;
      }
    };
    
    onMounted(() => {
      fetchAdoptions();
    });
    
    return {
      adoptions,
      filterForm,
      pagination,
      searchAdoptions,
      resetFilter,
      handleSizeChange,
      handleCurrentChange,
      viewAdoptionDetail,
      payOrder,
      getStatusType,
      getStatusText
    };
  }
};
</script>

<style scoped lang="scss">
.adoption-list-container {
  padding: var(--spacing-lg);
}

.filter-section {
  margin-bottom: var(--spacing-lg);
}

.pagination {
  margin-top: var(--spacing-lg);
  display: flex;
  justify-content: center;
}
</style>