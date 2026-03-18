const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function testRegister() {
  const testUser = {
    phone: '18888888888',
    password: 'test123456',
    nickname: '测试用户'
  };

  try {
    console.log('开始测试用户注册功能...');
    console.log('注册信息:', testUser);
    
    const response = await axios.post(`${API_BASE_URL}/user/register`, testUser);
    
    console.log('\n✅ 注册成功！');
    console.log('响应数据:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('\n❌ 注册失败！');
    if (error.response) {
      console.error('状态码:', error.response.status);
      console.error('错误信息:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('请求失败，无响应:', error.message);
    } else {
      console.error('请求配置错误:', error.message);
    }
    throw error;
  }
}

async function testDuplicateRegister() {
  const testUser = {
    phone: '18888888888',
    password: 'test123456',
    nickname: '测试用户'
  };

  try {
    console.log('\n开始测试重复注册（应该失败）...');
    console.log('注册信息:', testUser);
    
    const response = await axios.post(`${API_BASE_URL}/user/register`, testUser);
    
    console.log('❌ 测试失败：重复注册应该返回错误，但返回了成功');
    console.log('响应数据:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (error.response && error.response.status === 409) {
      console.log('✅ 重复注册测试成功！正确返回了409错误');
      console.log('错误信息:', error.response.data.message);
    } else {
      console.error('❌ 重复注册测试失败！');
      console.error('错误信息:', error.message);
    }
  }
}

async function testLogin() {
  const loginData = {
    phone: '18888888888',
    password: 'test123456'
  };

  try {
    console.log('\n开始测试用户登录功能...');
    console.log('登录信息:', { phone: loginData.phone, password: '***' });
    
    const response = await axios.post(`${API_BASE_URL}/user/login`, loginData);
    
    console.log('\n✅ 登录成功！');
    console.log('用户信息:', JSON.stringify(response.data.data.user, null, 2));
    console.log('Token:', response.data.data.token.substring(0, 50) + '...');
    
    return response.data;
  } catch (error) {
    console.error('\n❌ 登录失败！');
    if (error.response) {
      console.error('状态码:', error.response.status);
      console.error('错误信息:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('错误信息:', error.message);
    }
    throw error;
  }
}

async function main() {
  try {
    await testRegister();
    await testDuplicateRegister();
    await testLogin();
    console.log('\n🎉 所有测试通过！');
  } catch (error) {
    console.error('\n测试过程中出现错误:', error.message);
  }
}

main();