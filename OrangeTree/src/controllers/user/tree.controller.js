const TreeService = require('../../services/user/tree.service');

/**
 * 树木信息控制器
 * 处理树木信息相关的HTTP请求，包括查询树木列表和树木详情
 * 所有方法都是异步的，使用try-catch捕获错误并传递给错误处理中间件
 */
class TreeController {
  /**
   * 获取树木列表
   * 支持分页和状态筛选
   * 
   * @param {Object} req - Express请求对象
   * @param {Object} req.query - 查询字符串参数
   * @param {number} [req.query.page=1] - 页码，默认为1
   * @param {number} [req.query.limit=10] - 每页数量，默认为10
   * @param {string} [req.query.status] - 树木状态筛选（available/adopted/maintaining）
   * @param {string} [req.query.variety] - 品种筛选
   * @param {string} [req.query.age] - 树龄范围筛选（1-3/4-6/7+）
   * @param {Object} res - Express响应对象
   * @param {Function} next - Express下一个中间件函数（错误处理）
   * @returns {Promise<void>} - 返回树木列表或错误
   */
  async getTrees(req, res, next) {
    try {
      // 调用Service层获取树木列表
      // req.query包含分页和筛选参数
      const result = await TreeService.getTrees(req.query);
      
      // 返回200成功响应，包含树木列表和分页信息
      res.status(200).json({
        success: true,  // 操作成功标识
        data: result.data,    // 树木列表
        pagination: result.pagination  // 分页信息
      });
    } catch (error) {
      // 捕获错误并传递给错误处理中间件
      next(error);
    }
  }

  /**
   * 根据ID获取树木详情
   * 查询指定树木的完整信息
   * 
   * @param {Object} req - Express请求对象
   * @param {Object} req.params - URL路径参数
   * @param {string} req.params.id - 树木ID
   * @param {Object} res - Express响应对象
   * @param {Function} next - Express下一个中间件函数（错误处理）
   * @returns {Promise<void>} - 返回树木详情或错误
   */
  async getTreeById(req, res, next) {
    try {
      // 从URL路径参数中获取树木ID
      const { id } = req.params;
      
      // 调用Service层获取树木详情
      const tree = await TreeService.getTreeById(id);
      
      // 返回200成功响应，包含树木详情
      res.status(200).json({
        success: true,  // 操作成功标识
        data: tree      // 树木详情数据
      });
    } catch (error) {
      // 捕获错误并传递给错误处理中间件
      next(error);
    }
  }
}

// 导出TreeController的单例实例
module.exports = new TreeController();