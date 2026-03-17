const AdoptionRepository = require('../../repositories/user/adoption.repository');
const UserRepository = require('../../repositories/user/user.repository');
const TreeRepository = require('../../repositories/user/tree.repository');
const LogisticsRepository = require('../../repositories/user/logistics.repository');
const { transaction } = require('../../utils/database');

/**
 * 管理员端认养订单服务类
 * 处理管理员对认养订单的管理业务逻辑，包括查询、更新和删除订单
 * 协调多个Repository的数据访问
 */
class AdoptionService {
  /**
   * 获取认养订单列表（支持分页和筛选）
   * 管理员可以查看所有用户的认养订单
   * 
   * @param {Object} query - 查询参数
   * @param {number} [query.page=1] - 页码，默认为1
   * @param {number} [query.limit=10] - 每页数量，默认为10
   * @param {string} [query.status] - 订单状态筛选
   * @param {string} [query.user_id] - 用户ID筛选
   * @param {string} [query.tree_id] - 树木ID筛选
   * @returns {Promise<Object>} 返回订单列表和分页信息
   */
  async getAdoptions(query) {
    // 解析查询参数，设置默认值
    const { page = 1, limit = 10, status, user_id, tree_id } = query;
    
    // 计算分页偏移量：offset = (page - 1) * limit
    const offset = (page - 1) * limit;

    // 构建基础查询
    const Adoption = require('../../models/user/adoption.model');
    let queryBuilder = Adoption.query()
      .where('is_deleted', 0)            // 排除已删除的订单（软删除）
      .withGraphFetched('[user, tree]')   // 关联查询用户和树木信息
      .orderBy('created_at', 'desc')      // 按创建时间降序排列
      .limit(limit)                       // 限制返回数量
      .offset(offset);                    // 设置偏移量

    // 添加筛选条件
    if (status) {
      queryBuilder = queryBuilder.where('pay_status', status);
    }
    if (user_id) {
      queryBuilder = queryBuilder.where('user_id', user_id);
    }
    if (tree_id) {
      queryBuilder = queryBuilder.where('tree_id', tree_id);
    }

    // 执行查询获取订单列表
    const results = await queryBuilder;
    
    // 转换字段名，使其与前端期望的一致
    const formattedResults = results.map(adoption => ({
      id: adoption.id,
      userId: adoption.user_id,
      userNickname: adoption.user?.nickname || '',
      userPhone: adoption.user?.phone || '',
      treeId: adoption.tree_id,
      treeNo: adoption.tree?.tree_no || '',
      treeVariety: adoption.tree?.variety || '',
      years: adoption.adopt_years,
      totalPrice: adoption.total_amount,
      status: adoption.pay_status,
      agreementNo: adoption.agreement_no,
      startDate: adoption.start_date,
      endDate: adoption.end_date,
      createdAt: adoption.created_at
    }));
    
    // 查询总数（用于分页）
    let countQuery = Adoption.query().where('is_deleted', 0);
    if (status) {
      countQuery = countQuery.where('pay_status', status);
    }
    if (user_id) {
      countQuery = countQuery.where('user_id', user_id);
    }
    if (tree_id) {
      countQuery = countQuery.where('tree_id', tree_id);
    }
    const total = await countQuery.resultSize();

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
   * 获取认养订单详情
   * 查询订单信息并关联用户和树木的详细信息
   * 
   * @param {number} adoptionId - 认养订单ID
   * @returns {Promise<Object>} 返回包含订单、用户和树木信息的对象
   * @throws {Error} 当订单不存在时抛出错误
   */
  async getAdoptionDetail(adoptionId) {
    // 查询认养订单基本信息
    const adoption = await AdoptionRepository.findById(adoptionId);
    if (!adoption) {
      throw new Error('认养订单不存在');
    }

    // 查询关联的用户信息
    const user = await UserRepository.findById(adoption.user_id);
    
    // 查询关联的树木信息
    const tree = await TreeRepository.findById(adoption.tree_id);

    // 查询关联的物流信息
    let logistics = null;
    try {
      logistics = await LogisticsRepository.findByAdoptionId(adoptionId);
    } catch (error) {
      // 物流信息可能不存在，忽略错误
      console.log('获取物流信息失败:', error);
    }

    // 组装返回数据，包含订单、用户、树木和物流的详细信息
    return {
      ...adoption,  // 订单基本信息
      user_info: {  // 用户信息
        id: user.id,
        nickname: user.nickname,
        avatar: user.avatar,
        phone: user.phone,
        email: user.email
      },
      tree_info: {  // 树木信息
        id: tree.id,
        tree_no: tree.tree_no,
        variety: tree.variety,
        age: tree.age,
        location: tree.location,
        cover_img: tree.cover_img,
        panorama_url: tree.panorama_url
      },
      logistics_info: logistics  // 物流信息
    };
  }

  /**
   * 更新认养订单状态
   * 更新订单的支付状态，并根据状态同步更新树木状态
   * 使用事务确保数据一致性
   * 
   * @param {number} adoptionId - 认养订单ID
   * @param {string} status - 新的订单状态（unpaid/paid/canceled）
   * @returns {Promise<Object>} 返回更新后的订单对象
   * @throws {Error} 当订单不存在时抛出错误
   */
  async updateAdoptionStatus(adoptionId, status) {
    // 使用事务确保订单和树木状态同步更新
    return await transaction(async (trx) => {
      // 查询订单是否存在
      const adoption = await AdoptionRepository.findById(adoptionId, trx);
      if (!adoption) {
        throw new Error('认养订单不存在');
      }

      // 更新订单状态
      const updatedAdoption = await AdoptionRepository.updateStatus(adoptionId, status, trx);

      // 根据订单状态更新树木状态
      if (status === 'paid') {
        // 订单已支付，树木状态保持为已认养
        await TreeRepository.updateStatus(adoption.tree_id, 'adopted', trx);
      } else if (status === 'canceled') {
        // 订单已取消，树木状态恢复为可认养
        await TreeRepository.updateStatus(adoption.tree_id, 'available', trx);
      }

      // 返回更新后的订单信息
      return updatedAdoption;
    });
  }

  /**
   * 删除认养订单（软删除）
   * 将订单标记为已删除，并根据需要更新树木状态
   * 
   * @param {number} adoptionId - 认养订单ID
   * @returns {Promise<Object>} 返回删除后的订单对象
   * @throws {Error} 当订单不存在时抛出错误
   */
  async deleteAdoption(adoptionId) {
    // 使用事务确保订单删除和树木状态更新的一致性
    return await transaction(async (trx) => {
      // 查询订单是否存在
      const adoption = await AdoptionRepository.findById(adoptionId, trx);
      if (!adoption) {
        throw new Error('认养订单不存在');
      }

      // 软删除订单（标记为已删除）
      const deletedAdoption = await AdoptionRepository.update(adoptionId, { is_deleted: 1 }, trx);

      // 如果订单状态为已支付或未支付，将树木状态恢复为可认养
      if (adoption.pay_status === 'paid' || adoption.pay_status === 'unpaid') {
        await TreeRepository.updateStatus(adoption.tree_id, 'available', trx);
      }

      // 返回删除后的订单信息
      return deletedAdoption;
    });
  }
}

// 导出AdoptionService的单例实例
module.exports = new AdoptionService();
