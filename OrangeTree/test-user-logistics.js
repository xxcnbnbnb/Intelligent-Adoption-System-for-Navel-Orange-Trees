const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function testUserLogistics() {
  let userToken = '';
  
  try {
    console.log('=== 用户物流查看功能测试 ===\n');
    
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
    
    // 2. 获取用户订单列表
    console.log('2. 获取用户订单列表...');
    const ordersResponse = await axios.get(`${API_BASE_URL}/user/adoptions`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log('✅ 获取订单列表成功');
    console.log('订单数量:', ordersResponse.data.data.length);
    
    if (ordersResponse.data.data.length > 0) {
      const firstOrder = ordersResponse.data.data[0];
      console.log('第一个订单ID:', firstOrder.id);
      console.log('订单状态:', firstOrder.pay_status);
      console.log('');
      
      // 3. 查看第一个订单的物流信息
      console.log('3. 查看第一个订单的物流信息...');
      try {
        const logisticsResponse = await axios.get(`${API_BASE_URL}/user/adoptions/${firstOrder.id}/logistics`, {
          headers: { Authorization: `Bearer ${userToken}` }
        });
        console.log('✅ 获取物流信息成功');
        console.log('物流信息:', JSON.stringify(logisticsResponse.data.data, null, 2));
        console.log('');
        
        // 4. 测试确认收货（如果物流状态为已发货）
        if (logisticsResponse.data.data && logisticsResponse.data.data.status === 'shipped') {
          console.log('4. 测试确认收货...');
          const receiveResponse = await axios.put(`${API_BASE_URL}/user/logistics/${logisticsResponse.data.data.id}/receive`, {}, {
            headers: { Authorization: `Bearer ${userToken}` }
          });
          console.log('✅ 确认收货成功');
          console.log('更新后的物流状态:', receiveResponse.data.data.status);
          console.log('');
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log('ℹ️ 该订单暂无物流信息');
        } else {
          console.error('❌ 获取物流信息失败:', error.message);
          if (error.response) {
            console.error('错误详情:', JSON.stringify(error.response.data, null, 2));
          }
        }
      }
    } else {
      console.log('ℹ️ 用户暂无订单');
    }
    
    console.log('\n🎉 用户物流查看功能测试完成！');
    
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

testUserLogistics();