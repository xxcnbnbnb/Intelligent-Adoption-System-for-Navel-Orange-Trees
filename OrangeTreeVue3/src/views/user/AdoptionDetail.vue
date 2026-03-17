<template>
  <div class="adoption-detail-container">
    <el-card v-loading="loading">
      <template #header>
        <h2>订单详情</h2>
      </template>
      
      <div class="adoption-content">
        <div class="order-info">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="订单号">{{ adoption.id }}</el-descriptions-item>
            <el-descriptions-item label="树木编号">{{ adoption.treeId }}</el-descriptions-item>
            <el-descriptions-item label="树木名称">{{ adoption.treeName }}</el-descriptions-item>
            <el-descriptions-item label="认养年限">{{ adoption.years }}年</el-descriptions-item>
            <el-descriptions-item label="认养费用">¥{{ adoption.price }}/年</el-descriptions-item>
            <el-descriptions-item label="总费用">¥{{ adoption.totalPrice }}</el-descriptions-item>
            <el-descriptions-item label="订单状态">
              <el-tag :type="getStatusType(adoption.status)">
                {{ getStatusText(adoption.status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ adoption.createdAt }}</el-descriptions-item>
            <el-descriptions-item label="支付时间">{{ adoption.paidAt || '-' }}</el-descriptions-item>
            <el-descriptions-item label="开始日期">{{ adoption.startDate }}</el-descriptions-item>
            <el-descriptions-item label="结束日期">{{ adoption.endDate }}</el-descriptions-item>
          </el-descriptions>
        </div>
        
        <div class="user-info">
          <h3>用户信息</h3>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="联系人">{{ adoption.contactName }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ adoption.contactPhone }}</el-descriptions-item>
            <el-descriptions-item label="收货地址">{{ adoption.shippingAddress }}</el-descriptions-item>
          </el-descriptions>
        </div>
        
        <div class="order-actions">
          <el-button v-if="adoption.status === 'unpaid'" type="primary" size="large" @click="payOrder">去支付</el-button>
          <el-button v-if="adoption.status === 'paid'" type="success" size="large" @click="viewLogistics">查看物流</el-button>
          <el-button v-if="adoption.status === 'completed'" type="info" size="large" @click="renewAdoption">续费</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { userApi } from '../../services/user';
import { ElMessage } from 'element-plus';

export default {
  name: 'AdoptionDetail',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const loading = ref(false);
    
    const adoptionId = computed(() => route.params.id);
    
    const adoption = reactive({
      id: '',
      treeId: '',
      treeName: '',
      years: '',
      price: '',
      totalPrice: '',
      status: '',
      createdAt: '',
      paidAt: '',
      startDate: '',
      endDate: '',
      contactName: '',
      contactPhone: '',
      shippingAddress: ''
    });
    
    const fetchAdoptionDetail = async () => {
      loading.value = true;
      try {
        const response = await userApi.getAdoptionById(adoptionId.value);
        if (response.success) {
          const data = response.data;
          // 映射后端数据到前端期望的格式
          adoption.id = data.id;
          adoption.treeId = data.tree_id;
          adoption.treeName = data.tree_info?.tree_no || '';
          adoption.years = data.adopt_years;
          adoption.price = data.total_amount / data.adopt_years || 0;
          adoption.totalPrice = data.total_amount;
          adoption.status = data.pay_status;
          adoption.createdAt = data.created_at;
          adoption.paidAt = data.pay_time;
          adoption.startDate = data.start_date;
          adoption.endDate = data.end_date;
          adoption.contactName = data.user_info?.nickname || '';
          adoption.contactPhone = data.user_info?.phone || data.logistics_info?.receiver_phone || '';
          adoption.shippingAddress = data.logistics_info?.receiver_address || '';
        } else {
          ElMessage.error(response.message);
        }
      } catch (error) {
        ElMessage.error('获取订单详情失败');
        console.error('获取订单详情失败:', error);
      } finally {
        loading.value = false;
      }
    };
    
    const payOrder = () => {
      // 这里可以实现支付逻辑
      ElMessage.info('跳转到支付页面');
    };
    
    const viewLogistics = () => {
      router.push(`/user/logistics/${adoptionId.value}`);
    };
    
    const renewAdoption = () => {
      // 这里可以实现续费逻辑
      ElMessage.info('跳转到续费页面');
    };
    
    const getStatusType = (status) => {
      switch (status) {
        case 'unpaid': return 'warning';
        case 'paid': return 'primary';
        case 'completed': return 'success';
        case 'canceled': return 'danger';
        default: return '';
      }
    };
    
    const getStatusText = (status) => {
      switch (status) {
        case 'unpaid': return '待支付';
        case 'paid': return '已支付';
        case 'completed': return '已完成';
        case 'canceled': return '已取消';
        default: return status;
      }
    };
    
    onMounted(() => {
      fetchAdoptionDetail();
    });
    
    return {
      adoption,
      loading,
      payOrder,
      viewLogistics,
      renewAdoption,
      getStatusType,
      getStatusText
    };
  }
};
</script>

<style scoped lang="scss">
.adoption-detail-container {
  padding: var(--spacing-lg);
}

.adoption-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.order-info,
.user-info {
  h3 {
    margin-bottom: var(--spacing-md);
    color: var(--text-color);
  }
}

.order-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  margin-top: var(--spacing-lg);
}
</style>