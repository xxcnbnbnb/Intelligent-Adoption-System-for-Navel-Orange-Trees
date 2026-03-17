const { Model } = require('objection');
const { user: db } = require('../../config/database.config');

class Logistics extends Model {
  static get tableName() {
    return 'user_logistics';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['adopt_id'],
      properties: {
        id: { type: 'integer' },
        adopt_id: { type: 'integer' },
        harvest_batch: { type: ['string', 'null'] },
        product_amount: { type: ['number', 'null'] },
        receiver_name: { type: ['string', 'null'] },
        receiver_phone: { type: ['string', 'null'] },
        receiver_address: { type: ['string', 'null'] },
        logistics_company: { type: ['string', 'null'] },
        logistics_no: { type: ['string', 'null'] },
        status: { 
          type: 'string',
          enum: ['pending', 'shipped', 'received'],
          default: 'pending'
        },
        send_time: { type: ['string', 'null'], format: 'date-time' },
        receive_time: { type: ['string', 'null'], format: 'date-time' },
        is_deleted: { type: 'boolean', default: false },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    return {
      adoption: {
        relation: Model.BelongsToOneRelation,
        modelClass: require('./adoption.model'),
        join: {
          from: 'user_logistics.adopt_id',
          to: 'user_adoptions.id'
        }
      }
    };
  }
}

Logistics.knex(db);
module.exports = Logistics;
