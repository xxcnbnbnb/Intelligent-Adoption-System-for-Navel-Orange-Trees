const Interaction = require('../../models/user/interaction.model');

class InteractionRepository {
  async findById(id, trx = null) {
    const query = Interaction.query(trx || Interaction.knex());
    return await query.findById(id);
  }

  async create(data, trx = null) {
    const query = Interaction.query(trx || Interaction.knex());
    return await query.insert(data);
  }

  async findByTreeId(treeId, options = {}) {
    const { limit = 10, offset = 0 } = options;

    const results = await Interaction.query()
      .where('tree_id', treeId)
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    const total = await Interaction.query()
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

  async findByUserId(userId, options = {}) {
    const { limit = 10, offset = 0 } = options;

    return await Interaction.query()
      .where('user_id', userId)
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);
  }
}

module.exports = new InteractionRepository();