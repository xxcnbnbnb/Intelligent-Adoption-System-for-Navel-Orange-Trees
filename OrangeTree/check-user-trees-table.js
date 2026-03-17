const { user: userDb } = require('./src/config/database.config');

async function checkUserTreesTable() {
  try {
    // 测试数据库连接
    await userDb.raw('SELECT 1');
    console.log('数据库连接成功');
    
    // 检查user_trees表是否存在
    const result = await userDb.raw(
      "SHOW TABLES LIKE 'user_trees'"
    );
    
    if (result[0].length > 0) {
      console.log('user_trees表存在');
      
      // 查看表结构
      const tableInfo = await userDb.raw('DESCRIBE user_trees');
      console.log('user_trees表结构:');
      console.table(tableInfo[0]);
      
      // 查看数据
      const trees = await userDb('user_trees').limit(5);
      console.log('树木数据:');
      console.table(trees);
    } else {
      console.log('user_trees表不存在');
    }
  } catch (error) {
    console.error('数据库检查失败:', error.message);
  } finally {
    // 关闭数据库连接
    await userDb.destroy();
  }
}

checkUserTreesTable();
