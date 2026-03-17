/**
 * 全局错误处理中间件
 * 捕获应用程序中的所有错误，统一返回错误响应
 * 
 * @param {Error} err - 错误对象，包含statusCode和message属性
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数（虽然这里不会调用）
 * @returns {void} - 返回JSON格式的错误响应
 */
const errorHandler = (err, req, res, next) => {
  // 在控制台输出错误信息，便于调试
  console.error('Error:', err);

  // 获取错误状态码，如果没有则默认为500（服务器内部错误）
  const statusCode = err.statusCode || 500;
  
  // 获取错误消息，如果没有则使用默认消息
  const message = err.message || '服务器内部错误';

  // 返回JSON格式的错误响应
  res.status(statusCode).json({
    success: false,              // 操作失败标识
    message,                     // 错误消息
    // 仅在开发环境下返回错误堆栈信息，生产环境不暴露详细错误信息
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;