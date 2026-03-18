const { user: userDb } = require('./src/config/database.config');

async function checkUser12345() {
  try {
    console.log('检查用户 12345 的信息...\n');
    
    const users = await userDb('user_users')
      .select('id', 'phone', 'nickname', 'password', 'status')
      .where('phone', '12345');
    
    console.log('👤 用户信息:');
    console.table(users);
    
    if (users.length > 0) {
      console.log('\n💡 提示：密码是明文存储的');
      console.log('登录时需要使用明文密码: 1111');
    } else {
      console.log('❌ 用户 12345 不存在');
    }
  } catch (error) {
    console.error('❌ 检查失败:', error.message);
  } finally {
    await userDb.destroy();
  }
}

checkUser12345();