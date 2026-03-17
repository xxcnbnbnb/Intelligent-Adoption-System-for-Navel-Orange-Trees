<template>
  <div class="growth-records-container">
    <el-card>
      <template #header>
        <h2>树木生长记录</h2>
      </template>
      
      <div class="growth-list">
        <el-timeline>
          <el-timeline-item
            v-for="(record, index) in growthRecords"
            :key="record.id"
            :timestamp="record.createdAt"
            :type="getTimelineType(index)"
          >
            <el-card>
              <h3>{{ record.title }}</h3>
              <p class="growth-description">{{ record.description }}</p>
              <div class="growth-media" v-if="record.images && record.images.length > 0">
                <el-image
                  v-for="(image, imgIndex) in record.images"
                  :key="imgIndex"
                  :src="image"
                  :preview-src-list="record.images"
                  class="growth-image"
                />
              </div>
              <div class="growth-stage">
                <el-tag size="small">{{ record.stage }}</el-tag>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
      
      <div class="pagination" v-if="growthRecords.length > 0">
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
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { userApi } from '../../services/user';
import { ElMessage } from 'element-plus';

export default {
  name: 'GrowthRecords',
  setup() {
    const route = useRoute();
    const treeId = computed(() => route.params.treeId);
    const growthRecords = ref([]);
    
    const pagination = reactive({
      page: 1,
      limit: 10,
      total: 0
    });
    
    const fetchGrowthRecords = async () => {
      try {
        const params = {
          page: pagination.page,
          limit: pagination.limit
        };
        
        const response = await userApi.getGrowthRecords(treeId.value, params);
        if (response.success) {
          growthRecords.value = response.data;
          pagination.total = response.pagination?.total || 0;
        }
      } catch (error) {
        ElMessage.error('获取生长记录失败');
        console.error('获取生长记录失败:', error);
      }
    };
    
    const handleSizeChange = async (size) => {
      pagination.limit = size;
      await fetchGrowthRecords();
    };
    
    const handleCurrentChange = async (current) => {
      pagination.page = current;
      await fetchGrowthRecords();
    };
    
    const getTimelineType = (index) => {
      const types = ['primary', 'success', 'warning', 'info'];
      return types[index % types.length];
    };
    
    onMounted(() => {
      fetchGrowthRecords();
    });
    
    return {
      growthRecords,
      pagination,
      handleSizeChange,
      handleCurrentChange,
      getTimelineType
    };
  }
};
</script>

<style scoped lang="scss">
.growth-records-container {
  padding: var(--spacing-lg);
}

.growth-list {
  margin-bottom: var(--spacing-lg);
}

.growth-description {
  margin: var(--spacing-sm) 0;
  color: var(--text-light);
  line-height: 1.6;
}

.growth-media {
  margin: var(--spacing-md) 0;
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.growth-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: var(--border-radius-sm);
}

.growth-stage {
  margin-top: var(--spacing-sm);
  display: flex;
  justify-content: flex-end;
}

.pagination {
  margin-top: var(--spacing-lg);
  display: flex;
  justify-content: center;
}
</style>