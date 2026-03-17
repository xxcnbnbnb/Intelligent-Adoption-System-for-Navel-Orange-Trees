const RoleService = require('../../services/admin/role.service');

/**
 * 角色权限控制器
 * 处理角色权限相关的HTTP请求，包括查询角色列表、创建、更新和删除角色
 * 所有方法都是异步的，使用try-catch捕获错误并传递给错误处理中间件
 */
class RoleController {
  /**
   * 获取角色列表
   * 支持分页查询
   * 
   * @param {Object} req - Express请求对象
   * @param {Object} req.query - 查询字符串参数
   * @param {number} [req.query.page=1] - 页码，默认为1
   * @param {number} [req.query.limit=10] - 每页数量，默认为10
   * @param {Object} res - Express响应对象
   * @param {Function} next - Express下一个中间件函数（错误处理）
   * @returns {Promise<void>} - 返回角色列表或错误
   */
  async getRoles(req, res, next) {
    try {
      // 调用Service层获取角色列表
      // req.query包含分页参数
      const roles = await RoleService.getRoles(req.query);
      
      // 返回200成功响应，包含角色列表
      res.status(200).json({
        success: true,  // 操作成功标识
        data: roles.data    // 角色列表
      });
    } catch (error) {
      // 捕获错误并传递给错误处理中间件
      next(error);
    }
  }

  /**
   * 创建新角色
   * 
   * @param {Object} req - Express请求对象
   * @param {Object} req.body - 请求体，包含角色信息
   * @param {string} req.body.role_name - 角色名称
   * @param {Object} req.body.permissions - 权限配置对象
   * @param {Object} res - Express响应对象
   * @param {Function} next - Express下一个中间件函数（错误处理）
   * @returns {Promise<void>} - 返回创建的角色或错误
   */
  async createRole(req, res, next) {
    try {
      console.log('收到的请求数据:', req.body);
      // 转换前端传来的权限格式为数据库存储格式
      if (req.body.permissions && typeof req.body.permissions === 'object' && !Array.isArray(req.body.permissions)) {
        const { user = [], tree = [], adoption = [] } = req.body.permissions;
        req.body.permissions = [
          ...user.map(action => `user:${action}`),
          ...tree.map(action => `tree:${action}`),
          ...adoption.map(action => `adoption:${action}`)
        ];
        console.log('转换后的权限数据:', req.body.permissions);
      }
      console.log('最终发送给Service的数据:', req.body);
      
      // 调用Service层创建角色
      // req.body包含角色的详细信息
      const role = await RoleService.createRole(req.body);
      
      // 返回201 Created响应，表示资源创建成功
      res.status(201).json({
        success: true,              // 操作成功标识
        message: '角色创建成功',  // 成功消息
        data: role                // 创建的角色数据
      });
    } catch (error) {
      // 捕获错误并传递给错误处理中间件
      next(error);
    }
  }

  /**
   * 更新角色信息
   * 
   * @param {Object} req - Express请求对象
   * @param {Object} req.params - URL路径参数
   * @param {string} req.params.id - 角色ID
   * @param {Object} req.body - 请求体，包含要更新的角色信息
   * @param {string} [req.body.role_name] - 角色名称
   * @param {Object} [req.body.permissions] - 权限配置对象
   * @param {Object} res - Express响应对象
   * @param {Function} next - Express下一个中间件函数（错误处理）
   * @returns {Promise<void>} - 返回更新后的角色或错误
   */
  async updateRole(req, res, next) {
    try {
      // 从URL路径参数中获取角色ID
      const { id } = req.params;
      console.log('收到的请求数据:', req.body);
      
      // 转换前端传来的权限格式为数据库存储格式
      if (req.body.permissions && typeof req.body.permissions === 'object' && !Array.isArray(req.body.permissions)) {
        const { user = [], tree = [], adoption = [] } = req.body.permissions;
        req.body.permissions = [
          ...user.map(action => `user:${action}`),
          ...tree.map(action => `tree:${action}`),
          ...adoption.map(action => `adoption:${action}`)
        ];
        console.log('转换后的权限数据:', req.body.permissions);
      }
      console.log('最终发送给Service的数据:', req.body);
      
      // 调用Service层更新角色
      const role = await RoleService.updateRole(id, req.body);
      
      // 返回200成功响应，包含更新后的角色信息
      res.status(200).json({
        success: true,              // 操作成功标识
        message: '角色更新成功',  // 成功消息
        data: role                // 更新后的角色数据
      });
    } catch (error) {
      // 捕获错误并传递给错误处理中间件
      next(error);
    }
  }

  /**
   * 删除角色
   * 
   * @param {Object} req - Express请求对象
   * @param {Object} req.params - URL路径参数
   * @param {string} req.params.id - 角色ID
   * @param {Object} res - Express响应对象
   * @param {Function} next - Express下一个中间件函数（错误处理）
   * @returns {Promise<void>} - 返回删除结果或错误
   */
  async deleteRole(req, res, next) {
    try {
      // 从URL路径参数中获取角色ID
      const { id } = req.params;
      
      // 调用Service层删除角色
      await RoleService.deleteRole(id);
      
      // 返回200成功响应
      res.status(200).json({
        success: true,              // 操作成功标识
        message: '角色删除成功'   // 成功消息
      });
    } catch (error) {
      // 捕获错误并传递给错误处理中间件
      next(error);
    }
  }
}

// 导出RoleController的单例实例
module.exports = new RoleController();