const { user: userDb } = require('./src/config/database.config');

async function checkUserTreeTable() {
  try {
    // 测试数据库连接
    await userDb.raw('SELECT 1');
    console.log('数据库连接成功');
    
    // 检查trees表是否存在
    const result = await userDb.raw(
      "SHOW TABLES LIKE 'trees'"
    );
    
    if (result[0].length > 0) {
      console.log('trees表存在');
      
      // 查看表结构
      const tableInfo = await userDb.raw('DESCRIBE trees');
      console.log('trees表结构:');
      console.table(tableInfo[0]);
      
      // 查看数据
      const trees = await userDb('trees').limit(3);
      console.log('树木数据:');
      console.table(trees);
    } else {
      console.log('trees表不存在');
    }
  } catch (error) {
    console.error('数据库检查失败:', error.message);
  } finally {
    // 关闭数据库连接
    await userDb.destroy();
  }
}

checkUserTreeTable();
