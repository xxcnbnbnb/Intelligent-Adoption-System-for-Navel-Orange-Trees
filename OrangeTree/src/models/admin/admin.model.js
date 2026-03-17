const { Model } = require('objection');
const { admin: db } = require('../../config/database.config');

// 不要使用全局Model.knex()，而是在类中设置

class Admin extends Model {
  static get tableName() {
    return 'admin_users';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['username', 'password', 'role_id', 'real_name', 'phone'],
      properties: {
        id: { type: 'integer' },
        username: { type: 'string', maxLength: 50 },
        password: { type: 'string', minLength: 60 },
        role_id: { type: 'integer' },
        real_name: { type: 'string', maxLength: 50 },
        phone: { type: 'string', maxLength: 20 },
        status: { type: 'string', enum: ['active', 'disabled'], default: 'active' },
        last_login_time: { type: 'string', format: 'date-time' },
        is_deleted: { type: 'integer', enum: [0, 1], default: 0 },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    const Role = require('./role.model');
    const OperationLog = require('./operation-log.model');
    const TreeManage = require('./tree-manage.model');
    const HarvestManage = require('./harvest-manage.model');

    return {
      role: {
        relation: Model.BelongsToOneRelation,
        modelClass: Role,
        join: {
          from: 'admin_users.role_id',
          to: 'admin_roles.id'
        }
      },
      operation_logs: {
        relation: Model.HasManyRelation,
        modelClass: OperationLog,
        join: {
          from: 'admin_users.id',
          to: 'admin_operation_logs.admin_id'
        }
      },
      tree_manages: {
        relation: Model.HasManyRelation,
        modelClass: TreeManage,
        join: {
          from: 'admin_users.id',
          to: 'admin_tree_manage.operator_id'
        }
      },
      harvest_manages: {
        relation: Model.HasManyRelation,
        modelClass: HarvestManage,
        join: {
          from: 'admin_users.id',
          to: 'admin_harvest_manage.operator_id'
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
Admin.knex(db);

module.exports = Admin;