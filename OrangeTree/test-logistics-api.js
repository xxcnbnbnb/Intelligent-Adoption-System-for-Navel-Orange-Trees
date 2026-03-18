const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function testLogisticsAPI() {
  let testToken = '';
  let adminToken = '';
  
  try {
    console.log('=== 物流管理功能测试 ===\n');
    
    // 1. 用户登录获取token
    console.log('1. 用户登录...');
    const userLoginResponse = await axios.post(`${API_BASE_URL}/user/login`, {
      phone: '13811110001',
      password: '1111'
    });
    testToken = userLoginResponse.data.data.token;
    console.log('✅ 用户登录成功\n');
    
    // 2. 管理员登录获取token
    console.log('2. 管理员登录...');
    const adminLoginResponse = await axios.post(`${API_BASE_URL}/admin/login`, {
      username: 'sysadmin',
      password: '8888'
    });
    adminToken = adminLoginResponse.data.data.token;
    console.log('✅ 管理员登录成功\n');
    
    // 3. 测试用户获取物流信息（没有物流信息的情况）
    console.log('3. 测试用户获取物流信息（无物流信息）...');
    try {
      await axios.get(`${API_BASE_URL}/user/adoptions/1/logistics`, {
        headers: { Authorization: `Bearer ${testToken}` }
      });
      console.log('❌ 测试失败：应该返回404错误');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('✅ 正确返回404错误：物流信息不存在\n');
      } else {
        console.log('❌ 错误:', error.message);
      }
    }
    
    // 4. 管理员创建物流信息
    console.log('4. 管理员创建物流信息...');
    const createLogisticsData = {
      adopt_id: 1,
      harvest_batch: 'HB20240318001',
      product_amount: 50.5,
      receiver_name: '张三',
      receiver_phone: '13800138000',
      receiver_address: '北京市朝阳区xxx街道xxx号'
    };
    const createResponse = await axios.post(`${API_BASE_URL}/admin/logistics`, createLogisticsData, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ 创建物流信息成功');
    console.log('物流ID:', createResponse.data.data.id);
    const logisticsId = createResponse.data.data.id;
    console.log('');
    
    // 5. 管理员获取物流列表
    console.log('5. 管理员获取物流列表...');
    const listResponse = await axios.get(`${API_BASE_URL}/admin/logistics`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ 获取物流列表成功');
    console.log('物流数量:', listResponse.data.data.length);
    console.log('');
    
    // 6. 管理员获取物流详情
    console.log('6. 管理员获取物流详情...');
    const detailResponse = await axios.get(`${API_BASE_URL}/admin/logistics/${logisticsId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ 获取物流详情成功');
    console.log('物流状态:', detailResponse.data.data.status);
    console.log('');
    
    // 7. 用户获取物流信息（有物流信息的情况）
    console.log('7. 用户获取物流信息（有物流信息）...');
    const userLogisticsResponse = await axios.get(`${API_BASE_URL}/user/adoptions/1/logistics`, {
      headers: { Authorization: `Bearer ${testToken}` }
    });
    console.log('✅ 用户获取物流信息成功');
    console.log('物流状态:', userLogisticsResponse.data.data.status);
    console.log('');
    
    // 8. 管理员发货
    console.log('8. 管理员发货...');
    const shipResponse = await axios.put(`${API_BASE_URL}/admin/logistics/${logisticsId}/ship`, {
      logistics_company: '顺丰速运',
      logistics_no: 'SF1234567890'
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ 发货成功');
    console.log('物流状态:', shipResponse.data.data.status);
    console.log('');
    
    // 9. 用户确认收货
    console.log('9. 用户确认收货...');
    const receiveResponse = await axios.put(`${API_BASE_URL}/user/logistics/${logisticsId}/receive`, {}, {
      headers: { Authorization: `Bearer ${testToken}` }
    });
    console.log('✅ 确认收货成功');
    console.log('物流状态:', receiveResponse.data.data.status);
    console.log('');
    
    // 10. 管理员更新物流信息
    console.log('10. 管理员更新物流信息...');
    const updateResponse = await axios.put(`${API_BASE_URL}/admin/logistics/${logisticsId}`, {
      receiver_name: '李四',
      receiver_phone: '13900139000'
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ 更新物流信息成功');
    console.log('收货人:', updateResponse.data.data.receiver_name);
    console.log('');
    
    console.log('🎉 所有物流管理功能测试通过！');
    
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

testLogisticsAPI();