const { admin: adminDb } = require('./src/config/database.config');

async function checkTreeManageTable() {
  try {
    // 测试数据库连接
    await adminDb.raw('SELECT 1');
    console.log('数据库连接成功');
    
    // 检查admin_tree_manage表是否存在
    const result = await adminDb.raw(
      "SHOW TABLES LIKE 'admin_tree_manage'"
    );
    
    if (result[0].length > 0) {
      console.log('admin_tree_manage表存在');
      
      // 查看表结构
      const tableInfo = await adminDb.raw('DESCRIBE admin_tree_manage');
      console.log('admin_tree_manage表结构:');
      console.table(tableInfo[0]);
      
      // 查看数据
      const trees = await adminDb('admin_tree_manage').limit(3);
      console.log('树木数据:');
      console.table(trees);
    } else {
      console.log('admin_tree_manage表不存在');
    }
  } catch (error) {
    console.error('数据库检查失败:', error.message);
  } finally {
    // 关闭数据库连接
    await adminDb.destroy();
  }
}

checkTreeManageTable();
