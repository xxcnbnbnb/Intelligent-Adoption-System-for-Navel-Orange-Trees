<template>
  <div class="tree-management-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>树木管理</h2>
          <el-button type="primary" @click="openCreateDialog">添加树木</el-button>
        </div>
      </template>
      
      <div class="filter-section">
        <el-form :model="filterForm" label-width="80px">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="树木编号">
                <el-input v-model="filterForm.id" placeholder="请输入树木编号" />
              </el-form-item>
            </el-col>
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
      </div>
      
      <el-table :data="trees" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="tree_no" label="树木编号" width="120" />
        <el-table-column prop="variety" label="品种" width="100" />
        <el-table-column prop="age" label="树龄" width="80" />
        <el-table-column prop="location" label="位置" width="150" />
        <el-table-column prop="price" label="认养费用" width="100">
          <template #default="scope">
            ¥{{ scope.row.price }}/年
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" type="primary" @click="editTree(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteTree(scope.row.id)">删除</el-button>
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
    
    <!-- 添加/编辑树木对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
    >
      <el-form :model="treeForm" :rules="treeRules" ref="treeFormRef" label-width="80px">
        <el-form-item label="树木编号" prop="tree_no">
          <el-input v-model="treeForm.tree_no" placeholder="请输入树木编号" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="品种" prop="variety">
          <el-select v-model="treeForm.variety" placeholder="请选择品种">
            <el-option label="纽荷尔" value="纽荷尔" />
            <el-option label="伦晚" value="伦晚" />
            <el-option label="红肉" value="红肉" />
          </el-select>
        </el-form-item>
        <el-form-item label="树龄" prop="age">
          <el-input v-model.number="treeForm.age" placeholder="请输入树龄" type="number" />
        </el-form-item>
        <el-form-item label="位置" prop="location">
          <el-input v-model="treeForm.location" placeholder="请输入位置" />
        </el-form-item>
        <el-form-item label="认养费用" prop="price">
          <el-input v-model.number="treeForm.price" placeholder="请输入认养费用" type="number" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="treeForm.status" placeholder="请选择状态">
            <el-option label="可认养" value="available" />
            <el-option label="已认养" value="adopted" />
            <el-option label="维护中" value="maintaining" />
          </el-select>
        </el-form-item>
        <el-form-item label="封面图片" prop="cover_img">
          <el-input v-model="treeForm.cover_img" placeholder="请输入封面图片URL" />
        </el-form-item>
        <el-form-item label="全景URL" prop="panorama_url">
          <el-input v-model="treeForm.panorama_url" placeholder="请输入全景URL" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitTree">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { adminApi } from '../../services/admin';
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
  name: 'TreeManagement',
  setup() {
    const trees = ref([]);
    const dialogVisible = ref(false);
    const isEdit = ref(false);
    const dialogTitle = ref('添加树木');
    const treeFormRef = ref(null);
    
    const filterForm = reactive({
      id: '',
      variety: '',
      status: ''
    });
    
    const pagination = reactive({
      page: 1,
      limit: 10,
      total: 0
    });
    
    const treeForm = reactive({
      id: '',
      tree_no: '',
      variety: '',
      age: '',
      location: '',
      price: '',
      status: 'available',
      cover_img: '',
      panorama_url: ''
    });
    
    const treeRules = {
      tree_no: [
        { required: true, message: '请输入树木编号', trigger: 'blur' }
      ],
      variety: [
        { required: true, message: '请选择品种', trigger: 'blur' }
      ],
      age: [
        { required: true, message: '请输入树龄', trigger: 'blur' }
      ],
      location: [
        { required: true, message: '请输入位置', trigger: 'blur' }
      ],
      price: [
        { required: true, message: '请输入认养费用', trigger: 'blur' }
      ],
      status: [
        { required: true, message: '请选择状态', trigger: 'blur' }
      ]
    };
    
    const searchTrees = async () => {
      pagination.page = 1;
      await fetchTrees();
    };
    
    const resetFilter = () => {
      filterForm.id = '';
      filterForm.variety = '';
      filterForm.status = '';
      searchTrees();
    };
    
    const fetchTrees = async () => {
      try {
        const params = {
          page: pagination.page,
          limit: pagination.limit,
          ...filterForm
        };
        
        const response = await adminApi.getTrees(params);
        if (response.success) {
          trees.value = response.data;
          pagination.total = response.pagination?.total || 0;
        }
      } catch (error) {
        ElMessage.error('获取树木列表失败');
        console.error('获取树木列表失败:', error);
      }
    };
    
    const handleSizeChange = async (size) => {
      pagination.limit = size;
      await fetchTrees();
    };
    
    const handleCurrentChange = async (current) => {
      pagination.page = current;
      await fetchTrees();
    };
    
    const openCreateDialog = () => {
      isEdit.value = false;
      dialogTitle.value = '添加树木';
      // 重置表单
      Object.assign(treeForm, {
        id: '',
        tree_no: '',
        variety: '',
        age: '',
        location: '',
        price: '',
        status: 'available',
        cover_img: '',
        panorama_url: ''
      });
      dialogVisible.value = true;
    };
    
    const editTree = (tree) => {
      isEdit.value = true;
      dialogTitle.value = '编辑树木';
      console.log('编辑树木:', tree);
      Object.assign(treeForm, tree);
      dialogVisible.value = true;
    };
    
    const getStatusType = (status) => {
      switch (status) {
        case 'available': return 'success';
        case 'adopted': return 'info';
        case 'maintaining': return 'warning';
        default: return '';
      }
    };
    
    const getStatusText = (status) => {
      switch (status) {
        case 'available': return '可认养';
        case 'adopted': return '已认养';
        case 'maintaining': return '维护中';
        default: return status;
      }
    };
    
    const deleteTree = async (treeId) => {
      try {
        await ElMessageBox.confirm('确定要删除这棵树木吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        
        const response = await adminApi.deleteTree(treeId);
        if (response.success) {
          ElMessage.success('删除成功');
          fetchTrees();
        } else {
          ElMessage.error(response.message);
        }
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('删除失败');
          console.error('删除树木失败:', error);
        }
      }
    };
    
    const submitTree = async () => {
      if (!treeFormRef.value) return;
      
      try {
        await treeFormRef.value.validate();
        let response;
        
        if (isEdit.value) {
          console.log('更新树木:', treeForm.id, treeForm);
          response = await adminApi.updateTree(treeForm.id, treeForm);
        } else {
          console.log('创建树木:', treeForm);
          response = await adminApi.createTree(treeForm);
        }
        
        if (response.success) {
          ElMessage.success(isEdit.value ? '更新成功' : '添加成功');
          dialogVisible.value = false;
          fetchTrees();
        } else {
          ElMessage.error(response.message);
        }
      } catch (error) {
        ElMessage.error('操作失败，请重试');
        console.error('提交树木失败:', error);
      }
    };
    
    onMounted(() => {
      fetchTrees();
    });
    
    return {
      trees,
      filterForm,
      pagination,
      dialogVisible,
      isEdit,
      dialogTitle,
      treeForm,
      treeRules,
      treeFormRef,
      searchTrees,
      resetFilter,
      handleSizeChange,
      handleCurrentChange,
      openCreateDialog,
      editTree,
      deleteTree,
      submitTree,
      getStatusType,
      getStatusText
    };
  }
};
</script>

<style scoped lang="scss">
.tree-management-container {
  padding: var(--spacing-lg);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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