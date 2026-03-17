const AdoptionService = require('../../services/user/adoption.service');

/**
 * 认养订单控制器
 * 处理认养订单相关的HTTP请求，包括创建、查询和更新订单
 * 所有方法都是异步的，使用try-catch捕获错误并传递给错误处理中间件
 */
class AdoptionController {
  /**
   * 创建认养订单
   * 用户发起认养请求，创建新的认养订单
   * 
   * @param {Object} req - Express请求对象
   * @param {Object} req.user - 从JWT令牌解码的用户信息
   * @param {number} req.user.id - 用户ID
   * @param {Object} req.body - 请求体，包含认养订单信息
   * @param {number} req.body.tree_id - 要认养的树木ID
   * @param {number} req.body.adopt_years - 认养年限
   * @param {Object} res - Express响应对象
   * @param {Function} next - Express下一个中间件函数（错误处理）
   * @returns {Promise<void>} - 返回创建的订单信息或错误
   */
  async createAdoption(req, res, next) {
    try {
      // 调用Service层创建认养订单
      // req.user.id是发起认养的用户ID
      // req.body包含认养订单的详细信息
      const adoption = await AdoptionService.createAdoption(req.user.id, req.body);
      
      // 返回201 Created响应，表示资源创建成功
      res.status(201).json({
        success: true,              // 操作成功标识
        message: '认养订单创建成功', // 成功消息
        data: adoption              // 创建的订单数据
      });
    } catch (error) {
      // 捕获错误并传递给错误处理中间件
      next(error);
    }
  }

  /**
   * 根据ID获取认养订单详情
   * 查询指定订单的完整信息，包括关联的用户和树木信息
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
   * 获取当前用户的认养订单列表
   * 支持分页和状态筛选
   * 
   * @param {Object} req - Express请求对象
   * @param {Object} req.user - 从JWT令牌解码的用户信息
   * @param {number} req.user.id - 用户ID
   * @param {Object} req.query - 查询字符串参数
   * @param {number} [req.query.page] - 页码，默认为1
   * @param {number} [req.query.limit] - 每页数量，默认为10
   * @param {string} [req.query.status] - 订单状态筛选
   * @param {Object} res - Express响应对象
   * @param {Function} next - Express下一个中间件函数（错误处理）
   * @returns {Promise<void>} - 返回订单列表或错误
   */
  async getUserAdoptions(req, res, next) {
    try {
      // 调用Service层获取用户的认养订单列表
      // req.user.id是当前登录用户的ID
      // req.query包含分页和筛选参数
      const result = await AdoptionService.getUserAdoptions(req.user.id, req.query);
      
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
   * 更新认养订单状态
   * 更新订单的支付状态（如：unpaid -> paid）
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
}

// 导出AdoptionController的单例实例
module.exports = new AdoptionController();