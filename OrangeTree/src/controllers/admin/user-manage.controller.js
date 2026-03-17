const UserManageService = require('../../services/admin/user-manage.service');

/**
 * 管理员端用户管理控制器
 * 处理管理员对用户的管理操作，包括查询用户列表、查看用户详情、更新用户信息、备注大客户信息
 * 所有方法都是异步的，使用try-catch捕获错误并传递给错误处理中间件
 */
class UserManageController {
  /**
   * 获取用户列表（支持分页和筛选）
   * 管理员可以查看所有认养用户
   * 
   * @param {Object} req - Express请求对象
   * @param {Object} req.query - 查询字符串参数
   * @param {number} [req.query.page=1] - 页码，默认为1
   * @param {number} [req.query.limit=10] - 每页数量，默认为10
   * @param {string} [req.query.status] - 用户状态筛选（active/disabled）
   * @param {string} [req.query.phone] - 手机号筛选
   * @param {string} [req.query.nickname] - 昵称筛选
   * @param {Object} res - Express响应对象
   * @param {Function} next - Express下一个中间件函数（错误处理）
   * @returns {Promise<void>} - 返回用户列表或错误
   */
  async getUsers(req, res, next) {
    try {
      // 调用Service层获取用户列表
      // req.query包含分页和筛选参数
      const result = await UserManageService.getUsers(req.query);
      
      // 返回200成功响应，包含用户列表
      res.status(200).json({
        success: true,  // 操作成功标识
        data: result.data,    // 用户列表
        pagination: result.pagination  // 分页信息
      });
    } catch (error) {
      // 捕获错误并传递给错误处理中间件
      next(error);
    }
  }

  /**
   * 获取用户详情
   * 查询用户信息并关联其订单和果树信息
   * 
   * @param {Object} req - Express请求对象
   * @param {Object} req.params - URL路径参数
   * @param {string} req.params.id - 用户ID
   * @param {Object} res - Express响应对象
   * @param {Function} next - Express下一个中间件函数（错误处理）
   * @returns {Promise<void>} - 返回用户详情或错误
   */
  async getUserById(req, res, next) {
    try {
      // 从URL路径参数中获取用户ID
      const { id } = req.params;
      
      // 调用Service层获取用户详情
      const user = await UserManageService.getUserDetail(id);
      
      // 返回200成功响应，包含用户详情
      res.status(200).json({
        success: true,      // 操作成功标识
        data: user          // 用户详情数据
      });
    } catch (error) {
      // 捕获错误并传递给错误处理中间件
      next(error);
    }
  }

  /**
   * 更新用户信息
   * 管理员可以更新用户状态、昵称等基本信息
   * 
   * @param {Object} req - Express请求对象
   * @param {Object} req.params - URL路径参数
   * @param {string} req.params.id - 用户ID
   * @param {Object} req.body - 请求体，包含要更新的用户信息
   * @param {string} [req.body.nickname] - 昵称
   * @param {string} [req.body.status] - 用户状态（active/disabled）
   * @param {string} [req.body.vip_remark] - 大客户备注
   * @param {Object} res - Express响应对象
   * @param {Function} next - Express下一个中间件函数（错误处理）
   * @returns {Promise<void>} - 返回更新后的用户信息或错误
   */
  async updateUser(req, res, next) {
    try {
      // 从URL路径参数中获取用户ID
      const { id } = req.params;
      
      // 调用Service层更新用户信息
      const user = await UserManageService.updateUser(id, req.body);
      
      // 返回200成功响应，包含更新后的用户信息
      res.status(200).json({
        success: true,              // 操作成功标识
        message: '用户更新成功',  // 成功消息
        data: user                // 更新后的用户数据
      });
    } catch (error) {
      // 捕获错误并传递给错误处理中间件
      next(error);
    }
  }

  /**
   * 删除用户（软删除）
   * 管理员可以删除用户
   * 
   * @param {Object} req - Express请求对象
   * @param {Object} req.params - URL路径参数
   * @param {string} req.params.id - 用户ID
   * @param {Object} res - Express响应对象
   * @param {Function} next - Express下一个中间件函数（错误处理）
   * @returns {Promise<void>} - 返回删除结果或错误
   */
  async deleteUser(req, res, next) {
    try {
      // 从URL路径参数中获取用户ID
      const { id } = req.params;
      
      // 调用Service层删除用户
      await UserManageService.deleteUser(id);
      
      // 返回200成功响应
      res.status(200).json({
        success: true,              // 操作成功标识
        message: '用户删除成功'   // 成功消息
      });
    } catch (error) {
      // 捕获错误并传递给错误处理中间件
      next(error);
    }
  }
}

// 导出UserManageController的单例实例
module.exports = new UserManageController();
