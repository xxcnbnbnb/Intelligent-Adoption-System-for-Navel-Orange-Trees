const { body, param, query, validationResult } = require('express-validator');

/**
 * 参数验证中间件
 * 检查请求参数是否符合验证规则，验证失败返回400错误
 * 
 * @param {Object} req - Express请求对象，包含验证结果
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数
 * @returns {void} - 验证成功调用next()，失败返回400错误
 */
const validatorMiddleware = (req, res, next) => {
  // 从请求对象中获取验证结果
  // 验证结果由express-validator在路由中设置的验证规则生成
  const errors = validationResult(req);
  
  // 检查是否有验证错误
  if (!errors.isEmpty()) {
    // 有验证错误，返回400 Bad Request响应
    return res.status(400).json({
      success: false,              // 操作失败标识
      message: '参数验证失败',     // 错误消息
      errors: errors.array()        // 详细的错误信息数组
    });
  }
  
  // 验证通过，调用下一个中间件
  next();
};

/**
 * 导出验证相关的工具函数和中间件
 * 
 * body: 验证请求体参数
 * param: 验证URL路径参数
 * query: 验证查询字符串参数
 * validationResult: 获取验证结果
 * validatorMiddleware: 验证中间件
 */
module.exports = {
  validatorMiddleware,  // 验证中间件函数
  body,               // 请求体验证器
  param,              // 路径参数验证器
  query,              // 查询参数验证器
  validationResult    // 验证结果获取器
};