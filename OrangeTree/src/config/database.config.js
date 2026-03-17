const knex = require('knex');
const userConfig = require('./knexfile.user');
const adminConfig = require('./knexfile.admin');

// 创建用户数据库连接
const userDb = knex(userConfig[process.env.NODE_ENV || 'development']);

// 创建管理员数据库连接
const adminDb = knex(adminConfig[process.env.NODE_ENV || 'development']);

if (process.env.NODE_ENV !== 'test') {
  userDb.on('query', (query) => {
    console.log('SQL (User):', query.sql);
  });
  
  adminDb.on('query', (query) => {
    console.log('SQL (Admin):', query.sql);
  });
}

module.exports = {
  user: userDb,
  admin: adminDb
};