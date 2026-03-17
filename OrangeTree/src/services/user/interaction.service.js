const InteractionRepository = require('../../repositories/user/interaction.repository');

/**
 * 用户互动服务类
 * 处理用户互动相关的业务逻辑，包括创建互动记录和查询互动列表
 * 协调Repository层的数据访问
 */
class InteractionService {
  /**
   * 创建用户互动记录
   * 用户为树木起昵称、留言祝福或分享到社交平台
   * 
   * @param {number} userId - 发起互动的用户ID
   * @param {Object} interactionData - 互动数据
   * @param {number} interactionData.tree_id - 树木ID
   * @param {number} [interactionData.adopt_id] - 认养订单ID（可选）
   * @param {string} [interactionData.tree_name] - 用户为树木起的昵称
   * @param {string} [interactionData.blessing] - 用户留言祝福内容
   * @param {string} [interactionData.share_platform] - 分享平台（wechat/weibo/qq）
   * @param {Date} [interactionData.share_time] - 分享时间
   * @returns {Promise<Object>} 返回创建的互动记录对象
   */
  async createInteraction(userId, interactionData) {
    // 调用Repository层创建互动记录
    // 合并用户ID和互动数据
    const interaction = await InteractionRepository.create({
      user_id: userId,         // 发起互动的用户ID
      ...interactionData          // 互动的详细信息
    });
    
    // 返回创建的互动记录
    return interaction;
  }

  /**
   * 获取指定树木的互动记录列表
   * 支持分页查询
   * 
   * @param {number} treeId - 树木ID
   * @param {Object} query - 查询参数
   * @param {number} [query.page=1] - 页码，默认为1
   * @param {number} [query.limit=10] - 每页数量，默认为10
   * @returns {Promise<Object>} 返回包含互动记录列表和分页信息的对象
   */
  async getTreeInteractions(treeId, query) {
    // 解析查询参数，设置默认值
    const { page = 1, limit = 10 } = query;
    
    // 计算分页偏移量：offset = (page - 1) * limit
    const offset = (page - 1) * limit;

    // 调用Repository层查询互动记录列表
    const result = await InteractionRepository.findByTreeId(treeId, {
      limit,      // 每页数量
      offset      // 偏移量
    });

    // 返回查询结果（包含互动记录列表和分页信息）
    return result;
  }
}

// 导出InteractionService的单例实例
module.exports = new InteractionService();