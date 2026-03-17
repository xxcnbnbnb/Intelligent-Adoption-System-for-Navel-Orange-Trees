const Tree = require('../../models/user/tree.model');

class TreeRepository {
  async findById(id, trx = null) {
    const query = Tree.query(trx || Tree.knex());
    return await query.findById(id);
  }

  async findByTreeNo(treeNo, trx = null) {
    const query = Tree.query(trx || Tree.knex());
    return await query.findOne({ tree_no: treeNo });
  }

  async create(data, trx = null) {
    const query = Tree.query(trx || Tree.knex());
    return await query.insert(data);
  }

  async update(id, data, trx = null) {
    console.log('Repository更新树木ID:', id);
    console.log('Repository更新树木数据:', data);
    const query = Tree.query(trx || Tree.knex());
    const result = await query.patchAndFetchById(id, data);
    console.log('Repository更新结果:', result);
    return result;
  }

  async updateStatus(id, status, trx = null) {
    const query = Tree.query(trx || Tree.knex());
    return await query.patchAndFetchById(id, { status });
  }

  async delete(id, trx = null) {
    const query = Tree.query(trx || Tree.knex());
    return await query.patchAndFetchById(id, { is_deleted: 1 });
  }

  async findAll(options = {}) {
    const { limit = 10, offset = 0, status, variety, age, id } = options;

    let query = Tree.query()
      .where('is_deleted', 0)
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    if (status) {
      query = query.where('status', status);
    }

    if (variety) {
      query = query.where('variety', variety);
    }

    if (age) {
      // 处理树龄范围筛选
      if (age === '1-3') {
        query = query.whereBetween('age', [1, 3]);
      } else if (age === '4-6') {
        query = query.whereBetween('age', [4, 6]);
      } else if (age === '7+') {
        query = query.where('age', '>=', 7);
      }
    }

    if (id) {
      // 前端传递的id实际上是树木编号，所以应该查询tree_no字段
      query = query.where('tree_no', id);
    }

    const results = await query;
    
    // 转换字段名，使其与前端期望的一致
    const formattedResults = results.map(tree => ({
      id: tree.id,
      name: tree.tree_no,  // 使用树木编号作为树木名称
      image: tree.cover_img,  // 使用封面图片作为树木图片
      variety: tree.variety,
      age: tree.age,
      price: tree.price,
      status: tree.status
    }));
    
    // 计算总记录数时也需要考虑筛选条件
    let totalQuery = Tree.query().where('is_deleted', 0);
    if (status) {
      totalQuery = totalQuery.where('status', status);
    }
    if (variety) {
      totalQuery = totalQuery.where('variety', variety);
    }
    if (age) {
      // 处理树龄范围筛选
      if (age === '1-3') {
        totalQuery = totalQuery.whereBetween('age', [1, 3]);
      } else if (age === '4-6') {
        totalQuery = totalQuery.whereBetween('age', [4, 6]);
      } else if (age === '7+') {
        totalQuery = totalQuery.where('age', '>=', 7);
      }
    }
    if (id) {
      totalQuery = totalQuery.where('tree_no', id);
    }
    const total = await totalQuery.resultSize();

    return {
      data: formattedResults,
      pagination: {
        page: Math.floor(offset / limit) + 1,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
}

module.exports = new TreeRepository();