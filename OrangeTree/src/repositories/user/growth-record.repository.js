const GrowthRecord = require('../../models/user/growth-record.model');

class GrowthRecordRepository {
  async findById(id, trx = null) {
    const query = GrowthRecord.query(trx || GrowthRecord.knex());
    return await query.findById(id);
  }

  async create(data, trx = null) {
    const query = GrowthRecord.query(trx || GrowthRecord.knex());
    return await query.insert(data);
  }

  async update(id, data, trx = null) {
    const query = GrowthRecord.query(trx || GrowthRecord.knex());
    return await query.patchAndFetchById(id, data);
  }

  async findByTreeId(treeId, options = {}) {
    const { limit = 10, offset = 0 } = options;

    const results = await GrowthRecord.query()
      .where('tree_id', treeId)
      .orderBy('record_date', 'desc')
      .limit(limit)
      .offset(offset);

    const total = await GrowthRecord.query()
      .where('tree_id', treeId)
      .resultSize();

    return {
      data: results,
      pagination: {
        page: Math.floor(offset / limit) + 1,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async findByAdoptionId(adoptId, options = {}) {
    const { limit = 10, offset = 0 } = options;

    return await GrowthRecord.query()
      .where('adopt_id', adoptId)
      .orderBy('record_date', 'desc')
      .limit(limit)
      .offset(offset);
  }
}

module.exports = new GrowthRecordRepository();