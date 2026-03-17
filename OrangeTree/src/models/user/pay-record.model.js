const { Model } = require('objection');
const { user: db } = require('../../config/database.config');

// 不要使用全局Model.knex()，而是在类中设置

class PayRecord extends Model {
  static get tableName() {
    return 'user_pay_records';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['adopt_id', 'user_id', 'pay_amount', 'pay_method', 'trade_no', 'pay_time'],
      properties: {
        id: { type: 'integer' },
        adopt_id: { type: 'integer' },
        user_id: { type: 'integer' },
        pay_amount: { type: 'number', minimum: 0 },
        pay_method: { type: 'string', enum: ['alipay', 'wechat'] },
        trade_no: { type: 'string', maxLength: 100 },
        pay_time: { type: 'string', format: 'date-time' },
        refund_status: { type: 'string', enum: ['no_refund', 'refunded'], default: 'no_refund' },
        refund_time: { type: 'string', format: 'date-time' },
        created_at: { type: 'string', format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    const Adoption = require('./adoption.model');
    const User = require('./user.model');

    return {
      adoption: {
        relation: Model.BelongsToOneRelation,
        modelClass: Adoption,
        join: {
          from: 'user_pay_records.adopt_id',
          to: 'user_adoptions.id'
        }
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'user_pay_records.user_id',
          to: 'user_users.id'
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
PayRecord.knex(db);

module.exports = PayRecord;