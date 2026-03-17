<template>
  <div class="harvest-management-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>收获管理</h2>
          <el-button type="primary" @click="openCreateDialog">添加收获记录</el-button>
        </div>
      </template>
      
      <div class="filter-section">
        <el-form :model="filterForm" label-width="80px">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="树木编号">
                <el-input v-model="filterForm.treeId" placeholder="请输入树木编号" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="收获状态">
                <el-select v-model="filterForm.status" placeholder="请选择收获状态">
                  <el-option label="待收获" value="pending" />
                  <el-option label="已收获" value="completed" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="收获时间">
                <el-date-picker
                  v-model="filterForm.harvestDate"
                  type="date"
                  placeholder="选择收获日期"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="text-right">
              <el-button type="primary" @click="searchHarvests">查询</el-button>
              <el-button @click="resetFilter">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      
      <el-table :data="harvests" style="width: 100%">
        <el-table-column prop="id" label="收获记录ID" width="120" />
        <el-table-column prop="treeId" label="树木编号" width="120" />
        <el-table-column prop="treeName" label="树木名称" width="150" />
        <el-table-column prop="harvestDate" label="收获日期" width="150" />
        <el-table-column prop="yield" label="收获产量" width="100">
          <template #default="scope">
            {{ scope.row.yield }}kg
          </template>
        </el-table-column>
        <el-table-column prop="quality" label="品质等级" width="100">
          <template #default="scope">
            <el-tag :type="getQualityType(scope.row.quality)">
              {{ scope.row.quality }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'pending' ? 'warning' : 'success'">
              {{ scope.row.status === 'pending' ? '待收获' : '已收获' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" type="primary" @click="editHarvest(scope.row)">编辑</el-button>
            <el-button 
              v-if="scope.row.status === 'pending'" 
              size="small" 
              type="success" 
              @click="completeHarvest(scope.row.id)"
            >
              完成收获
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
    
    <!-- 添加/编辑收获记录对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
    >
      <el-form :model="harvestForm" :rules="harvestRules" ref="harvestFormRef" label-width="80px">
        <el-form-item label="树木编号" prop="treeId">
          <el-input v-model="harvestForm.treeId" placeholder="请输入树木编号" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="树木名称" prop="treeName">
          <el-input v-model="harvestForm.treeName" placeholder="请输入树木名称" />
        </el-form-item>
        <el-form-item label="收获日期" prop="harvestDate">
          <el-date-picker
            v-model="harvestForm.harvestDate"
            type="date"
            placeholder="选择收获日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="收获产量" prop="yield">
          <el-input v-model.number="harvestForm.yield" placeholder="请输入收获产量" type="number" />
        </el-form-item>
        <el-form-item label="品质等级" prop="quality">
          <el-select v-model="harvestForm.quality" placeholder="请选择品质等级">
            <el-option label="优" value="优" />
            <el-option label="良" value="良" />
            <el-option label="一般" value="一般" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="harvestForm.status" placeholder="请选择状态">
            <el-option label="待收获" value="pending" />
            <el-option label="已收获" value="completed" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="harvestForm.remark" type="textarea" rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitHarvest">保存</el-button>
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
  name: 'HarvestManagement',
  setup() {
    const harvests = ref([]);
    const dialogVisible = ref(false);
    const isEdit = ref(false);
    const dialogTitle = ref('添加收获记录');
    const harvestFormRef = ref(null);
    
    const filterForm = reactive({
      treeId: '',
      status: '',
      harvestDate: ''
    });
    
    const pagination = reactive({
      page: 1,
      limit: 10,
      total: 0
    });
    
    const harvestForm = reactive({
      id: '',
      treeId: '',
      treeName: '',
      harvestDate: '',
      yield: '',
      quality: '良',
      status: 'pending',
      remark: ''
    });
    
    const harvestRules = {
      treeId: [
        { required: true, message: '请输入树木编号', trigger: 'blur' }
      ],
      treeName: [
        { required: true, message: '请输入树木名称', trigger: 'blur' }
      ],
      harvestDate: [
        { required: true, message: '请选择收获日期', trigger: 'blur' }
      ],
      yield: [
        { required: true, message: '请输入收获产量', trigger: 'blur' }
      ],
      quality: [
        { required: true, message: '请选择品质等级', trigger: 'blur' }
      ],
      status: [
        { required: true, message: '请选择状态', trigger: 'blur' }
      ]
    };
    
    const searchHarvests = async () => {
      pagination.page = 1;
      await fetchHarvests();
    };
    
    const resetFilter = () => {
      filterForm.treeId = '';
      filterForm.status = '';
      filterForm.harvestDate = '';
      searchHarvests();
    };
    
    const fetchHarvests = async () => {
      try {
        const params = {
          page: pagination.page,
          limit: pagination.limit,
          ...filterForm
        };
        
        const response = await adminApi.getHarvests(params);
        if (response.success) {
          harvests.value = response.data;
          pagination.total = response.pagination?.total || 0;
        }
      } catch (error) {
        ElMessage.error('获取收获记录失败');
        console.error('获取收获记录失败:', error);
      }
    };
    
    const handleSizeChange = async (size) => {
      pagination.limit = size;
      await fetchHarvests();
    };
    
    const handleCurrentChange = async (current) => {
      pagination.page = current;
      await fetchHarvests();
    };
    
    const openCreateDialog = () => {
      isEdit.value = false;
      dialogTitle.value = '添加收获记录';
      // 重置表单
      Object.assign(harvestForm, {
        id: '',
        treeId: '',
        treeName: '',
        harvestDate: '',
        yield: '',
        quality: '良',
        status: 'pending',
        remark: ''
      });
      dialogVisible.value = true;
    };
    
    const editHarvest = (harvest) => {
      isEdit.value = true;
      dialogTitle.value = '编辑收获记录';
      Object.assign(harvestForm, harvest);
      dialogVisible.value = true;
    };
    
    const completeHarvest = async (harvestId) => {
      try {
        await ElMessageBox.confirm('确定要完成收获吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        });
        
        const response = await adminApi.updateHarvest(harvestId, { status: 'completed' });
        if (response.success) {
          ElMessage.success('收获完成');
          fetchHarvests();
        } else {
          ElMessage.error(response.message);
        }
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('操作失败');
          console.error('完成收获失败:', error);
        }
      }
    };
    
    const submitHarvest = async () => {
      if (!harvestFormRef.value) return;
      
      try {
        await harvestFormRef.value.validate();
        let response;
        
        if (isEdit.value) {
          response = await adminApi.updateHarvest(harvestForm.id, harvestForm);
        } else {
          response = await adminApi.createHarvest(harvestForm);
        }
        
        if (response.success) {
          ElMessage.success(isEdit.value ? '更新成功' : '添加成功');
          dialogVisible.value = false;
          fetchHarvests();
        } else {
          ElMessage.error(response.message);
        }
      } catch (error) {
        ElMessage.error('操作失败，请重试');
        console.error('提交收获记录失败:', error);
      }
    };
    
    const getQualityType = (quality) => {
      switch (quality) {
        case '优': return 'success';
        case '良': return 'primary';
        case '一般': return 'warning';
        default: return '';
      }
    };
    
    onMounted(() => {
      fetchHarvests();
    });
    
    return {
      harvests,
      filterForm,
      pagination,
      dialogVisible,
      isEdit,
      dialogTitle,
      harvestForm,
      harvestRules,
      harvestFormRef,
      searchHarvests,
      resetFilter,
      handleSizeChange,
      handleCurrentChange,
      openCreateDialog,
      editHarvest,
      completeHarvest,
      submitHarvest,
      getQualityType
    };
  }
};
</script>

<style scoped lang="scss">
.harvest-management-container {
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