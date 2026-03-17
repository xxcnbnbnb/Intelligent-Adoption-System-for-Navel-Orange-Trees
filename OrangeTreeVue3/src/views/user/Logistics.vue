<template>
  <div class="logistics-container">
    <el-card v-loading="loading">
      <template #header>
        <h2>物流信息</h2>
      </template>
      
      <div class="logistics-content">
        <div class="logistics-info">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="收获批次">{{ logistics.harvest_batch || '-' }}</el-descriptions-item>
            <el-descriptions-item label="产品数量">{{ logistics.product_amount ? logistics.product_amount + ' 斤' : '-' }}</el-descriptions-item>
            <el-descriptions-item label="收货人">{{ logistics.receiver_name || '-' }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ logistics.receiver_phone || '-' }}</el-descriptions-item>
            <el-descriptions-item label="收货地址">{{ logistics.receiver_address || '-' }}</el-descriptions-item>
            <el-descriptions-item label="物流公司">{{ logistics.logistics_company || '-' }}</el-descriptions-item>
            <el-descriptions-item label="物流单号">{{ logistics.logistics_no || '-' }}</el-descriptions-item>
            <el-descriptions-item label="物流状态">
              <el-tag :type="getLogisticsType(logistics.status)">
                {{ getLogisticsText(logistics.status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="发货时间">{{ logistics.send_time || '-' }}</el-descriptions-item>
            <el-descriptions-item label="签收时间">{{ logistics.receive_time || '-' }}</el-descriptions-item>
          </el-descriptions>
        </div>
        
        <div class="logistics-actions" v-if="logistics.status === 'shipped'">
          <el-button type="success" size="large" @click="confirmReceipt">确认收货</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { userApi } from '../../services/user';
import { ElMessage } from 'element-plus';

export default {
  name: 'Logistics',
  setup() {
    const route = useRoute();
    const adoptionId = computed(() => route.params.adoptionId);
    const loading = ref(false);
    
    const logistics = reactive({
      harvest_batch: '',
      product_amount: null,
      receiver_name: '',
      receiver_phone: '',
      receiver_address: '',
      logistics_company: '',
      logistics_no: '',
      status: '',
      send_time: '',
      receive_time: ''
    });
    
    const fetchLogistics = async () => {
      loading.value = true;
      try {
        console.log('正在获取物流信息，adoptionId:', adoptionId.value);
        const response = await userApi.getLogistics(adoptionId.value);
        console.log('物流信息响应:', response);
        
        if (response.success) {
          Object.assign(logistics, response.data);
          ElMessage.success('获取物流信息成功');
        } else {
          ElMessage.error(response.message || '获取物流信息失败');
        }
      } catch (error) {
        ElMessage.error('获取物流信息失败');
        console.error('获取物流信息失败:', error);
      } finally {
        loading.value = false;
      }
    };
    
    const confirmReceipt = async () => {
      try {
        const response = await userApi.receiveLogistics(logistics.id);
        if (response.success) {
          ElMessage.success('确认收货成功');
          fetchLogistics();
        } else {
          ElMessage.error(response.message);
        }
      } catch (error) {
        ElMessage.error('确认收货失败');
        console.error('确认收货失败:', error);
      }
    };
    
    const getLogisticsType = (status) => {
      switch (status) {
        case 'pending': return 'warning';
        case 'shipped': return 'primary';
        case 'received': return 'success';
        default: return '';
      }
    };
    
    const getLogisticsText = (status) => {
      switch (status) {
        case 'pending': return '待发货';
        case 'shipped': return '已发货';
        case 'received': return '已签收';
        default: return status;
      }
    };
    
    onMounted(() => {
      fetchLogistics();
    });
    
    return {
      logistics,
      loading,
      confirmReceipt,
      getLogisticsType,
      getLogisticsText
    };
  }
};
</script>

<style scoped lang="scss">
.logistics-container {
  padding: var(--spacing-lg);
}

.logistics-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.logistics-info {
  h3 {
    margin-bottom: var(--spacing-md);
    color: var(--text-color);
  }
}

.logistics-actions {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-lg);
}
</style>
