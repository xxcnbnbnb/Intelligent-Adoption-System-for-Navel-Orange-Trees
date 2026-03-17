const OperationLog = require('../../models/admin/operation-log.model');

class OperationLogRepository {
  async findById(id, trx = null) {
    const query = OperationLog.query(trx || OperationLog.knex());
    return await query.findById(id);
  }

  async create(data, trx = null) {
    const query = OperationLog.query(trx || OperationLog.knex());
    return await query.insert(data);
  }

  async findAll(options = {}) {
    const { limit = 10, offset = 0, admin_id, operation_module } = options;

    let query = OperationLog.query()
      .orderBy('operation_time', 'desc')
      .limit(limit)
      .offset(offset);

    if (admin_id) {
      query = query.where('admin_id', admin_id);
    }

    if (operation_module) {
      query = query.where('operation_module', operation_module);
    }

    const results = await query;
    const total = await OperationLog.query().resultSize();

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

module.exports = new OperationLogRepository();