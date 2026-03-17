/**
 * 请求日志记录中间件
 * 记录每个HTTP请求的方法、URL、状态码和处理时间
 * 
 * @param {Object} req - Express请求对象，包含method和url属性
 * @param {Object} res - Express响应对象，包含statusCode属性
 * @param {Function} next - Express下一个中间件函数
 * @returns {void} - 记录日志后调用next()
 */
const loggerMiddleware = (req, res, next) => {
  // 记录请求开始时间，用于计算请求处理时长
  const start = Date.now();

  // 监听响应对象的finish事件
  // 当响应发送完成时触发此事件
  res.on('finish', () => {
    // 计算请求处理时长（毫秒）
    const duration = Date.now() - start;
    
    // 输出请求日志，包含：HTTP方法、请求URL、响应状态码、处理时长
    console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
  });

  // 调用下一个中间件，继续处理请求
  next();
};

module.exports = loggerMiddleware;