const TreeManage = require('../../models/user/tree.model');

class TreeManageRepository {
  async findById(id, trx = null) {
    const query = TreeManage.query(trx || TreeManage.knex());
    return await query.findById(id);
  }

  async create(data, trx = null) {
    const query = TreeManage.query(trx || TreeManage.knex());
    return await query.insert(data);
  }

  async update(id, data, trx = null) {
    const query = TreeManage.query(trx || TreeManage.knex());
    return await query.patchAndFetchById(id, data);
  }

  async delete(id, trx = null) {
    const query = TreeManage.query(trx || TreeManage.knex());
    return await query.deleteById(id);
  }

  async findAll(options = {}) {
    const { limit = 10, offset = 0, status, variety } = options;
    
    let query = TreeManage.query()
      .where('is_deleted', 0)
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);
    
    if (status) {
      query = query.where('status', status);
    }
    
    if (variety) {
      query = query.where('variety', 'like', `%${variety}%`);
    }
    
    const results = await query;
    const total = await TreeManage.query()
      .where('is_deleted', 0)
      .modify(function(queryBuilder) {
        if (status) {
          queryBuilder.where('status', status);
        }
        if (variety) {
          queryBuilder.where('variety', 'like', `%${variety}%`);
        }
      })
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

module.exports = new TreeManageRepository();