const { admin: adminDb } = require('./src/config/database.config');

async function checkAdminPasswords() {
  try {
    console.log('检查管理员密码...\n');
    
    const admins = await adminDb('admin_users').select('id', 'username', 'real_name', 'password', 'status');
    console.log('👤 管理员信息:');
    console.table(admins);
    
    console.log('\n💡 提示：密码是明文存储的，可以直接使用');
  } catch (error) {
    console.error('❌ 检查失败:', error.message);
  } finally {
    await adminDb.destroy();
  }
}

checkAdminPasswords();