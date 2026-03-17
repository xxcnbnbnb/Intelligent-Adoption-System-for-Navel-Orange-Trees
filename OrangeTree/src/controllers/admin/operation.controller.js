const OperationService = require('../../services/admin/operation.service');

/**
 * 操作日志控制器
 * 处理操作日志相关的HTTP请求，包括查询操作日志列表和日志详情
 * 所有方法都是异步的，使用try-catch捕获错误并传递给错误处理中间件
 */
class OperationController {
  /**
   * 获取操作日志列表
   * 支持分页和筛选
   * 
   * @param {Object} req - Express请求对象
   * @param {Object} req.query - 查询字符串参数
   * @param {number} [req.query.page=1] - 页码，默认为1
   * @param {number} [req.query.limit=10] - 每页数量，默认为10
   * @param {number} [req.query.admin_id] - 管理员ID筛选
   * @param {string} [req.query.operation_module] - 操作模块筛选
   * @param {Object} res - Express响应对象
   * @param {Function} next - Express下一个中间件函数（错误处理）
   * @returns {Promise<void>} - 返回操作日志列表或错误
   */
  async getOperations(req, res, next) {
    try {
      // 调用Service层获取操作日志列表
      // req.query包含分页和筛选参数
      const result = await OperationService.getOperations(req.query);
      
      // 返回200成功响应，包含操作日志列表
      res.status(200).json({
        success: true,  // 操作成功标识
        data: result    // 操作日志列表和分页信息
      });
    } catch (error) {
      // 捕获错误并传递给错误处理中间件
      next(error);
    }
  }

  /**
   * 根据ID获取操作日志详情
   * 查询指定操作日志的完整信息
   * 
   * @param {Object} req - Express请求对象
   * @param {Object} req.params - URL路径参数
   * @param {string} req.params.id - 操作日志ID
   * @param {Object} res - Express响应对象
   * @param {Function} next - Express下一个中间件函数（错误处理）
   * @returns {Promise<void>} - 返回操作日志详情或错误
   */
  async getOperationById(req, res, next) {
    try {
      // 从URL路径参数中获取操作日志ID
      const { id } = req.params;
      
      // 调用Service层获取操作日志详情
      const operation = await OperationService.getOperationById(id);
      
      // 返回200成功响应，包含操作日志详情
      res.status(200).json({
        success: true,  // 操作成功标识
        data: operation  // 操作日志详情
      });
    } catch (error) {
      // 捕获错误并传递给错误处理中间件
      next(error);
    }
  }
}

// 导出OperationController的单例实例
module.exports = new OperationController();