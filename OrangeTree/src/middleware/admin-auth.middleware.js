const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * 管理员身份认证中间件
 * 验证JWT令牌并检查用户角色是否为管理员
 * 
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数
 * @returns {void} - 验证成功调用next()，失败返回401或403错误
 */
const adminAuthMiddleware = (req, res, next) => {
  try {
    // 从请求头的Authorization字段中提取JWT令牌
    // 格式通常为 "Bearer <token>"，所以需要split后取第二部分
    const token = req.headers.authorization?.split(' ')[1];

    // 如果没有提供令牌，返回401未授权错误
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '未提供认证令牌'
      });
    }

    // 使用JWT密钥验证令牌的有效性
    // 验证成功会返回解码后的用户信息（payload）
    const decoded = jwt.verify(token, config.jwt.secret);

    // 检查用户角色是否为管理员
    // 如果不是管理员，返回403禁止访问错误
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '需要管理员权限'
      });
    }

    // 将解码后的用户信息附加到请求对象，供后续中间件和路由使用
    req.user = decoded;
    
    // 调用下一个中间件
    next();
  } catch (error) {
    // 令牌验证失败（过期、无效等），返回401错误
    return res.status(401).json({
      success: false,
      message: '认证令牌无效'
    });
  }
};

module.exports = adminAuthMiddleware;