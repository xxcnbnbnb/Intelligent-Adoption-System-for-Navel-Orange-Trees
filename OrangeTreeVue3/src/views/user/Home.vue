<template>
  <div class="home-page">
    <div class="main-container">
      <!-- 侧边导航栏 -->
      <aside class="sidebar">
        <h2 class="sidebar-title">核心功能</h2>
        <nav class="sidebar-nav">
          <div class="nav-item" @click="navigateTo('/user/trees')">
            <div class="nav-icon">🌳</div>
            <span class="nav-text">树木浏览</span>
          </div>
          <div class="nav-item" @click="navigateTo('/user/adoptions')">
            <div class="nav-icon">📋</div>
            <span class="nav-text">认养订单</span>
          </div>
          
          <div class="nav-item" @click="navigateTo('/user/adoptions')">
            <div class="nav-icon">�</div>
            <span class="nav-text">认养订单</span>
          </div>
        </nav>
      </aside>
      
      <!-- 主要内容区域 -->
      <div class="content">
        <!-- 欢迎横幅 -->
        <section class="welcome-banner">
          <div class="banner-content">
            <h1>欢迎来到脐橙树认养系统</h1>
            <p>认养一棵属于您的脐橙树，体验田园生活的乐趣</p>
            <router-link to="/user/trees" class="btn btn-primary">开始认养</router-link>
          </div>
        </section>
        
        <!-- 热门树木 -->
        <section class="popular-trees">
          <div class="container">
            <h2 class="section-title">热门树木</h2>
            <div class="trees-grid" v-if="trees.length > 0">
              <div v-for="tree in trees" :key="tree.id" class="tree-card">
                <img :src="tree.cover_img || 'https://via.placeholder.com/300x200'" :alt="tree.tree_no" class="tree-image">
                <div class="tree-info">
                  <h3>{{ tree.tree_no }}</h3>
                  <p class="tree-variety">{{ tree.variety }}</p>
                  <p class="tree-age">树龄: {{ tree.age }}年</p>
                  <p class="tree-price">认养费用: ¥{{ tree.price }}/年</p>
                  <router-link :to="`/user/trees/${tree.id}`" class="btn btn-outline">查看详情</router-link>
                </div>
              </div>
            </div>
            <div v-else class="no-data">
              <p>暂无树木数据</p>
            </div>
          </div>
        </section>
        
        <!-- 认养流程 -->
        <section class="adoption-process">
          <div class="container">
            <h2 class="section-title">认养流程</h2>
            <div class="process-steps">
              <div class="step-item">
                <div class="step-number">1</div>
                <h3>选择树木</h3>
                <p>浏览树木列表，选择适合的脐橙树</p>
              </div>
              <div class="step-item">
                <div class="step-number">2</div>
                <h3>确认认养</h3>
                <p>填写认养信息，确认认养年限</p>
              </div>
              <div class="step-item">
                <div class="step-number">3</div>
                <h3>支付费用</h3>
                <p>完成认养费用的支付</p>
              </div>
              <div class="step-item">
                <div class="step-number">4</div>
                <h3>开始认养</h3>
                <p>获得树木的认养权，开始体验</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTreeStore } from '../../store';

export default {
  name: 'Home',
  setup() {
    const router = useRouter();
    const treeStore = useTreeStore();
    const trees = ref([]);
    
    // 导航到指定页面
    const navigateTo = (path) => {
      router.push(path);
    };
    
    // 获取热门树木
    const getPopularTrees = async () => {
      try {
        await treeStore.getTrees({ page: 1, limit: 4, status: 'available' });
        trees.value = treeStore.trees;
      } catch (error) {
        console.error('获取树木失败:', error);
      }
    };
    
    onMounted(() => {
      getPopularTrees();
    });
    
    return {
      trees,
      navigateTo
    };
  }
};
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

.welcome-banner {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: var(--white);
  padding: var(--spacing-xl) 0;
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.banner-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.banner-content h1 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-md);
}

.banner-content p {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-lg);
  opacity: 0.9;
}

.section-title {
  text-align: center;
  margin-bottom: var(--spacing-lg);
  color: var(--text-color);
  font-size: var(--font-size-xl);
}

.main-container {
  display: flex;
  gap: var(--spacing-lg);
  margin: 0 var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

/* 侧边导航栏样式 */
.sidebar {
  width: 250px;
  background-color: var(--white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-lg);
  flex-shrink: 0;
}

.sidebar-title {
  font-size: var(--font-size-lg);
  color: var(--text-color);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.nav-item:hover {
  background-color: var(--primary-light);
  transform: translateX(5px);
}

.nav-icon {
  font-size: 1.5rem;
  width: 40px;
  text-align: center;
}

.nav-text {
  font-size: var(--font-size-md);
  color: var(--text-color);
}

/* 主要内容区域样式 */
.content {
  flex: 1;
  min-width: 0; /* 防止flex子元素溢出 */
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
  }
  
  .sidebar-nav {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: var(--spacing-sm);
  }
  
  .nav-item {
    flex-shrink: 0;
  }
}

.popular-trees {
  margin-bottom: var(--spacing-xl);
}

.trees-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.tree-card {
  background-color: var(--white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: all var(--transition-normal);
}

.tree-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-5px);
}

.tree-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.tree-info {
  padding: var(--spacing-md);
}

.tree-info h3 {
  margin-bottom: var(--spacing-xs);
  color: var(--text-color);
}

.tree-variety {
  color: var(--primary-color);
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
}

.tree-age {
  color: var(--text-light);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-xs);
}

.tree-price {
  color: var(--accent-color);
  font-weight: 500;
  margin-bottom: var(--spacing-md);
}

.adoption-process {
  background-color: var(--white);
  padding: var(--spacing-xl) 0;
  margin-bottom: var(--spacing-xl);
}

.process-steps {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
}

.step-item {
  flex: 1;
  min-width: 200px;
  text-align: center;
  position: relative;
}

.step-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: var(--primary-color);
  color: var(--white);
  border-radius: 50%;
  font-weight: bold;
  margin-bottom: var(--spacing-md);
}

.step-item h3 {
  margin-bottom: var(--spacing-sm);
  color: var(--text-color);
}

.step-item p {
  color: var(--text-light);
  font-size: var(--font-size-sm);
}

.no-data {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--text-light);
}

@media (max-width: 768px) {
  .banner-content h1 {
    font-size: var(--font-size-lg);
  }
  
  .banner-content p {
    font-size: var(--font-size-md);
  }
  
  .section-title {
    font-size: var(--font-size-lg);
  }
  
  .modules-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  
  .trees-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
  
  .process-steps {
    flex-direction: column;
    align-items: center;
  }
  
  .step-item {
    width: 100%;
    max-width: 300px;
  }
}
</style>