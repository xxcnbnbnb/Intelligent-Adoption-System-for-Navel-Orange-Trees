const { Model } = require('objection');
const { admin: db } = require('../../config/database.config');

// 不要使用全局Model.knex()，而是在类中设置

class OperationLog extends Model {
  static get tableName() {
    return 'admin_operation_logs';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['admin_id', 'role_id', 'operation_module', 'operation_desc', 'operation_ip', 'operation_time'],
      properties: {
        id: { type: 'integer' },
        admin_id: { type: 'integer' },
        role_id: { type: 'integer' },
        operation_module: { type: 'string', maxLength: 100 },
        operation_desc: { type: 'string' },
        operation_ip: { type: 'string', maxLength: 50 },
        operation_time: { type: 'string', format: 'date-time' },
        created_at: { type: 'string', format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    const Admin = require('./admin.model');
    const Role = require('./role.model');

    return {
      admin: {
        relation: Model.BelongsToOneRelation,
        modelClass: Admin,
        join: {
          from: 'admin_operation_logs.admin_id',
          to: 'admin_users.id'
        }
      },
      role: {
        relation: Model.BelongsToOneRelation,
        modelClass: Role,
        join: {
          from: 'admin_operation_logs.role_id',
          to: 'admin_roles.id'
        }
      }
    };
  }

  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext);
    this.created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
  }
}

// 设置数据库连接
OperationLog.knex(db);

module.exports = OperationLog;