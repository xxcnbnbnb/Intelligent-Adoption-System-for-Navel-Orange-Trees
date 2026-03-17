const OperationLogRepository = require('../../repositories/admin/operation-log.repository');

/**
 * 操作日志服务类
 * 处理操作日志相关的业务逻辑，包括查询操作日志列表和日志详情
 * 协调Repository层的数据访问
 */
class OperationService {
  /**
   * 获取操作日志列表
   * 支持分页和筛选
   * 
   * @param {Object} query - 查询参数
   * @param {number} [query.page=1] - 页码，默认为1
   * @param {number} [query.limit=10] - 每页数量，默认为10
   * @param {number} [query.admin_id] - 管理员ID筛选
   * @param {string} [query.operation_module] - 操作模块筛选
   * @returns {Promise<Object>} 返回包含操作日志列表和分页信息的对象
   */
  async getOperations(query) {
    // 解析查询参数，设置默认值
    const { page = 1, limit = 10, admin_id, operation_module } = query;
    
    // 计算分页偏移量：offset = (page - 1) * limit
    const offset = (page - 1) * limit;

    // 调用Repository层查询操作日志列表
    const result = await OperationLogRepository.findAll({
      limit,              // 每页数量
      offset,             // 偏移量
      admin_id,           // 管理员ID筛选
      operation_module     // 操作模块筛选
    });

    // 返回查询结果（包含操作日志列表和分页信息）
    return result;
  }

  /**
   * 根据ID获取操作日志详情
   * 
   * @param {number} operationId - 操作日志ID
   * @returns {Promise<Object>} 返回操作日志对象
   * @throws {Error} 当操作日志不存在时抛出错误
   */
  async getOperationById(operationId) {
    // 调用Repository层查询操作日志
    const operation = await OperationLogRepository.findById(operationId);
    
    // 验证操作日志是否存在
    if (!operation) {
      throw new Error('操作日志不存在');
    }
    
    // 返回操作日志信息
    return operation;
  }
}

// 导出OperationService的单例实例
module.exports = new OperationService();