const User = require('../../models/user/user.model');

class UserRepository {
  async findById(id, trx = null) {
    const query = User.query(trx || User.knex());
    return await query.findById(id);
  }

  async findByPhone(phone, trx = null) {
    const query = User.query(trx || User.knex());
    return await query.findOne({ phone });
  }

  async create(data, trx = null) {
    const query = User.query(trx || User.knex());
    return await query.insert(data);
  }

  async update(id, data, trx = null) {
    const query = User.query(trx || User.knex());
    return await query.patchAndFetchById(id, data);
  }

  async delete(id, trx = null) {
    const query = User.query(trx || User.knex());
    return await query.patchAndFetchById(id, { is_deleted: 1 });
  }

  async findAll(options = {}) {
    const { limit = 10, offset = 0, status } = options;

    let query = User.query()
      .where('is_deleted', 0)
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    if (status) {
      query = query.where('status', status);
    }

    const results = await query;
    const total = await User.query()
      .where('is_deleted', 0)
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
}

module.exports = new UserRepository();