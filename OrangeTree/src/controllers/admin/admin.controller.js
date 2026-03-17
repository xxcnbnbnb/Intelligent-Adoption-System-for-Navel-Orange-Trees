const AdminService = require('../../services/admin/admin.service');

/**
 * 管理员控制器
 * 处理管理员相关的HTTP请求，包括获取、更新管理员信息和管理员登录
 * 所有方法都是异步的，使用try-catch捕获错误并传递给错误处理中间件
 */
class AdminController {
  /**
   * 管理员登录
   * 处理管理员登录请求，验证管理员身份并返回JWT令牌
   * 
   * @param {Object} req - Express请求对象
   * @param {Object} req.body - 请求体，包含登录凭证
   * @param {string} req.body.username - 管理员用户名
   * @param {string} req.body.password - 管理员密码
   * @param {Object} res - Express响应对象
   * @param {Function} next - Express下一个中间件函数（错误处理）
   * @returns {Promise<void>} - 返回登录结果或错误
   */
  async login(req, res, next) {
    try {
      // 从请求体中获取登录凭证
      const { username, password } = req.body;
      
      // 验证必要参数
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: '用户名和密码不能为空'
        });
      }
      
      // 调用Service层执行登录逻辑
      const loginResult = await AdminService.login(username, password);
      
      // 返回200成功响应，包含令牌和管理员信息
      res.status(200).json({
        success: true,          // 操作成功标识
        message: '登录成功',      // 成功消息
        data: loginResult       // 登录结果，包含token和admin信息
      });
    } catch (error) {
      // 捕获错误并传递给错误处理中间件
      next(error);
    }
  }

  /**
   * 获取管理员个人资料
   * 根据JWT令牌中的管理员ID查询管理员信息
   * 
   * @param {Object} req - Express请求对象
   * @param {Object} req.user - 从JWT令牌解码的管理员信息
   * @param {number} req.user.id - 管理员ID
   * @param {Object} res - Express响应对象
   * @param {Function} next - Express下一个中间件函数（错误处理）
   * @returns {Promise<void>} - 返回管理员信息或错误
   */
  async getProfile(req, res, next) {
    try {
      // 调用Service层获取管理员资料
      // req.user.id是从JWT令牌中解析出的管理员ID
      const profile = await AdminService.getProfile(req.user.id);
      
      // 返回200成功响应，包含管理员信息
      res.status(200).json({
        success: true,      // 操作成功标识
        data: profile       // 管理员资料数据
      });
    } catch (error) {
      // 捕获错误并传递给错误处理中间件
      next(error);
    }
  }

  /**
   * 更新管理员个人资料
   * 根据请求体中的数据更新管理员信息
   * 
   * @param {Object} req - Express请求对象
   * @param {Object} req.user - 从JWT令牌解码的管理员信息
   * @param {number} req.user.id - 管理员ID
   * @param {Object} req.body - 请求体，包含要更新的管理员信息
   * @param {string} [req.body.real_name] - 管理员真实姓名
   * @param {string} [req.body.phone] - 联系方式
   * @param {Object} res - Express响应对象
   * @param {Function} next - Express下一个中间件函数（错误处理）
   * @returns {Promise<void>} - 返回更新后的管理员信息或错误
   */
  async updateProfile(req, res, next) {
    try {
      // 调用Service层更新管理员资料
      // req.user.id是要更新的管理员ID
      // req.body包含要更新的字段
      const profile = await AdminService.updateProfile(req.user.id, req.body);
      
      // 返回200成功响应，包含更新后的管理员信息
      res.status(200).json({
        success: true,                // 操作成功标识
        message: '个人资料更新成功',  // 成功消息
        data: profile                // 更新后的管理员资料数据
      });
    } catch (error) {
      // 捕获错误并传递给错误处理中间件
      next(error);
    }
  }
}

// 导出AdminController的单例实例
module.exports = new AdminController();