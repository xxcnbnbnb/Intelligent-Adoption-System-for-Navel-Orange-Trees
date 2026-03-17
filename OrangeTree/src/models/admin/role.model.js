const { Model } = require('objection');
const { admin: db } = require('../../config/database.config');

// 不要使用全局Model.knex()，而是在类中设置

class Role extends Model {
  static get tableName() {
    return 'admin_roles';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['role_name', 'permissions'],
      properties: {
        id: { type: 'integer' },
        role_name: { type: 'string', maxLength: 50 },
        permissions: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        is_deleted: { type: 'integer', enum: [0, 1], default: 0 },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    const Admin = require('./admin.model');
    const OperationLog = require('./operation-log.model');

    return {
      admins: {
        relation: Model.HasManyRelation,
        modelClass: Admin,
        join: {
          from: 'admin_roles.id',
          to: 'admin_users.role_id'
        }
      },
      operation_logs: {
        relation: Model.HasManyRelation,
        modelClass: OperationLog,
        join: {
          from: 'admin_roles.id',
          to: 'admin_operation_logs.role_id'
        }
      }
    };
  }

  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext);
    this.created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    this.updated_at = this.created_at;
  }

  async $beforeUpdate(opt, queryContext) {
    await super.$beforeUpdate(opt, queryContext);
    this.updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
  }
}

// 设置数据库连接
Role.knex(db);

module.exports = Role;