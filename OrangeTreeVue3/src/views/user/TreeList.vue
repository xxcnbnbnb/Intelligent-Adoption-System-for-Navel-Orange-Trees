<template>
  <div class="tree-list-container">
    <div class="filter-section">
      <el-card>
        <el-form :model="filterForm" label-width="80px">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="品种">
                <el-select v-model="filterForm.variety" placeholder="请选择品种">
                  <el-option label="纽荷尔" value="纽荷尔" />
                  <el-option label="伦晚" value="伦晚" />
                  <el-option label="红肉" value="红肉" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="树龄">
                <el-select v-model="filterForm.age" placeholder="请选择树龄">
                  <el-option label="1-3年" value="1-3" />
                  <el-option label="4-6年" value="4-6" />
                  <el-option label="7年以上" value="7+" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="状态">
                <el-select v-model="filterForm.status" placeholder="请选择状态">
                  <el-option label="可认养" value="available" />
                  <el-option label="已认养" value="adopted" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="text-right">
              <el-button type="primary" @click="searchTrees">查询</el-button>
              <el-button @click="resetFilter">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
    
    <div class="tree-grid">
      <el-card v-for="tree in trees" :key="tree.id" class="tree-card">
        <div class="tree-image">
          <img :src="tree.image || '/src/assets/vue.svg'" :alt="tree.name" />
        </div>
        <div class="tree-info">
          <h3>{{ tree.name }}</h3>
          <p class="tree-id">编号：{{ tree.id }}</p>
          <p class="tree-variety">品种：{{ tree.variety }}</p>
          <p class="tree-age">树龄：{{ tree.age }}年</p>
          <p class="tree-price">认养费用：¥{{ tree.price }}/年</p>
          <p class="tree-status">
            <el-tag :type="tree.status === 'available' ? 'success' : 'info'">
              {{ tree.status === 'available' ? '可认养' : '已认养' }}
            </el-tag>
          </p>
          <div class="tree-actions">
            <el-button type="primary" @click="viewTreeDetail(tree.id)">查看详情</el-button>
            <el-button 
              v-if="tree.status === 'available'" 
              type="success" 
              @click="adoptTree(tree.id)"
            >
              立即认养
            </el-button>
          </div>
        </div>
      </el-card>
    </div>
    
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
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useTreeStore } from '../../store/tree';

export default {
  name: 'TreeList',
  setup() {
    const router = useRouter();
    const treeStore = useTreeStore();
    
    const filterForm = reactive({
      variety: '',
      age: '',
      status: ''
    });
    
    const pagination = reactive({
      page: 1,
      limit: 10,
      total: 0
    });
    
    // 使用computed创建响应式引用
    const trees = computed(() => treeStore.trees);
    
    const searchTrees = async () => {
      pagination.page = 1;
      await fetchTrees();
    };
    
    const resetFilter = () => {
      filterForm.variety = '';
      filterForm.age = '';
      filterForm.status = '';
      searchTrees();
    };
    
    const fetchTrees = async () => {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filterForm
      };
      await treeStore.getTrees(params);
      pagination.total = treeStore.pagination.total;
    };
    
    const handleSizeChange = async (size) => {
      pagination.limit = size;
      await fetchTrees();
    };
    
    const handleCurrentChange = async (current) => {
      pagination.page = current;
      await fetchTrees();
    };
    
    const viewTreeDetail = (treeId) => {
      router.push(`/user/trees/${treeId}`);
    };
    
    const adoptTree = (treeId) => {
      router.push(`/user/trees/${treeId}`);
    };
    
    onMounted(() => {
      fetchTrees();
    });
    
    return {
      filterForm,
      pagination,
      trees,
      searchTrees,
      resetFilter,
      handleSizeChange,
      handleCurrentChange,
      viewTreeDetail,
      adoptTree
    };
  }
};
</script>

<style scoped lang="scss">
.tree-list-container {
  padding: var(--spacing-lg);
}

.filter-section {
  margin-bottom: var(--spacing-lg);
}

.tree-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.tree-card {
  transition: transform var(--transition-fast);
  
  &:hover {
    transform: translateY(-5px);
  }
  
  .tree-image {
    height: 200px;
    overflow: hidden;
    margin-bottom: var(--spacing-md);
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .tree-info {
    h3 {
      margin-bottom: var(--spacing-sm);
      color: var(--text-color);
    }
    
    p {
      margin-bottom: var(--spacing-xs);
      color: var(--text-light);
      font-size: var(--font-size-sm);
    }
    
    .tree-price {
      font-weight: 500;
      color: var(--accent-color);
      margin: var(--spacing-sm) 0;
    }
    
    .tree-status {
      margin: var(--spacing-sm) 0;
    }
    
    .tree-actions {
      margin-top: var(--spacing-md);
      display: flex;
      gap: var(--spacing-sm);
    }
  }
}

.pagination {
  margin-top: var(--spacing-lg);
  display: flex;
  justify-content: center;
}
</style>