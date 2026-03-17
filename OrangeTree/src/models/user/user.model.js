const { Model } = require('objection');
const { user: db } = require('../../config/database.config');

// 不要使用全局Model.knex()，而是在类中设置

class User extends Model {
  static get tableName() {
    return 'user_users';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['phone', 'password', 'nickname'],
      properties: {
        id: { type: 'integer' },
        phone: { type: 'string', minLength: 11, maxLength: 20 },
        password: { type: 'string', minLength: 4 },
        nickname: { type: 'string', maxLength: 50 },
        avatar: { type: 'string', maxLength: 500 },
        status: { type: 'string', enum: ['active', 'disabled'], default: 'active' },
        is_deleted: { type: 'integer', enum: [0, 1], default: 0 },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    const Adoption = require('./adoption.model');
    const Interaction = require('./interaction.model');

    return {
      adoptions: {
        relation: Model.HasManyRelation,
        modelClass: Adoption,
        join: {
          from: 'user_users.id',
          to: 'user_adoptions.user_id'
        }
      },
      interactions: {
        relation: Model.HasManyRelation,
        modelClass: Interaction,
        join: {
          from: 'user_users.id',
          to: 'user_interactions.user_id'
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
User.knex(db);

module.exports = User;