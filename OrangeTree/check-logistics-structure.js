const { user: userDb } = require('./src/config/database.config');

async function checkLogisticsTable() {
  try {
    console.log('检查物流表结构和数据...\n');
    
    await userDb.raw('SELECT 1');
    console.log('✅ 数据库连接成功\n');
    
    const result = await userDb.raw(
      "SHOW TABLES LIKE 'user_logistics'"
    );
    
    if (result[0].length > 0) {
      console.log('✅ user_logistics表存在\n');
      
      const tableInfo = await userDb.raw('DESCRIBE user_logistics');
      console.log('📋 user_logistics表结构:');
      console.table(tableInfo[0]);
      
      const logistics = await userDb('user_logistics').select('*').limit(5);
      console.log('\n📦 物流数据示例:');
      console.table(logistics);
      
      const count = await userDb('user_logistics').count('* as total').first();
      console.log(`\n📊 物流记录总数: ${count.total}`);
      
      const adoptions = await userDb('user_adoptions').select('id', 'user_id').limit(5);
      console.log('\n📋 认养订单数据示例:');
      console.table(adoptions);
    } else {
      console.log('❌ user_logistics表不存在');
    }
  } catch (error) {
    console.error('❌ 检查失败:', error.message);
  } finally {
    await userDb.destroy();
  }
}

checkLogisticsTable();