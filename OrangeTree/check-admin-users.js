const { admin: adminDb } = require('./src/config/database.config');

async function checkAdminUsers() {
  try {
    console.log('检查管理员表...\n');
    
    await adminDb.raw('SELECT 1');
    console.log('✅ 管理员数据库连接成功\n');
    
    const result = await adminDb.raw(
      "SHOW TABLES LIKE 'admin_users'"
    );
    
    if (result[0].length > 0) {
      console.log('✅ admin_users表存在\n');
      
      const tableInfo = await adminDb.raw('DESCRIBE admin_users');
      console.log('📋 admin_users表结构:');
      console.table(tableInfo[0]);
      
      const admins = await adminDb('admin_users').select('id', 'username', 'real_name', 'status');
      console.log('\n👤 管理员数据:');
      console.table(admins);
      
      const count = await adminDb('admin_users').count('* as total').first();
      console.log(`\n📊 管理员总数: ${count.total}`);
    } else {
      console.log('❌ admin_users表不存在');
    }
  } catch (error) {
    console.error('❌ 检查失败:', error.message);
  } finally {
    await adminDb.destroy();
  }
}

checkAdminUsers();