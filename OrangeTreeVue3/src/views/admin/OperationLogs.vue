<template>
  <div class="operation-logs">
    <h2>操作日志</h2>
    <div class="logs-filter">
      <div class="filter-row">
        <div class="filter-item">
          <label for="admin_id">管理员ID</label>
          <input type="text" id="admin_id" v-model="filters.admin_id" class="form-control" placeholder="请输入管理员ID">
        </div>
        <div class="filter-item">
          <label for="operation_module">操作模块</label>
          <select id="operation_module" v-model="filters.operation_module" class="form-control">
            <option value="">全部模块</option>
            <option value="user">用户管理</option>
            <option value="tree">树木管理</option>
            <option value="adoption">认养管理</option>
            <option value="harvest">收获管理</option>
          </select>
        </div>
        <div class="filter-item">
          <label for="page">页码</label>
          <input type="number" id="page" v-model.number="filters.page" class="form-control" min="1">
        </div>
        <div class="filter-item">
          <label for="limit">每页条数</label>
          <select id="limit" v-model.number="filters.limit" class="form-control">
            <option value="10">10条</option>
            <option value="20">20条</option>
            <option value="50">50条</option>
          </select>
        </div>
        <div class="filter-item filter-actions">
          <button class="btn btn-primary" @click="getOperations">查询</button>
          <button class="btn btn-outline" @click="resetFilters">重置</button>
        </div>
      </div>
    </div>
    
    <div class="logs-table">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>管理员ID</th>
            <th>角色ID</th>
            <th>操作模块</th>
            <th>操作描述</th>
            <th>操作IP</th>
            <th>操作时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in operations" :key="log.id">
            <td>{{ log.id }}</td>
            <td>{{ log.admin_id }}</td>
            <td>{{ log.role_id }}</td>
            <td>{{ log.operation_module }}</td>
            <td>{{ log.operation_desc }}</td>
            <td>{{ log.operation_ip }}</td>
            <td>{{ log.operation_time }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="pagination" v-if="pagination.total > 0">
      <button class="btn btn-outline" @click="changePage(1)" :disabled="filters.page === 1">首页</button>
      <button class="btn btn-outline" @click="changePage(filters.page - 1)" :disabled="filters.page === 1">上一页</button>
      <span class="page-info">第 {{ filters.page }} 页，共 {{ pagination.pages }} 页</span>
      <button class="btn btn-outline" @click="changePage(filters.page + 1)" :disabled="filters.page === pagination.pages">下一页</button>
      <button class="btn btn-outline" @click="changePage(pagination.pages)" :disabled="filters.page === pagination.pages">末页</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { adminApi } from '../../services/admin';

export default {
  name: 'OperationLogs',
  setup() {
    const operations = ref([]);
    const loading = ref(false);
    const filters = ref({
      page: 1,
      limit: 10,
      admin_id: '',
      operation_module: ''
    });
    const pagination = ref({
      page: 1,
      limit: 10,
      total: 0,
      pages: 1
    });
    
    // 获取操作日志
    const getOperations = async () => {
      loading.value = true;
      try {
        const response = await adminApi.getOperations(filters.value);
        if (response.success) {
          operations.value = response.data;
          pagination.value = response.pagination || pagination.value;
        }
      } catch (error) {
        console.error('获取操作日志失败:', error);
      } finally {
        loading.value = false;
      }
    };
    
    // 重置筛选条件
    const resetFilters = () => {
      filters.value = {
        page: 1,
        limit: 10,
        admin_id: '',
        operation_module: ''
      };
      getOperations();
    };
    
    // 切换页码
    const changePage = (page) => {
      if (page >= 1 && page <= pagination.value.pages) {
        filters.value.page = page;
        getOperations();
      }
    };
    
    onMounted(() => {
      getOperations();
    });
    
    return {
      operations,
      loading,
      filters,
      pagination,
      getOperations,
      resetFilters,
      changePage
    };
  }
};
</script>

<style scoped>
.operation-logs {
  padding: var(--spacing-md);
}

.operation-logs h2 {
  margin-bottom: var(--spacing-lg);
  color: var(--text-color);
}

.logs-filter {
  background-color: var(--white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  align-items: flex-end;
}

.filter-item {
  flex: 1;
  min-width: 150px;
}

.filter-item label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
  color: var(--text-color);
  font-size: var(--font-size-sm);
}

.form-control {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-md);
  transition: border-color var(--transition-fast);
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.filter-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.logs-table {
  background-color: var(--white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  margin-bottom: var(--spacing-lg);
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: var(--spacing-sm);
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.table th {
  background-color: var(--background-color);
  font-weight: 500;
  color: var(--text-color);
}

.table tr:hover {
  background-color: rgba(76, 175, 80, 0.05);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
}

.page-info {
  padding: 0 var(--spacing-md);
  color: var(--text-light);
}

@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-item {
    min-width: auto;
  }
  
  .filter-actions {
    justify-content: center;
  }
  
  .logs-table {
    overflow-x: auto;
  }
  
  .table {
    min-width: 800px;
  }
  
  .pagination {
    flex-wrap: wrap;
  }
}
</style>