/**
 * 应用程序基础错误类
 * 继承自原生Error类，添加statusCode和isOperational属性
 * 用于区分应用错误和系统错误
 */
class AppError extends Error {
  /**
   * 构造函数
   * 
   * @param {string} message - 错误消息
   * @param {number} [statusCode=500] - HTTP状态码，默认为500（服务器内部错误）
   */
  constructor(message, statusCode = 500) {
    // 调用父类构造函数，设置错误消息
    super(message);
    
    // 设置HTTP状态码
    this.statusCode = statusCode;
    
    // 标记为操作错误（非系统错误）
    // 错误处理中间件可以根据此属性决定是否记录堆栈信息
    this.isOperational = true;
    
    // 捕获堆栈信息，便于调试
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 参数验证错误类
 * 继承自AppError，状态码固定为400
 * 用于请求参数验证失败时抛出
 * 
 * @example
 * throw new ValidationError('用户名不能为空');
 */
class ValidationError extends AppError {
  /**
   * 构造函数
   * 
   * @param {string} message - 验证错误消息
   */
  constructor(message) {
    // 调用父类构造函数，状态码固定为400
    super(message, 400);
  }
}

/**
 * 资源不存在错误类
 * 继承自AppError，状态码固定为404
 * 用于查询的资源不存在时抛出
 * 
 * @example
 * throw new NotFoundError('用户不存在');
 */
class NotFoundError extends AppError {
  /**
   * 构造函数
   * 
   * @param {string} [message='资源不存在'] - 错误消息
   */
  constructor(message = '资源不存在') {
    // 调用父类构造函数，状态码固定为404
    super(message, 404);
  }
}

/**
 * 未授权错误类
 * 继承自AppError，状态码固定为401
 * 用于用户未认证或令牌无效时抛出
 * 
 * @example
 * throw new UnauthorizedError('请先登录');
 */
class UnauthorizedError extends AppError {
  /**
   * 构造函数
   * 
   * @param {string} [message='未授权访问'] - 错误消息
   */
  constructor(message = '未授权访问') {
    // 调用父类构造函数，状态码固定为401
    super(message, 401);
  }
}

/**
 * 禁止访问错误类
 * 继承自AppError，状态码固定为403
 * 用于用户已认证但无权限访问资源时抛出
 * 
 * @example
 * throw new ForbiddenError('需要管理员权限');
 */
class ForbiddenError extends AppError {
  /**
   * 构造函数
   * 
   * @param {string} [message='禁止访问'] - 错误消息
   */
  constructor(message = '禁止访问') {
    // 调用父类构造函数，状态码固定为403
    super(message, 403);
  }
}

// 导出所有错误类
module.exports = {
  AppError,              // 基础错误类
  ValidationError,        // 参数验证错误类（400）
  NotFoundError,          // 资源不存在错误类（404）
  UnauthorizedError,      // 未授权错误类（401）
  ForbiddenError          // 禁止访问错误类（403）
};