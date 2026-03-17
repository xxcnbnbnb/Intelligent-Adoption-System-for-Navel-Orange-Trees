const AdoptionService = require('../../services/admin/adoption.service');

/**
 * 管理员端认养订单控制器
 * 处理管理员对认养订单的管理操作，包括查询、更新和删除订单
 * 所有方法都是异步的，使用try-catch捕获错误并传递给错误处理中间件
 */
class AdoptionController {
  /**
   * 获取认养订单列表（支持分页和筛选）
   * 管理员可以查看所有用户的认养订单
   * 
   * @param {Object} req - Express请求对象
   * @param {Object} req.query - 查询字符串参数
   * @param {number} [req.query.page=1] - 页码，默认为1
   * @param {number} [req.query.limit=10] - 每页数量，默认为10
   * @param {string} [req.query.status] - 订单状态筛选
   * @param {string} [req.query.user_id] - 用户ID筛选
   * @param {string} [req.query.tree_id] - 树木ID筛选
   * @param {Object} res - Express响应对象
   * @param {Function} next - Express下一个中间件函数（错误处理）
   * @returns {Promise<void>} - 返回订单列表或错误
   */
  async getAdoptions(req, res, next) {
    try {
      // 调用Service层获取订单列表
      // req.query包含分页和筛选参数
      const result = await AdoptionService.getAdoptions(req.query);
      
      // 返回200成功响应，包含订单列表和分页信息
      res.status(200).json({
        success: true,  // 操作成功标识
        data: result.data,    // 订单列表
        pagination: result.pagination  // 分页信息
      });
    } catch (error) {
      // 捕获错误并传递给错误处理中间件
      next(error);
    }
  }

  /**
   * 根据ID获取认养订单详情
   * 管理员可以查看任意订单的详细信息
   * 
   * @param {Object} req - Express请求对象
   * @param {Object} req.params - URL路径参数
   * @param {string} req.params.id - 订单ID
   * @param {Object} res - Express响应对象
   * @param {Function} next - Express下一个中间件函数（错误处理）
   * @returns {Promise<void>} - 返回订单详情或错误
   */
  async getAdoptionById(req, res, next) {
    try {
      // 从URL路径参数中获取订单ID
      const { id } = req.params;
      
      // 调用Service层获取订单详情
      const adoption = await AdoptionService.getAdoptionDetail(id);
      
      // 返回200成功响应，包含订单详情
      res.status(200).json({
        success: true,      // 操作成功标识
        data: adoption      // 订单详情数据
      });
    } catch (error) {
      // 捕获错误并传递给错误处理中间件
      next(error);
    }
  }

  /**
   * 更新认养订单状态
   * 管理员可以更新订单的支付状态
   * 
   * @param {Object} req - Express请求对象
   * @param {Object} req.params - URL路径参数
   * @param {string} req.params.id - 订单ID
   * @param {Object} req.body - 请求体，包含要更新的状态
   * @param {string} req.body.status - 新的订单状态（unpaid/paid/canceled）
   * @param {Object} res - Express响应对象
   * @param {Function} next - Express下一个中间件函数（错误处理）
   * @returns {Promise<void>} - 返回更新后的订单信息或错误
   */
  async updateAdoptionStatus(req, res, next) {
    try {
      // 从URL路径参数中获取订单ID
      const { id } = req.params;
      
      // 从请求体中获取新的状态
      const { status } = req.body;
      
      // 调用Service层更新订单状态
      const adoption = await AdoptionService.updateAdoptionStatus(id, status);
      
      // 返回200成功响应，包含更新后的订单信息
      res.status(200).json({
        success: true,              // 操作成功标识
        message: '订单状态更新成功', // 成功消息
        data: adoption              // 更新后的订单数据
      });
    } catch (error) {
      // 捕获错误并传递给错误处理中间件
      next(error);
    }
  }

  /**
   * 删除认养订单（软删除）
   * 管理员可以删除不需要的订单
   * 
   * @param {Object} req - Express请求对象
   * @param {Object} req.params - URL路径参数
   * @param {string} req.params.id - 订单ID
   * @param {Object} res - Express响应对象
   * @param {Function} next - Express下一个中间件函数（错误处理）
   * @returns {Promise<void>} - 返回删除结果或错误
   */
  async deleteAdoption(req, res, next) {
    try {
      // 从URL路径参数中获取订单ID
      const { id } = req.params;
      
      // 调用Service层删除订单
      await AdoptionService.deleteAdoption(id);
      
      // 返回200成功响应
      res.status(200).json({
        success: true,              // 操作成功标识
        message: '订单删除成功'   // 成功消息
      });
    } catch (error) {
      // 捕获错误并传递给错误处理中间件
      next(error);
    }
  }
}

// 导出AdoptionController的单例实例
module.exports = new AdoptionController();
