const HarvestManage = require('../../models/admin/harvest-manage.model');

class HarvestManageRepository {
  async findById(id, trx = null) {
    const query = HarvestManage.query(trx || HarvestManage.knex());
    return await query.findById(id);
  }

  async create(data, trx = null) {
    const query = HarvestManage.query(trx || HarvestManage.knex());
    return await query.insert(data);
  }

  async update(id, data, trx = null) {
    const query = HarvestManage.query(trx || HarvestManage.knex());
    return await query.patchAndFetchById(id, data);
  }

  async findAll(options = {}) {
    const { limit = 10, offset = 0, tree_id, harvest_batch } = options;

    let query = HarvestManage.query()
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    if (tree_id) {
      query = query.where('tree_id', tree_id);
    }

    if (harvest_batch) {
      query = query.where('harvest_batch', harvest_batch);
    }

    const results = await query;
    const total = await HarvestManage.query().resultSize();

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
}

module.exports = new HarvestManageRepository();