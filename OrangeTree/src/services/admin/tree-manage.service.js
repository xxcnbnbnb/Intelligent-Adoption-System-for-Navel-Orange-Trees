const TreeManageRepository = require('../../repositories/admin/tree-manage.repository');

/**
 * 树木管理服务类
 * 处理树木相关的业务逻辑，包括查询树木列表、创建、更新和删除
 * 协调Repository层的数据访问
 */
class TreeManageService {
  /**
   * 获取树木列表
   * 支持分页和筛选
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
    const { page = 1, limit = 10, status, variety, id } = query;
    
    // 计算分页偏移量：offset = (page - 1) * limit
    const offset = (page - 1) * limit;

    // 调用Repository层查询树木列表
    const result = await TreeManageRepository.findAll({
      limit,      // 每页数量
      offset,     // 偏移量
      status,     // 树木状态筛选
      variety     // 品种筛选
    });

    // 返回查询结果（包含树木列表和分页信息）
    return result;
  }

  /**
   * 创建新的树木
   * 
   * @param {Object} treeData - 树木数据
   * @param {string} treeData.id - 树木编号
   * @param {string} treeData.name - 树木名称
   * @param {string} treeData.variety - 品种
   * @param {number} treeData.age - 树龄
   * @param {string} treeData.location - 位置
   * @param {number} treeData.price - 认养费用
   * @param {number} treeData.expectedYield - 预计产量
   * @param {string} treeData.status - 状态
   * @param {string} treeData.description - 描述
   * @returns {Promise<Object>} 返回创建的树木对象
   */
  async createTree(treeData) {
    // 调用Repository层创建树木
    return await TreeManageRepository.create(treeData);
  }

  /**
   * 更新树木信息
   * 
   * @param {string} treeId - 树木ID
   * @param {Object} treeData - 要更新的树木信息
   * @param {string} [treeData.name] - 树木名称
   * @param {string} [treeData.variety] - 品种
   * @param {number} [treeData.age] - 树龄
   * @param {string} [treeData.location] - 位置
   * @param {number} [treeData.price] - 认养费用
   * @param {number} [treeData.expectedYield] - 预计产量
   * @param {string} [treeData.status] - 状态
   * @param {string} [treeData.description] - 描述
   * @returns {Promise<Object>} 返回更新后的树木对象
   */
  async updateTree(treeId, treeData) {
    console.log('服务层更新树木ID:', treeId);
    console.log('服务层更新树木数据:', treeData);
    // 调用Repository层更新树木
    const result = await TreeManageRepository.update(treeId, treeData);
    console.log('服务层更新结果:', result);
    return result;
  }

  /**
   * 删除树木
   * 
   * @param {string} treeId - 树木ID
   * @returns {Promise<Object>} 返回删除结果
   */
  async deleteTree(treeId) {
    // 调用Repository层删除树木
    return await TreeManageRepository.delete(treeId);
  }
}

// 导出TreeManageService的单例实例
module.exports = new TreeManageService();