const GrowthService = require('../../services/user/growth.service');

/**
 * 生长记录控制器
 * 处理树木生长记录相关的HTTP请求，包括查询生长记录列表和记录详情
 * 所有方法都是异步的，使用try-catch捕获错误并传递给错误处理中间件
 */
class GrowthController {
  /**
   * 获取指定树木的生长记录列表
   * 支持分页查询
   * 
   * @param {Object} req - Express请求对象
   * @param {Object} req.params - URL路径参数
   * @param {string} req.params.treeId - 树木ID
   * @param {Object} req.query - 查询字符串参数
   * @param {number} [req.query.page=1] - 页码，默认为1
   * @param {number} [req.query.limit=10] - 每页数量，默认为10
   * @param {Object} res - Express响应对象
   * @param {Function} next - Express下一个中间件函数（错误处理）
   * @returns {Promise<void>} - 返回生长记录列表或错误
   */
  async getGrowthRecords(req, res, next) {
    try {
      // 从URL路径参数中获取树木ID
      const { treeId } = req.params;
      
      // 调用Service层获取生长记录列表
      // req.query包含分页参数
      const records = await GrowthService.getGrowthRecords(treeId, req.query);
      
      // 返回200成功响应，包含生长记录列表
      res.status(200).json({
        success: true,  // 操作成功标识
        data: records  // 生长记录列表
      });
    } catch (error) {
      // 捕获错误并传递给错误处理中间件
      next(error);
    }
  }

  /**
   * 根据ID获取生长记录详情
   * 查询指定生长记录的完整信息
   * 
   * @param {Object} req - Express请求对象
   * @param {Object} req.params - URL路径参数
   * @param {string} req.params.id - 生长记录ID
   * @param {Object} res - Express响应对象
   * @param {Function} next - Express下一个中间件函数（错误处理）
   * @returns {Promise<void>} - 返回生长记录详情或错误
   */
  async getGrowthRecordById(req, res, next) {
    try {
      // 从URL路径参数中获取生长记录ID
      const { id } = req.params;
      
      // 调用Service层获取生长记录详情
      const record = await GrowthService.getGrowthRecordById(id);
      
      // 返回200成功响应，包含生长记录详情
      res.status(200).json({
        success: true,  // 操作成功标识
        data: record   // 生长记录详情
      });
    } catch (error) {
      // 捕获错误并传递给错误处理中间件
      next(error);
    }
  }
}

// 导出GrowthController的单例实例
module.exports = new GrowthController();