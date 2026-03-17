const TreeRepository = require('../../repositories/user/tree.repository');

/**
 * 树木信息服务类
 * 处理树木信息相关的业务逻辑，包括查询树木列表和树木详情
 * 协调Repository层的数据访问
 */
class TreeService {
  /**
   * 获取树木列表
   * 支持分页和状态筛选
   * 
   * @param {Object} query - 查询参数
   * @param {number} [query.page=1] - 页码，默认为1
   * @param {number} [query.limit=10] - 每页数量，默认为10
   * @param {string} [query.status] - 树木状态筛选（available/adopted/maintaining）
   * @param {string} [query.variety] - 品种筛选
   * @returns {Promise<Object>} 返回包含树木列表和分页信息的对象
   */
  async getTrees(query) {
    // 解析查询参数，设置默认值
    const { page = 1, limit = 10, status, variety, age } = query;
    
    // 计算分页偏移量：offset = (page - 1) * limit
    const offset = (page - 1) * limit;

    // 调用Repository层查询树木列表
    const result = await TreeRepository.findAll({
      limit,      // 每页数量
      offset,     // 偏移量
      status,     // 状态筛选
      variety,    // 品种筛选
      age         // 树龄筛选
    });

    // 返回查询结果（包含树木列表和分页信息）
    return result;
  }

  /**
   * 根据ID获取树木详情
   * 
   * @param {number} treeId - 树木ID
   * @returns {Promise<Object>} 返回树木对象
   * @throws {Error} 当树木不存在时抛出错误
   */
  async getTreeById(treeId) {
    // 调用Repository层查询树木
    const tree = await TreeRepository.findById(treeId);
    
    // 验证树木是否存在
    if (!tree) {
      throw new Error('树木不存在');
    }
    
    // 返回树木信息
    return tree;
  }
}

// 导出TreeService的单例实例
module.exports = new TreeService();