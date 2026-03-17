const Adoption = require('../../models/user/adoption.model');

/**
 * 认养订单数据访问类（Repository层）
 * 封装所有与user_adoptions表相关的数据库操作
 * 提供CRUD操作和复杂查询功能，支持事务
 */
class AdoptionRepository {
  /**
   * 根据ID查询认养订单
   * 
   * @param {number} id - 认养订单ID
   * @param {Object} [trx=null] - Knex事务对象，用于在事务中执行查询
   * @returns {Promise<Object|null>} 返回订单对象，不存在时返回null
   */
  async findById(id, trx = null) {
    // 创建查询对象，如果有事务则使用事务，否则使用默认连接
    const query = Adoption.query(trx || Adoption.knex());
    
    // 根据主键ID查询订单
    return await query.findById(id);
  }

  /**
   * 创建新的认养订单
   * 
   * @param {Object} data - 订单数据对象
   * @param {number} data.user_id - 用户ID
   * @param {number} data.tree_id - 树木ID
   * @param {number} data.adopt_years - 认养年限
   * @param {number} data.total_amount - 订单总金额
   * @param {string} data.pay_status - 支付状态
   * @param {string} data.agreement_no - 协议编号
   * @param {Date} data.start_date - 认养开始日期
   * @param {Date} data.end_date - 认养结束日期
   * @param {Object} [trx=null] - Knex事务对象
   * @returns {Promise<Object>} 返回创建的订单对象（包含自动生成的ID）
   */
  async create(data, trx = null) {
    // 创建查询对象，支持事务
    const query = Adoption.query(trx || Adoption.knex());
    
    // 插入数据并返回插入的记录
    return await query.insert(data);
  }

  /**
   * 更新认养订单
   * 
   * @param {number} id - 订单ID
   * @param {Object} data - 要更新的字段对象
   * @param {Object} [trx=null] - Knex事务对象
   * @returns {Promise<Object>} 返回更新后的订单对象
   */
  async update(id, data, trx = null) {
    // 创建查询对象，支持事务
    const query = Adoption.query(trx || Adoption.knex());
    
    // 更新指定ID的记录并返回更新后的记录
    return await query.patchAndFetchById(id, data);
  }

  /**
   * 更新认养订单的支付状态
   * 
   * @param {number} id - 订单ID
   * @param {string} status - 新的支付状态（unpaid/paid/canceled）
   * @param {Object} [trx=null] - Knex事务对象
   * @returns {Promise<Object>} 返回更新后的订单对象
   */
  async updateStatus(id, status, trx = null) {
    // 创建查询对象，支持事务
    const query = Adoption.query(trx || Adoption.knex());
    
    // 更新支付状态字段并返回更新后的记录
    return await query.patchAndFetchById(id, { pay_status: status });
  }

  /**
   * 根据用户ID查询认养订单列表（支持分页和状态筛选）
   * 
   * @param {number} userId - 用户ID
   * @param {Object} [options={}] - 查询选项
   * @param {number} [options.limit=10] - 每页数量
   * @param {number} [options.offset=0] - 偏移量
   * @param {string} [options.status] - 订单状态筛选
   * @returns {Promise<Object>} 返回包含订单列表和分页信息的对象
   */
  async findByUserId(userId, options = {}) {
    // 解析查询选项，设置默认值
    const { limit = 10, offset = 0, status } = options;

    // 构建基础查询，包含树木信息
    let query = Adoption.query()
      .where('user_id', userId)           // 筛选指定用户的订单
      .where('is_deleted', 0)            // 排除已删除的订单（软删除）
      .withGraphFetched('tree')          // 关联查询树木信息
      .orderBy('created_at', 'desc')      // 按创建时间降序排列
      .limit(limit)                       // 限制返回数量
      .offset(offset);                    // 设置偏移量

    // 如果指定了状态筛选，添加状态条件
    if (status) {
      query = query.where('pay_status', status);
    }

    // 执行查询获取订单列表
    const results = await query;
    
    // 转换字段名，使其与前端期望的一致
    const formattedResults = results.map(adoption => ({
      id: adoption.id,
      treeId: adoption.tree_id,
      treeName: adoption.tree?.tree_no || '',  // 使用树木编号作为树木名称
      years: adoption.adopt_years,
      totalPrice: adoption.total_amount,
      status: adoption.pay_status,
      createdAt: adoption.created_at
    }));
    
    // 查询总数（用于分页）
    const total = await Adoption.query()
      .where('user_id', userId)
      .where('is_deleted', 0)
      .resultSize();

    // 返回订单列表和分页信息
    return {
      data: formattedResults,  // 格式化后的订单列表
      pagination: {  // 分页信息
        page: Math.floor(offset / limit) + 1,  // 当前页码
        limit,                                  // 每页数量
        total,                                  // 总记录数
        pages: Math.ceil(total / limit)          // 总页数
      }
    };
  }

  /**
   * 根据树木ID查询认养订单列表（支持分页）
   * 
   * @param {number} treeId - 树木ID
   * @param {Object} [options={}] - 查询选项
   * @param {number} [options.limit=10] - 每页数量
   * @param {number} [options.offset=0] - 偏移量
   * @returns {Promise<Array>} 返回订单数组
   */
  async findByTreeId(treeId, options = {}) {
    // 解析查询选项，设置默认值
    const { limit = 10, offset = 0 } = options;

    // 构建查询并执行
    return await Adoption.query()
      .where('tree_id', treeId)           // 筛选指定树木的订单
      .where('is_deleted', 0)            // 排除已删除的订单
      .orderBy('created_at', 'desc')      // 按创建时间降序排列
      .limit(limit)                       // 限制返回数量
      .offset(offset);                    // 设置偏移量
  }
}

// 导出AdoptionRepository的单例实例
module.exports = new AdoptionRepository();