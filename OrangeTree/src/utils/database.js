const { user: userDb, admin: adminDb } = require('../config/database.config');

/**
 * 数据库事务包装函数
 * 提供事务管理功能，确保多个数据库操作的原子性
 * 
 * @param {Function} callback - 在事务中执行的回调函数
 * @param {Object} callback.trx - Knex事务对象，传递给回调函数
 * @param {string} [type='user'] - 数据库类型，'user' 或 'admin'
 * @returns {Promise<any>} 返回回调函数的执行结果
 * @throws {Error} 如果回调函数执行失败，事务会自动回滚并抛出错误
 * 
 * @example
 * const result = await transaction(async (trx) => {
 *   await Model1.query(trx).insert(data1);
 *   await Model2.query(trx).insert(data2);
 *   return result;
 * }, 'user');
 */
async function transaction(callback, type = 'user') {
  // 根据类型选择数据库连接
  const db = type === 'admin' ? adminDb : userDb;
  
  // 开始一个新的事务
  const trx = await db.transaction();

  try {
    // 执行传入的回调函数，将事务对象传递给回调
    // 回调函数可以使用trx来执行所有数据库操作
    const result = await callback(trx);
    
    // 如果所有操作都成功，提交事务
    // 此时所有更改才会真正写入数据库
    await trx.commit();
    
    // 返回回调函数的执行结果
    return result;
  } catch (error) {
    // 如果回调函数执行过程中出现任何错误
    // 回滚事务，撤销所有未提交的更改
    await trx.rollback();
    
    // 重新抛出错误，让调用者处理
    throw error;
  }
}

/**
 * 导出数据库工具函数和数据库连接对象
 */
module.exports = {
  transaction,  // 事务包装函数
  user: userDb,  // 用户数据库连接
  admin: adminDb // 管理员数据库连接
};