const { admin: adminDb } = require('./src/config/database.config');

async function checkDatabase() {
  try {
    // 测试数据库连接
    await adminDb.raw('SELECT 1');
    console.log('数据库连接成功');
    
    // 检查admin_roles表是否存在
    const result = await adminDb.raw(
      "SHOW TABLES LIKE 'admin_roles'"
    );
    
    if (result[0].length > 0) {
      console.log('admin_roles表存在');
      
      // 查看表结构
      const tableInfo = await adminDb.raw('DESCRIBE admin_roles');
      console.log('admin_roles表结构:');
      console.table(tableInfo[0]);
      
      // 查看数据
      const roles = await adminDb('admin_roles').where('is_deleted', 0);
      console.log('角色数据:');
      console.table(roles);
    } else {
      console.log('admin_roles表不存在');
    }
  } catch (error) {
    console.error('数据库检查失败:', error.message);
  } finally {
    // 关闭数据库连接
    await adminDb.destroy();
  }
}

checkDatabase();
