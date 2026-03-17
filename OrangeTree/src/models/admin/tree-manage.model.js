const { Model } = require('objection');
const { admin: db } = require('../../config/database.config');

// 不要使用全局Model.knex()，而是在类中设置

class TreeManage extends Model {
  static get tableName() {
    return 'admin_tree_manage';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['tree_id', 'manage_status', 'batch_no', 'import_source', 'operator_id'],
      properties: {
        id: { type: 'integer' },
        tree_id: { type: 'integer' },
        manage_status: { type: 'string', enum: ['normal', 'abnormal', 'pruning'], default: 'normal' },
        batch_no: { type: 'string', maxLength: 50 },
        import_source: { type: 'string', maxLength: 200 },
        operator_id: { type: 'integer' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    const Admin = require('./admin.model');

    return {
      operator: {
        relation: Model.BelongsToOneRelation,
        modelClass: Admin,
        join: {
          from: 'admin_tree_manage.operator_id',
          to: 'admin_users.id'
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
TreeManage.knex(db);

module.exports = TreeManage;