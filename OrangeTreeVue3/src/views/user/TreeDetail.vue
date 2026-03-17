<template>
  <div class="tree-detail-container">
    <el-card v-loading="loading">
      <template #header>
        <div class="tree-header">
          <h2>{{ tree.name }}</h2>
          <el-tag :type="tree.status === 'available' ? 'success' : 'info'">
            {{ tree.status === 'available' ? '可认养' : '已认养' }}
          </el-tag>
        </div>
      </template>
      
      <div class="tree-content">
        <div class="tree-image-section">
          <el-carousel :interval="5000" type="card" height="400px">
            <el-carousel-item v-for="(img, index) in tree.images" :key="index">
              <img :src="img" :alt="tree.name" class="carousel-image" />
            </el-carousel-item>
            <el-carousel-item v-if="!tree.images || tree.images.length === 0">
              <img src="/src/assets/vue.svg" alt="默认图片" class="carousel-image" />
            </el-carousel-item>
          </el-carousel>
        </div>
        
        <div class="tree-info-section">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="树木编号">{{ tree.id }}</el-descriptions-item>
            <el-descriptions-item label="品种">{{ tree.variety }}</el-descriptions-item>
            <el-descriptions-item label="树龄">{{ tree.age }}年</el-descriptions-item>
            <el-descriptions-item label="位置">{{ tree.location }}</el-descriptions-item>
            <el-descriptions-item label="认养费用">¥{{ tree.price }}/年</el-descriptions-item>
            <el-descriptions-item label="预计产量">{{ tree.expectedYield }}kg/年</el-descriptions-item>
            <el-descriptions-item label="描述" :span="2">{{ tree.description }}</el-descriptions-item>
          </el-descriptions>
          
          <div class="tree-actions">
            <el-button type="primary" size="large" @click="viewGrowthRecords">查看生长记录</el-button>
            <el-button type="success" size="large" @click="viewInteractions">查看互动记录</el-button>
            <el-button 
              v-if="tree.status === 'available'" 
              type="danger" 
              size="large" 
              @click="openAdoptionDialog"
            >
              立即认养
            </el-button>
          </div>
        </div>
      </div>
    </el-card>
    
    <!-- 认养对话框 -->
    <el-dialog
      v-model="adoptionDialogVisible"
      title="认养树木"
      width="500px"
    >
      <el-form :model="adoptionForm" :rules="adoptionRules" ref="adoptionFormRef" label-width="80px">
        <el-form-item label="认养年限" prop="years">
          <el-select v-model="adoptionForm.years" placeholder="请选择认养年限">
            <el-option label="1年" value="1" />
            <el-option label="2年" value="2" />
            <el-option label="3年" value="3" />
            <el-option label="5年" value="5" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="adoptionDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAdoption">确认认养</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTreeStore } from '../../store/tree';
import { userApi } from '../../services/user';
import { ElMessage } from 'element-plus';

export default {
  name: 'TreeDetail',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const treeStore = useTreeStore();
    const adoptionFormRef = ref(null);
    
    const treeId = computed(() => route.params.id);
    const loading = ref(false);
    const adoptionDialogVisible = ref(false);
    
    const tree = reactive({
      id: '',
      name: '',
      variety: '',
      age: '',
      location: '',
      price: '',
      expectedYield: '',
      description: '',
      status: '',
      images: []
    });
    
    const adoptionForm = reactive({
      years: ''
    });
    
    const adoptionRules = {
      years: [
        { required: true, message: '请选择认养年限', trigger: 'blur' }
      ]
    };
    
    const fetchTreeDetail = async () => {
      loading.value = true;
      try {
        await treeStore.getTreeById(treeId.value);
        const treeData = treeStore.currentTree;
        if (treeData) {
          Object.assign(tree, treeData);
        }
      } catch (error) {
        ElMessage.error('获取树木详情失败');
        console.error('获取树木详情失败:', error);
      } finally {
        loading.value = false;
      }
    };
    
    const viewGrowthRecords = () => {
      router.push(`/user/growth/${treeId.value}`);
    };
    
    const viewInteractions = () => {
      router.push(`/user/interaction/${treeId.value}`);
    };
    
    const openAdoptionDialog = () => {
      adoptionDialogVisible.value = true;
    };
    
    const submitAdoption = async () => {
      if (!adoptionFormRef.value) return;
      
      try {
        await adoptionFormRef.value.validate();
        loading.value = true;
        
        const adoptionData = {
          tree_id: parseInt(treeId.value),
          adopt_years: parseInt(adoptionForm.years)
        };
        
        console.log('发送认养请求:', adoptionData);
        const response = await userApi.createAdoption(adoptionData);
        console.log('认养响应:', response);
        if (response.success) {
          ElMessage.success('认养成功');
          adoptionDialogVisible.value = false;
          router.push('/user/adoptions');
        } else {
          ElMessage.error(response.message || '认养失败');
        }
      } catch (error) {
        console.error('认养失败:', error);
        console.error('错误详情:', error.response);
        const errorMessage = error.response?.data?.message || error.message || '认养失败，请重试';
        ElMessage.error(errorMessage);
      } finally {
        loading.value = false;
      }
    };
    
    onMounted(() => {
      fetchTreeDetail();
    });
    
    return {
      tree,
      loading,
      adoptionDialogVisible,
      adoptionForm,
      adoptionRules,
      adoptionFormRef,
      viewGrowthRecords,
      viewInteractions,
      openAdoptionDialog,
      submitAdoption
    };
  }
};
</script>

<style scoped lang="scss">
.tree-detail-container {
  padding: var(--spacing-lg);
}

.tree-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tree-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-lg);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.tree-image-section {
  .carousel-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.tree-info-section {
  .tree-actions {
    margin-top: var(--spacing-lg);
    display: flex;
    gap: var(--spacing-md);
    
    @media (max-width: 768px) {
      flex-direction: column;
    }
  }
}
</style>