const { Model } = require('objection');
const { user: db } = require('../../config/database.config');

// 不要使用全局Model.knex()，而是在类中设置

class GrowthRecord extends Model {
  static get tableName() {
    return 'user_growth_records';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['tree_id', 'record_date', 'growth_stage'],
      properties: {
        id: { type: 'integer' },
        tree_id: { type: 'integer' },
        adopt_id: { type: 'integer' },
        record_date: { type: 'string', format: 'date' },
        growth_stage: { type: 'string', maxLength: 20 },
        content: { type: 'string' },
        img_urls: { type: 'string' },
        video_url: { type: 'string', maxLength: 500 },
        created_at: { type: 'string', format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    const Tree = require('./tree.model');
    const Adoption = require('./adoption.model');

    return {
      tree: {
        relation: Model.BelongsToOneRelation,
        modelClass: Tree,
        join: {
          from: 'user_growth_records.tree_id',
          to: 'user_trees.id'
        }
      },
      adoption: {
        relation: Model.BelongsToOneRelation,
        modelClass: Adoption,
        join: {
          from: 'user_growth_records.adopt_id',
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
GrowthRecord.knex(db);

module.exports = GrowthRecord;