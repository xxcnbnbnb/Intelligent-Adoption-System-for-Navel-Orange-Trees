const { admin: adminDb, user: userDb } = require('./src/config/database.config');

async function checkAllTables() {
  try {
    // 检查管理员数据库的所有表
    console.log('=== 管理员数据库表 ===');
    const adminTables = await adminDb.raw('SHOW TABLES');
    console.table(adminTables[0]);
    
    // 检查用户数据库的所有表
    console.log('\n=== 用户数据库表 ===');
    const userTables = await userDb.raw('SHOW TABLES');
    console.table(userTables[0]);
  } catch (error) {
    console.error('数据库检查失败:', error.message);
  } finally {
    // 关闭数据库连接
    await adminDb.destroy();
    await userDb.destroy();
  }
}

checkAllTables();
