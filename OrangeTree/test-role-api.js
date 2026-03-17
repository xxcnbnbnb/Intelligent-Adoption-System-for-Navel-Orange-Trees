const axios = require('axios');

const apiUrl = 'http://localhost:3000/api';
let token = '';

// 登录获取token
async function login() {
  try {
    const response = await axios.post(`${apiUrl}/admin/login`, {
      username: 'sysadmin',
      password: '8888'
    });
    token = response.data.data.token;
    console.log('登录成功，获取到token');
  } catch (error) {
    console.error('登录失败:', error.message);
  }
}

// 测试获取角色列表
async function testGetRoles() {
  try {
    const response = await axios.get(`${apiUrl}/admin/roles`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('获取角色列表成功:');
    console.table(response.data.data);
  } catch (error) {
    console.error('获取角色列表失败:', error.message);
  }
}

// 测试创建角色
async function testCreateRole() {
  try {
    const response = await axios.post(`${apiUrl}/admin/roles`, {
      role_name: '测试角色',
      permissions: {
        user: ['read', 'write'],
        tree: ['read'],
        adoption: ['read']
      }
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('创建角色成功:');
    console.log(response.data.data);
  } catch (error) {
    console.error('创建角色失败:', error.message);
  }
}

// 测试更新角色
async function testUpdateRole(roleId) {
  try {
    const response = await axios.put(`${apiUrl}/admin/roles/${roleId}`, {
      role_name: '更新后的测试角色',
      permissions: {
        user: ['read', 'write', 'delete'],
        tree: ['read', 'write'],
        adoption: ['read', 'write']
      }
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('更新角色成功:');
    console.log(response.data.data);
  } catch (error) {
    console.error('更新角色失败:', error.message);
  }
}

// 测试删除角色
async function testDeleteRole(roleId) {
  try {
    const response = await axios.delete(`${apiUrl}/admin/roles/${roleId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('删除角色成功:');
    console.log(response.data.message);
  } catch (error) {
    console.error('删除角色失败:', error.message);
  }
}

// 主测试函数
async function runTests() {
  await login();
  await testGetRoles();
  await testCreateRole();
  // 等待创建角色完成
  await new Promise(resolve => setTimeout(resolve, 1000));
  await testGetRoles();
  // 假设最新创建的角色ID是3
  await testUpdateRole(3);
  // 等待更新角色完成
  await new Promise(resolve => setTimeout(resolve, 1000));
  await testGetRoles();
  // 测试删除角色
  await testDeleteRole(3);
  // 等待删除角色完成
  await new Promise(resolve => setTimeout(resolve, 1000));
  await testGetRoles();
}

runTests();
