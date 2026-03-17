<template>
  <div class="interaction-container">
    <el-card>
      <template #header>
        <h2>树木互动</h2>
      </template>
      
      <div class="interaction-content">
        <div class="blessing-section">
          <h3>留下祝福</h3>
          <el-form :model="blessingForm" :rules="blessingRules" ref="blessingFormRef" label-width="80px">
            <el-form-item label="祝福内容" prop="content">
              <el-input v-model="blessingForm.content" type="textarea" rows="4" placeholder="请输入您的祝福" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitBlessing">提交祝福</el-button>
            </el-form-item>
          </el-form>
        </div>
        
        <div class="interaction-list">
          <h3>互动记录</h3>
          <el-timeline>
            <el-timeline-item
              v-for="(interaction, index) in interactions"
              :key="interaction.id"
              :timestamp="interaction.createdAt"
              :type="getInteractionType(interaction.type)"
            >
              <el-card>
                <div class="interaction-item">
                  <div class="interaction-header">
                    <span class="interaction-type">{{ getInteractionText(interaction.type) }}</span>
                    <span class="interaction-user">{{ interaction.userName }}</span>
                  </div>
                  <div class="interaction-content">{{ interaction.content }}</div>
                  <div class="interaction-media" v-if="interaction.images && interaction.images.length > 0">
                    <el-image
                      v-for="(image, imgIndex) in interaction.images"
                      :key="imgIndex"
                      :src="image"
                      :preview-src-list="interaction.images"
                      class="interaction-image"
                    />
                  </div>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
        
        <div class="share-section">
          <h3>分享树木</h3>
          <div class="share-buttons">
            <el-button type="primary" @click="shareToWechat">
              <el-icon><ChatDotRound /></el-icon>
              分享到微信
            </el-button>
            <el-button type="success" @click="shareToWeibo">
              <el-icon><Position /></el-icon>
              分享到微博
            </el-button>
            <el-button type="info" @click="copyLink">
              <el-icon><Link /></el-icon>
              复制链接
            </el-button>
          </div>
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
import { ChatDotRound, Position, Link } from '@element-plus/icons-vue';

export default {
  name: 'Interaction',
  setup() {
    const route = useRoute();
    const treeId = computed(() => route.params.treeId);
    const blessingFormRef = ref(null);
    const interactions = ref([]);
    
    const blessingForm = reactive({
      content: ''
    });
    
    const blessingRules = {
      content: [
        { required: true, message: '请输入祝福内容', trigger: 'blur' },
        { min: 10, message: '祝福内容至少10个字符', trigger: 'blur' }
      ]
    };
    
    const fetchInteractions = async () => {
      try {
        const params = {
          page: 1,
          limit: 20
        };
        
        const response = await userApi.getTreeInteractions(treeId.value, params);
        if (response.success) {
          interactions.value = response.data;
        }
      } catch (error) {
        ElMessage.error('获取互动记录失败');
        console.error('获取互动记录失败:', error);
      }
    };
    
    const submitBlessing = async () => {
      if (!blessingFormRef.value) return;
      
      try {
        await blessingFormRef.value.validate();
        const interactionData = {
          treeId: treeId.value,
          type: 'blessing',
          content: blessingForm.content
        };
        
        const response = await userApi.createInteraction(interactionData);
        if (response.success) {
          ElMessage.success('祝福提交成功');
          blessingForm.content = '';
          fetchInteractions();
        } else {
          ElMessage.error(response.message);
        }
      } catch (error) {
        ElMessage.error('提交失败，请重试');
        console.error('提交祝福失败:', error);
      }
    };
    
    const shareToWechat = () => {
      ElMessage.info('打开微信分享');
    };
    
    const shareToWeibo = () => {
      ElMessage.info('打开微博分享');
    };
    
    const copyLink = async () => {
      try {
        const link = `${window.location.origin}/user/trees/${treeId.value}`;
        await navigator.clipboard.writeText(link);
        ElMessage.success('链接复制成功');
      } catch (error) {
        ElMessage.error('复制失败，请手动复制');
        console.error('复制链接失败:', error);
      }
    };
    
    const getInteractionType = (type) => {
      switch (type) {
        case 'blessing': return 'success';
        case 'naming': return 'primary';
        case 'share': return 'info';
        default: return 'warning';
      }
    };
    
    const getInteractionText = (type) => {
      switch (type) {
        case 'blessing': return '祝福留言';
        case 'naming': return '树木命名';
        case 'share': return '分享';
        default: return type;
      }
    };
    
    onMounted(() => {
      fetchInteractions();
    });
    
    return {
      blessingForm,
      blessingRules,
      blessingFormRef,
      interactions,
      submitBlessing,
      shareToWechat,
      shareToWeibo,
      copyLink,
      getInteractionType,
      getInteractionText
    };
  }
};
</script>

<style scoped lang="scss">
.interaction-container {
  padding: var(--spacing-lg);
}

.interaction-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.blessing-section,
.interaction-list,
.share-section {
  h3 {
    margin-bottom: var(--spacing-md);
    color: var(--text-color);
  }
}

.interaction-item {
  .interaction-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-sm);
    
    .interaction-type {
      font-weight: 500;
      color: var(--text-color);
    }
    
    .interaction-user {
      font-size: var(--font-size-sm);
      color: var(--text-light);
    }
  }
  
  .interaction-content {
    margin-bottom: var(--spacing-sm);
    line-height: 1.6;
  }
  
  .interaction-media {
    margin-top: var(--spacing-sm);
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }
  
  .interaction-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: var(--border-radius-sm);
  }
}

.share-buttons {
  display: flex;
  gap: var(--spacing-md);
}
</style>