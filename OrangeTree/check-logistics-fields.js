const { user: userDb } = require('./src/config/database.config');

async function checkLogisticsFields() {
  try {
    console.log('检查物流表字段类型...\n');
    
    const result = await userDb.raw('DESCRIBE user_logistics');
    console.log('📋 user_logistics表字段类型:');
    console.table(result[0]);
  } catch (error) {
    console.error('❌ 检查失败:', error.message);
  } finally {
    await userDb.destroy();
  }
}

checkLogisticsFields();