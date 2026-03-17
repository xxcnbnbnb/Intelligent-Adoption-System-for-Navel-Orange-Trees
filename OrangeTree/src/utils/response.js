/**
 * HTTP响应工具类
 * 提供统一的响应格式，简化控制器中的响应代码
 * 确保所有API响应格式一致
 */
class ResponseUtil {
  /**
   * 返回成功响应
   * 用于操作成功时统一返回格式
   * 
   * @param {Object} res - Express响应对象
   * @param {*} data - 返回的数据对象
   * @param {string} [message='操作成功'] - 成功消息
   * @param {number} [statusCode=200] - HTTP状态码，默认为200
   * @returns {Object} 返回Express响应对象
   * 
   * @example
   * ResponseUtil.success(res, { id: 1, name: 'test' }, '创建成功', 201);
   */
  static success(res, data, message = '操作成功', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,     // 操作成功标识
      message,          // 成功消息
      data              // 返回的数据
    });
  }

  /**
   * 返回错误响应
   * 用于操作失败时统一返回格式
   * 
   * @param {Object} res - Express响应对象
   * @param {string} [message='操作失败'] - 错误消息
   * @param {number} [statusCode=500] - HTTP状态码，默认为500
   * @param {*} [error=null] - 错误详情，仅在开发环境返回
   * @returns {Object} 返回Express响应对象
   * 
   * @example
   * ResponseUtil.error(res, '用户不存在', 404, new Error('User not found'));
   */
  static error(res, message = '操作失败', statusCode = 500, error = null) {
    return res.status(statusCode).json({
      success: false,    // 操作失败标识
      message,           // 错误消息
      // 仅在开发环境返回错误详情，生产环境不暴露
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }

  /**
   * 返回分页响应
   * 用于返回列表数据时包含分页信息
   * 
   * @param {Object} res - Express响应对象
   * @param {Array} data - 数据列表
   * @param {Object} pagination - 分页信息对象
   * @param {number} pagination.page - 当前页码
   * @param {number} pagination.limit - 每页数量
   * @param {number} pagination.total - 总记录数
   * @param {number} pagination.pages - 总页数
   * @param {string} [message='查询成功'] - 成功消息
   * @returns {Object} 返回Express响应对象
   * 
   * @example
   * ResponseUtil.pagination(res, userList, {
   *   page: 1,
   *   limit: 10,
   *   total: 100,
   *   pages: 10
   * }, '查询成功');
   */
  static pagination(res, data, pagination, message = '查询成功') {
    return res.status(200).json({
      success: true,     // 操作成功标识
      message,          // 成功消息
      data,             // 数据列表
      pagination        // 分页信息
    });
  }
}

// 导出ResponseUtil工具类
module.exports = ResponseUtil;