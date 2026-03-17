// 模拟前端发送的数据
const frontEndData = {
  role_name: '测试角色',
  permissions: {
    user: ['read', 'write'],
    tree: ['read'],
    adoption: ['read']
  }
};

console.log('前端发送的数据:');
console.log(frontEndData);

// 模拟转换逻辑
if (frontEndData.permissions && typeof frontEndData.permissions === 'object' && !Array.isArray(frontEndData.permissions)) {
  const { user = [], tree = [], adoption = [] } = frontEndData.permissions;
  frontEndData.permissions = [
    ...user.map(action => `user:${action}`),
    ...tree.map(action => `tree:${action}`),
    ...adoption.map(action => `adoption:${action}`)
  ];
}

console.log('转换后的数据:');
console.log(frontEndData);
console.log('permissions类型:', typeof frontEndData.permissions);
console.log('permissions是否为数组:', Array.isArray(frontEndData.permissions));
if (Array.isArray(frontEndData.permissions)) {
  console.log('permissions数组长度:', frontEndData.permissions.length);
  console.log('permissions数组内容:', frontEndData.permissions);
}
