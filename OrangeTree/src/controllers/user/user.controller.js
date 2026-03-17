const UserService = require('../../services/user/user.service');

/**
 * 用户控制器
 * 处理用户相关的HTTP请求，包括获取、更新用户信息和用户登录
 * 所有方法都是异步的，使用try-catch捕获错误并传递给错误处理中间件
 */
class UserController {
  /**
   * 用户登录
   * 处理用户登录请求，验证用户身份并返回JWT令牌
   * 
   * @param {Object} req - Express请求对象
   * @param {Object} req.body - 请求体，包含登录凭证
   * @param {string} req.body.phone - 用户手机号
   * @param {string} req.body.password - 用户密码
   * @param {Object} res - Express响应对象
   * @param {Function} next - Express下一个中间件函数（错误处理）
   * @returns {Promise<void>} - 返回登录结果或错误
   */
  async login(req, res, next) {
    try {
      // 检查请求体
      console.log('登录请求体:', req.body);
      console.log('请求体类型:', typeof req.body);
      
      // 从请求体中获取登录凭证
      const { phone, password } = req.body;
      
      // 验证必要参数
      if (!phone || !password) {
        return res.status(400).json({
          success: false,
          message: '手机号和密码不能为空'
        });
      }
      
      // 调用Service层执行登录逻辑
      const loginResult = await UserService.login(phone, password);
      
      // 返回200成功响应，包含令牌和用户信息
      res.status(200).json({
        success: true,          // 操作成功标识
        message: '登录成功',      // 成功消息
        data: loginResult       // 登录结果，包含token和user信息
      });
    } catch (error) {
      console.error('登录失败:', error);
      // 处理认证错误
      if (error.message === '用户不存在' || error.message === '密码错误' || error.message === '用户账号已被禁用') {
        return res.status(401).json({
          success: false,
          message: error.message
        });
      }
      // 其他错误传递给错误处理中间件
      next(error);
    }
  }

  /**
   * 获取用户个人资料
   * 根据JWT令牌中的用户ID查询用户信息
   * 
   * @param {Object} req - Express请求对象
   * @param {Object} req.user - 从JWT令牌解码的用户信息
   * @param {number} req.user.id - 用户ID
   * @param {Object} res - Express响应对象
   * @param {Function} next - Express下一个中间件函数（错误处理）
   * @returns {Promise<void>} - 返回用户信息或错误
   */
  async getProfile(req, res, next) {
    try {
      // 调用Service层获取用户资料
      // req.user.id是从JWT令牌中解析出的用户ID
      const profile = await UserService.getProfile(req.user.id);
      
      // 返回200成功响应，包含用户信息
      res.status(200).json({
        success: true,      // 操作成功标识
        data: profile       // 用户资料数据
      });
    } catch (error) {
      // 捕获错误并传递给错误处理中间件
      next(error);
    }
  }

  /**
   * 更新用户个人资料
   * 根据请求体中的数据更新用户信息
   * 
   * @param {Object} req - Express请求对象
   * @param {Object} req.user - 从JWT令牌解码的用户信息
   * @param {number} req.user.id - 用户ID
   * @param {Object} req.body - 请求体，包含要更新的用户信息
   * @param {string} [req.body.nickname] - 用户昵称
   * @param {string} [req.body.avatar] - 用户头像URL
   * @param {Object} res - Express响应对象
   * @param {Function} next - Express下一个中间件函数（错误处理）
   * @returns {Promise<void>} - 返回更新后的用户信息或错误
   */
  async updateProfile(req, res, next) {
    try {
      // 调用Service层更新用户资料
      // req.user.id是要更新的用户ID
      // req.body包含要更新的字段
      const profile = await UserService.updateProfile(req.user.id, req.body);
      
      // 返回200成功响应，包含更新后的用户信息
      res.status(200).json({
        success: true,                // 操作成功标识
        message: '个人资料更新成功',  // 成功消息
        data: profile                // 更新后的用户资料数据
      });
    } catch (error) {
      // 捕获错误并传递给错误处理中间件
      next(error);
    }
  }
}

// 导出UserController的单例实例
module.exports = new UserController();