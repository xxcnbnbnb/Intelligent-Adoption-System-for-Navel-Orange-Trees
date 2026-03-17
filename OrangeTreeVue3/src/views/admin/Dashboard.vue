<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h2>仪表盘</h2>
      <p>欢迎回来，{{ adminStore.adminInfo?.real_name || '管理员' }}</p>
    </div>
    
    <div class="dashboard-charts">
      <div class="chart-card">
        <h3>树木状态分布</h3>
        <div ref="pieChartRef" class="chart-container"></div>
      </div>
      
      <div class="chart-card">
        <h3>用户活跃度</h3>
        <div ref="doughnutChartRef" class="chart-container"></div>
      </div>
      
      <div class="chart-card chart-card-full">
        <h3>核心数据统计</h3>
        <div ref="barChartRef" class="chart-container"></div>
      </div>
    </div>
    
    <div class="dashboard-content">
      <div class="content-card">
        <h3>最近操作</h3>
        <div class="operation-list">
          <div class="operation-item">
            <div class="operation-time">2026-03-06 10:30</div>
            <div class="operation-desc">管理员 admin 创建了新的树木管理记录</div>
          </div>
          <div class="operation-item">
            <div class="operation-time">2026-03-06 09:15</div>
            <div class="operation-desc">管理员 admin 更新了收获记录</div>
          </div>
          <div class="operation-item">
            <div class="operation-time">2026-03-05 16:45</div>
            <div class="operation-desc">用户 张三 认养了树木 TREE001</div>
          </div>
        </div>
      </div>
      
      <div class="content-card">
        <h3>系统状态</h3>
        <div class="status-list">
          <div class="status-item">
            <span class="status-label">API服务</span>
            <span class="status-value status-success">运行中</span>
          </div>
          <div class="status-item">
            <span class="status-label">数据库</span>
            <span class="status-value status-success">连接正常</span>
          </div>
          <div class="status-item">
            <span class="status-label">缓存</span>
            <span class="status-value status-success">正常</span>
          </div>
          <div class="status-item">
            <span class="status-label">存储空间</span>
            <span class="status-value status-warning">75%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { useAdminStore } from '../../store';
import * as echarts from 'echarts';

export default {
  name: 'Dashboard',
  setup() {
    const adminStore = useAdminStore();
    const barChartRef = ref(null);
    const pieChartRef = ref(null);
    const doughnutChartRef = ref(null);
    
    let barChart = null;
    let pieChart = null;
    let doughnutChart = null;
    
    const initBarChart = () => {
      if (!barChartRef.value) return;
      
      barChart = echarts.init(barChartRef.value);
      
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['树木总数', '认养订单', '用户数量', '收获批次'],
          axisLabel: {
            color: '#666'
          },
          axisLine: {
            lineStyle: {
              color: '#ddd'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#666'
          },
          axisLine: {
            lineStyle: {
              color: '#ddd'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#f0f0f0'
            }
          }
        },
        series: [
          {
            name: '数量',
            type: 'bar',
            data: [120, 85, 200, 12],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#188df0' },
                { offset: 1, color: '#188df0' }
              ]),
              borderRadius: [5, 5, 0, 0]
            },
            barWidth: '50%',
            label: {
              show: true,
              position: 'top',
              color: '#333',
              fontWeight: 'bold'
            }
          }
        ]
      };
      
      barChart.setOption(option);
    };
    
    const initPieChart = () => {
      if (!pieChartRef.value) return;
      
      pieChart = echarts.init(pieChartRef.value);
      
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 'right',
          bottom: 'bottom'
        },
        series: [
          {
            name: '树木状态',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              formatter: '{b}: {d}%'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
                fontWeight: 'bold'
              }
            },
            data: [
              { value: 85, name: '已认养', itemStyle: { color: '#5470c6' } },
              { value: 35, name: '未认养', itemStyle: { color: '#91cc75' } }
            ]
          }
        ]
      };
      
      pieChart.setOption(option);
    };
    
    const initDoughnutChart = () => {
      if (!doughnutChartRef.value) return;
      
      doughnutChart = echarts.init(doughnutChartRef.value);
      
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 'right',
          bottom: 'bottom'
        },
        series: [
          {
            name: '用户活跃度',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              position: 'outside',
              formatter: '{b}: {d}%'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
                fontWeight: 'bold'
              }
            },
            data: [
              { value: 120, name: '活跃用户', itemStyle: { color: '#ee6666' } },
              { value: 50, name: '普通用户', itemStyle: { color: '#73c0de' } },
              { value: 30, name: '沉睡用户', itemStyle: { color: '#fac858' } }
            ]
          }
        ]
      };
      
      doughnutChart.setOption(option);
    };
    
    const handleResize = () => {
      if (barChart) barChart.resize();
      if (pieChart) pieChart.resize();
      if (doughnutChart) doughnutChart.resize();
    };
    
    onMounted(() => {
      initBarChart();
      initPieChart();
      initDoughnutChart();
      
      window.addEventListener('resize', handleResize);
    });
    
    onUnmounted(() => {
      if (barChart) {
        barChart.dispose();
        barChart = null;
      }
      if (pieChart) {
        pieChart.dispose();
        pieChart = null;
      }
      if (doughnutChart) {
        doughnutChart.dispose();
        doughnutChart = null;
      }
      
      window.removeEventListener('resize', handleResize);
    });
    
    return {
      adminStore,
      barChartRef,
      pieChartRef,
      doughnutChartRef
    };
  }
};
</script>

<style scoped>
.dashboard {
  padding: var(--spacing-md);
}

.dashboard-header {
  margin-bottom: var(--spacing-lg);
}

.dashboard-header h2 {
  margin-bottom: var(--spacing-xs);
  color: var(--text-color);
}

.dashboard-header p {
  color: var(--text-light);
  font-size: var(--font-size-sm);
}

.dashboard-charts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.chart-card {
  background-color: var(--white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-md);
  min-height: 400px;
}

.chart-card-full {
  grid-column: span 2;
  width: 100%;
  margin: 0 auto;
}

.chart-card h3 {
  margin-bottom: var(--spacing-md);
  color: var(--text-color);
  font-size: var(--font-size-md);
}

.chart-container {
  width: 100%;
  height: 320px;
}

.dashboard-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--spacing-md);
}

.content-card {
  background-color: var(--white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-md);
}

.content-card h3 {
  margin-bottom: var(--spacing-md);
  color: var(--text-color);
  font-size: var(--font-size-md);
}

.operation-list {
  space-y: var(--spacing-sm);
}

.operation-item {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid var(--border-color);
}

.operation-item:last-child {
  border-bottom: none;
}

.operation-time {
  font-size: var(--font-size-sm);
  color: var(--text-light);
  min-width: 120px;
}

.operation-desc {
  flex: 1;
  font-size: var(--font-size-sm);
  color: var(--text-color);
}

.status-list {
  space-y: var(--spacing-sm);
}

.status-item {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid var(--border-color);
}

.status-item:last-child {
  border-bottom: none;
}

.status-label {
  font-size: var(--font-size-sm);
  color: var(--text-color);
}

.status-value {
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.status-success {
  color: var(--success-color);
}

.status-warning {
  color: var(--warning-color);
}

.status-error {
  color: var(--error-color);
}

@media (max-width: 768px) {
  .dashboard-charts {
    grid-template-columns: 1fr;
  }
  
  .chart-card-full {
    grid-column: span 1;
    max-width: 100%;
  }
  
  .dashboard-content {
    grid-template-columns: 1fr;
  }
  
  .chart-card {
    min-height: 350px;
  }
  
  .chart-container {
    height: 280px;
  }
}
</style>
