const { user: userDb } = require('./src/config/database.config');

async function checkUserUsersTable() {
  try {
    // 测试数据库连接
    await userDb.raw('SELECT 1');
    console.log('数据库连接成功');
    
    // 检查user_users表是否存在
    const result = await userDb.raw(
      "SHOW TABLES LIKE 'user_users'"
    );
    
    if (result[0].length > 0) {
      console.log('user_users表存在');
      
      // 查看表结构
      const tableInfo = await userDb.raw('DESCRIBE user_users');
      console.log('user_users表结构:');
      console.table(tableInfo[0]);
      
      // 查看数据
      const users = await userDb('user_users').limit(5);
      console.log('用户数据:');
      console.table(users);
    } else {
      console.log('user_users表不存在');
    }
  } catch (error) {
    console.error('数据库检查失败:', error.message);
  } finally {
    // 关闭数据库连接
    await userDb.destroy();
  }
}

checkUserUsersTable();
