const AdoptionRepository = require('../../repositories/user/adoption.repository');
const UserRepository = require('../../repositories/user/user.repository');
const TreeRepository = require('../../repositories/user/tree.repository');
const LogisticsRepository = require('../../repositories/user/logistics.repository');
const { transaction } = require('../../utils/database');

/**
 * 认养订单服务类
 * 处理认养订单相关的业务逻辑，包括创建订单、查询订单、更新状态等
 * 使用事务确保数据一致性，协调多个Repository的数据访问
 */
class AdoptionService {
  /**
   * 创建认养订单
   * 验证用户和树木信息，计算费用，创建订单并更新树木状态
   * 使用事务确保操作的原子性
   * 
   * @param {number} userId - 发起认养的用户ID
   * @param {Object} adoptionData - 认养订单数据
   * @param {number} adoptionData.tree_id - 要认养的树木ID
   * @param {number} adoptionData.adopt_years - 认养年限（年）
   * @returns {Promise<Object>} 返回创建的认养订单对象
   * @throws {Error} 当用户不存在、树木不存在或树木不可认养时抛出错误
   */
  async createAdoption(userId, adoptionData) {
    // 使用事务确保多个数据库操作的原子性
    // 如果任何一个操作失败，所有操作都会回滚
    return await transaction(async (trx) => {
      // 从请求数据中提取树木ID和认养年限
      const { tree_id, adopt_years } = adoptionData;

      // 验证用户是否存在
      const user = await UserRepository.findById(userId, trx);
      if (!user) {
        throw new Error('用户不存在');
      }

      // 验证树木是否存在
      const tree = await TreeRepository.findById(tree_id, trx);
      if (!tree) {
        throw new Error('树木不存在');
      }

      // 验证树木状态是否可认养
      if (tree.status !== 'available') {
        throw new Error('该树木当前不可认养');
      }

      // 计算认养总金额：单价 × 认养年限
      const total_amount = tree.price * adopt_years;
      
      // 计算认养起止日期
      const start_date = new Date();                    // 认养开始日期为当前日期
      const end_date = new Date();                      // 认养结束日期
      end_date.setFullYear(end_date.getFullYear() + adopt_years); // 结束日期 = 当前日期 + 认养年限

      // 格式化日期为YYYY-MM-DD格式
      const formatDate = (date) => {
        return date.toISOString().split('T')[0];
      };

      // 创建认养订单
      const adoption = await AdoptionRepository.create({
        user_id: userId,                    // 认养用户ID
        tree_id: tree_id,                   // 被认养树木ID
        adopt_years: adopt_years,            // 认养年限
        total_amount: total_amount,          // 订单总金额
        pay_status: 'unpaid',              // 支付状态默认为未支付
        agreement_no: this.generateAgreementNo(), // 生成电子协议编号
        start_date: formatDate(start_date),            // 认养开始日期
        end_date: formatDate(end_date)                // 认养结束日期
      }, trx);

      // 更新树木状态为已认养
      await TreeRepository.updateStatus(tree_id, 'adopted', trx);

      // 返回创建的订单信息
      return adoption;
    });
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
      user_info: {  // 用户信息（脱敏处理）
        id: user.id,
        nickname: user.nickname,
        avatar: user.avatar,
        phone: user.phone  // 添加联系电话
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
   * 获取用户的认养订单列表
   * 支持分页和状态筛选
   * 
   * @param {number} userId - 用户ID
   * @param {Object} query - 查询参数
   * @param {number} [query.page=1] - 页码，默认为1
   * @param {number} [query.limit=10] - 每页数量，默认为10
   * @param {string} [query.status] - 订单状态筛选（unpaid/paid/canceled）
   * @returns {Promise<Object>} 返回订单列表和分页信息
   */
  async getUserAdoptions(userId, query) {
    // 解析查询参数，设置默认值
    const { page = 1, limit = 10, status } = query;
    
    // 计算分页偏移量：offset = (page - 1) * limit
    const offset = (page - 1) * limit;

    // 调用Repository层查询用户的认养订单
    const result = await AdoptionRepository.findByUserId(userId, {
      limit,      // 每页数量
      offset,     // 偏移量
      status      // 状态筛选
    });

    // 返回查询结果（包含订单列表和分页信息）
    return result;
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
   * 生成电子认养协议编号
   * 格式：AGR + 时间戳 + 4位随机数
   * 示例：AGR17040672000001234
   * 
   * @returns {string} 返回生成的协议编号
   */
  generateAgreementNo() {
    // 获取当前时间戳（毫秒）
    const timestamp = Date.now();
    
    // 生成4位随机数，不足4位前面补0
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    // 组合成协议编号：AGR + 时间戳 + 随机数
    return `AGR${timestamp}${random}`;
  }
}

// 导出AdoptionService的单例实例
module.exports = new AdoptionService();