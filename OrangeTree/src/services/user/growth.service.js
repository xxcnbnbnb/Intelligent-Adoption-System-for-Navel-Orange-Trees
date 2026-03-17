const GrowthRecordRepository = require('../../repositories/user/growth-record.repository');

/**
 * 生长记录服务类
 * 处理树木生长记录相关的业务逻辑，包括查询生长记录列表和记录详情
 * 协调Repository层的数据访问
 */
class GrowthService {
  /**
   * 获取指定树木的生长记录列表
   * 支持分页查询
   * 
   * @param {number} treeId - 树木ID
   * @param {Object} query - 查询参数
   * @param {number} [query.page=1] - 页码，默认为1
   * @param {number} [query.limit=10] - 每页数量，默认为10
   * @returns {Promise<Object>} 返回包含生长记录列表和分页信息的对象
   */
  async getGrowthRecords(treeId, query) {
    // 解析查询参数，设置默认值
    const { page = 1, limit = 10 } = query;
    
    // 计算分页偏移量：offset = (page - 1) * limit
    const offset = (page - 1) * limit;

    // 调用Repository层查询生长记录列表
    const result = await GrowthRecordRepository.findByTreeId(treeId, {
      limit,      // 每页数量
      offset      // 偏移量
    });

    // 返回查询结果（包含生长记录列表和分页信息）
    return result;
  }

  /**
   * 根据ID获取生长记录详情
   * 
   * @param {number} recordId - 生长记录ID
   * @returns {Promise<Object>} 返回生长记录对象
   * @throws {Error} 当生长记录不存在时抛出错误
   */
  async getGrowthRecordById(recordId) {
    // 调用Repository层查询生长记录
    const record = await GrowthRecordRepository.findById(recordId);
    
    // 验证生长记录是否存在
    if (!record) {
      throw new Error('生长记录不存在');
    }
    
    // 返回生长记录信息
    return record;
  }
}

// 导出GrowthService的单例实例
module.exports = new GrowthService();