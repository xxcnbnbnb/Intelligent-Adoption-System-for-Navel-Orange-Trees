const { Model } = require('objection');
const { user: db } = require('../../config/database.config');

// 不要使用全局Model.knex()，而是在类中设置

class Tree extends Model {
  static get tableName() {
    return 'user_trees';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['tree_no', 'variety', 'age', 'location', 'status', 'price'],
      properties: {
        id: { type: 'integer' },
        tree_no: { type: 'string' },
        variety: { type: 'string', maxLength: 50 },
        age: { type: 'integer', minimum: 0 },
        location: { type: 'string', maxLength: 200 },
        status: { type: 'string', enum: ['available', 'adopted', 'maintaining'], default: 'available' },
        price: { type: 'number', minimum: 0 },
        panorama_url: { type: 'string', maxLength: 500 },
        cover_img: { type: 'string', maxLength: 500 },
        is_deleted: { type: 'integer', enum: [0, 1], default: 0 },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    const Adoption = require('./adoption.model');
    const GrowthRecord = require('./growth-record.model');
    const Interaction = require('./interaction.model');

    return {
      adoptions: {
        relation: Model.HasManyRelation,
        modelClass: Adoption,
        join: {
          from: 'user_trees.id',
          to: 'user_adoptions.tree_id'
        }
      },
      growth_records: {
        relation: Model.HasManyRelation,
        modelClass: GrowthRecord,
        join: {
          from: 'user_trees.id',
          to: 'user_growth_records.tree_id'
        }
      },
      interactions: {
        relation: Model.HasManyRelation,
        modelClass: Interaction,
        join: {
          from: 'user_trees.id',
          to: 'user_interactions.tree_id'
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
Tree.knex(db);

module.exports = Tree;