const { Model } = require('objection');
const { user: db } = require('../../config/database.config');

// 不要使用全局Model.knex()，而是在类中设置

class Interaction extends Model {
  static get tableName() {
    return 'user_interactions';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['user_id', 'tree_id'],
      properties: {
        id: { type: 'integer' },
        user_id: { type: 'integer' },
        tree_id: { type: 'integer' },
        adopt_id: { type: 'integer' },
        tree_name: { type: 'string', maxLength: 100 },
        blessing: { type: 'string' },
        share_platform: { type: 'string', enum: ['wechat', 'weibo', 'qq'] },
        share_time: { type: 'string', format: 'date-time' },
        created_at: { type: 'string', format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    const User = require('./user.model');
    const Tree = require('./tree.model');
    const Adoption = require('./adoption.model');

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'user_interactions.user_id',
          to: 'user_users.id'
        }
      },
      tree: {
        relation: Model.BelongsToOneRelation,
        modelClass: Tree,
        join: {
          from: 'user_interactions.tree_id',
          to: 'user_trees.id'
        }
      },
      adoption: {
        relation: Model.BelongsToOneRelation,
        modelClass: Adoption,
        join: {
          from: 'user_interactions.adopt_id',
          to: 'user_adoptions.id'
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
Interaction.knex(db);

module.exports = Interaction;