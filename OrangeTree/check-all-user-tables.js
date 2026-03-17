const { user: userDb } = require('./src/config/database.config');

async function checkAllUserTables() {
  try {
    // 测试数据库连接
    await userDb.raw('SELECT 1');
    console.log('数据库连接成功');
    
    // 查看所有表
    const result = await userDb.raw('SHOW TABLES');
    console.log('user数据库中的所有表:');
    console.table(result[0]);
  } catch (error) {
    console.error('数据库检查失败:', error.message);
  } finally {
    // 关闭数据库连接
    await userDb.destroy();
  }
}

checkAllUserTables();
