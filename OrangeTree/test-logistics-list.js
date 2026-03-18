const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function testLogisticsList() {
  let userToken = '';
  
  try {
    console.log('=== 物流列表功能测试 ===\n');
    
    // 1. 用户登录
    console.log('1. 用户登录 (账号: 12345, 密码: 1111)...');
    const userLoginResponse = await axios.post(`${API_BASE_URL}/user/login`, {
      phone: '12345',
      password: '1111'
    });
    userToken = userLoginResponse.data.data.token;
    console.log('✅ 用户登录成功');
    console.log('Token:', userToken.substring(0, 50) + '...');
    console.log('');
    
    // 2. 获取物流列表
    console.log('2. 获取物流列表...');
    const logisticsResponse = await axios.get(`${API_BASE_URL}/user/logistics`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log('✅ 获取物流列表成功');
    console.log('物流数量:', logisticsResponse.data.data.length);
    console.log('分页信息:', logisticsResponse.data.pagination);
    console.log('');
    
    // 3. 查看第一条物流详情
    if (logisticsResponse.data.data.length > 0) {
      const firstLogistics = logisticsResponse.data.data[0];
      console.log('3. 查看第一条物流详情...');
      console.log('物流ID:', firstLogistics.id);
      console.log('订单ID:', firstLogistics.adopt_id);
      console.log('物流状态:', firstLogistics.status);
      console.log('');
      
      // 4. 测试筛选功能 - 只看待发货的物流
      console.log('4. 测试筛选功能 - 只看待发货的物流...');
      const pendingResponse = await axios.get(`${API_BASE_URL}/user/logistics?status=pending`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      console.log('✅ 筛选待发货物流成功');
      console.log('待发货物流数量:', pendingResponse.data.data.length);
      console.log('');
      
      // 5. 测试分页功能
      console.log('5. 测试分页功能 - 每页5条...');
      const page2Response = await axios.get(`${API_BASE_URL}/user/logistics?page=2&limit=5`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      console.log('✅ 分页查询成功');
      console.log('第二页物流数量:', page2Response.data.data.length);
      console.log('分页信息:', page2Response.data.pagination);
    }
    
    console.log('\n🎉 物流列表功能测试完成！');
    
  } catch (error) {
    console.error('\n❌ 测试失败！');
    if (error.response) {
      console.error('状态码:', error.response.status);
      console.error('错误信息:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('错误信息:', error.message);
    }
  }
}

testLogisticsList();