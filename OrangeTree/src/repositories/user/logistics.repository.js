const Logistics = require('../../models/user/logistics.model');

class LogisticsRepository {
  async findById(id, trx = null) {
    const query = Logistics.query(trx || Logistics.knex());
    return await query.findById(id);
  }

  async create(data, trx = null) {
    const query = Logistics.query(trx || Logistics.knex());
    return await query.insert(data);
  }

  async update(id, data, trx = null) {
    const query = Logistics.query(trx || Logistics.knex());
    return await query.patchAndFetchById(id, data);
  }

  async updateStatus(id, status, trx = null) {
    const query = Logistics.query(trx || Logistics.knex());
    return await query.patchAndFetchById(id, { status });
  }

  async findByAdoptionId(adoptId, trx = null) {
    const query = Logistics.query(trx || Logistics.knex());
    return await query.findOne({ adopt_id: adoptId });
  }

  async findByLogisticsNo(logisticsNo, trx = null) {
    const query = Logistics.query(trx || Logistics.knex());
    return await query.findOne({ logistics_no: logisticsNo });
  }

  async findByHarvestBatch(harvestBatch, trx = null) {
    const query = Logistics.query(trx || Logistics.knex());
    return await query.findOne({ harvest_batch: harvestBatch });
  }

  async findByStatus(status, trx = null) {
    const query = Logistics.query(trx || Logistics.knex());
    return await query.where({ status });
  }

  async deleteById(id, trx = null) {
    const query = Logistics.query(trx || Logistics.knex());
    return await query.deleteById(id);
  }
}

module.exports = new LogisticsRepository();
