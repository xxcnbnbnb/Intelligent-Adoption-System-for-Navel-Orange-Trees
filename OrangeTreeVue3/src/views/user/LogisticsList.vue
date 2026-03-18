<template>
  <div class="logistics-list-container">
    <el-card>
      <template #header>
        <h2>物流信息列表</h2>
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
            </el-row>
            <el-row>
              <el-col :span="24" class="text-right">
                <el-button type="primary" @click="handleFilter">查询</el-button>
                <el-button @click="resetFilter">重置</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>
      
      <!-- 物流列表 -->
      <el-table :data="logisticsList" style="width: 100%" border v-loading="loading">
        <el-table-column prop="id" label="物流ID" width="80"></el-table-column>
        <el-table-column prop="adopt_id" label="订单ID" width="80"></el-table-column>
        <el-table-column prop="harvest_batch" label="收获批次" width="120"></el-table-column>
        <el-table-column prop="product_amount" label="产品数量" width="100">
          <template #default="scope">
            {{ scope.row.product_amount ? scope.row.product_amount + ' 斤' : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="receiver_name" label="收货人" width="100"></el-table-column>
        <el-table-column prop="receiver_phone" label="联系电话" width="130"></el-table-column>
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
        <el-table-column prop="send_time" label="发货时间" width="180"></el-table-column>
        <el-table-column prop="receive_time" label="签收时间" width="180"></el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button size="small" type="primary" @click="viewDetail(scope.row)">查看详情</el-button>
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
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { userApi } from '../../services/user';
import { ElMessage } from 'element-plus';
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue';

export default {
  name: 'LogisticsList',
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const filterVisible = ref(true);
    
    const logisticsList = ref([]);
    
    const filterForm = reactive({
      status: ''
    });
    
    const pagination = reactive({
      page: 1,
      limit: 10,
      total: 0
    });
    
    const fetchLogisticsList = async () => {
      loading.value = true;
      try {
        const params = {
          page: pagination.page,
          limit: pagination.limit,
          status: filterForm.status
        };
        
        const response = await userApi.getUserLogisticsList(params);
        if (response.success) {
          logisticsList.value = response.data;
          pagination.total = response.pagination?.total || 0;
        }
      } catch (error) {
        ElMessage.error('获取物流列表失败');
        console.error('获取物流列表失败:', error);
      } finally {
        loading.value = false;
      }
    };
    
    const handleFilter = () => {
      pagination.page = 1;
      fetchLogisticsList();
    };
    
    const resetFilter = () => {
      filterForm.status = '';
      pagination.page = 1;
      fetchLogisticsList();
    };
    
    const toggleFilter = () => {
      filterVisible.value = !filterVisible.value;
    };
    
    const handleSizeChange = (size) => {
      pagination.limit = size;
      fetchLogisticsList();
    };
    
    const handleCurrentChange = (current) => {
      pagination.page = current;
      fetchLogisticsList();
    };
    
    const viewDetail = (logistics) => {
      router.push(`/user/logistics/${logistics.adopt_id}`);
    };
    
    const getStatusType = (status) => {
      switch (status) {
        case 'pending': return 'warning';
        case 'shipped': return 'primary';
        case 'received': return 'success';
        default: return '';
      }
    };
    
    const getStatusText = (status) => {
      switch (status) {
        case 'pending': return '待发货';
        case 'shipped': return '已发货';
        case 'received': return '已签收';
        default: return status;
      }
    };
    
    onMounted(() => {
      fetchLogisticsList();
    });
    
    return {
      loading,
      filterVisible,
      logisticsList,
      filterForm,
      pagination,
      handleFilter,
      resetFilter,
      toggleFilter,
      handleSizeChange,
      handleCurrentChange,
      viewDetail,
      getStatusType,
      getStatusText
    };
  }
};
</script>

<style scoped lang="scss">
.logistics-list-container {
  padding: var(--spacing-lg);
}

.filter-card {
  margin-bottom: var(--spacing-lg);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.collapse-icon {
  transition: transform 0.3s;
}

.pagination {
  margin-top: var(--spacing-lg);
  display: flex;
  justify-content: center;
}
</style>