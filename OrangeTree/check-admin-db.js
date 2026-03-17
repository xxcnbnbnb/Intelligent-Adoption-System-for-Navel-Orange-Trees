const { admin: adminDb } = require('./src/config/database.config');

async function checkAdminDatabase() {
  try {
    // 测试数据库连接
    await adminDb.raw('SELECT 1');
    console.log('数据库连接成功');
    
    // 检查admin_users表是否存在
    const result = await adminDb.raw(
      "SHOW TABLES LIKE 'admin_users'"
    );
    
    if (result[0].length > 0) {
      console.log('admin_users表存在');
      
      // 查看表结构
      const tableInfo = await adminDb.raw('DESCRIBE admin_users');
      console.log('admin_users表结构:');
      console.table(tableInfo[0]);
      
      // 查看数据
      const admins = await adminDb('admin_users').where('is_deleted', 0);
      console.log('管理员数据:');
      console.table(admins);
    } else {
      console.log('admin_users表不存在');
    }
  } catch (error) {
    console.error('数据库检查失败:', error.message);
  } finally {
    // 关闭数据库连接
    await adminDb.destroy();
  }
}

checkAdminDatabase();
