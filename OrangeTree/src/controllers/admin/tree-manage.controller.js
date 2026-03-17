const TreeManageService = require('../../services/admin/tree-manage.service');

/**
 * 树木管理控制器
 * 处理树木管理相关的HTTP请求，包括查询树木管理列表、创建、更新和删除
 * 所有方法都是异步的，使用try-catch捕获错误并传递给错误处理中间件
 */
class TreeManageController {
  /**
   * 获取树木管理列表
   * 支持分页和筛选
   * 
   * @param {Object} req - Express请求对象
   * @param {Object} req.query - 查询字符串参数
   * @param {number} [req.query.page=1] - 页码，默认为1
   * @param {number} [req.query.limit=10] - 每页数量，默认为10
   * @param {string} [req.query.status] - 管理状态筛选（normal/abnormal/pruning）
   * @param {string} [req.query.batch_no] - 批次号筛选
   * @param {Object} res - Express响应对象
   * @param {Function} next - Express下一个中间件函数（错误处理）
   * @returns {Promise<void>} - 返回树木管理列表或错误
   */
  async getTrees(req, res, next) {
    try {
      // 调用Service层获取树木管理列表
      // req.query包含分页和筛选参数
      const result = await TreeManageService.getTrees(req.query);
      
      // 返回200成功响应，包含树木管理列表
      res.status(200).json({
        success: true,  // 操作成功标识
        data: result.data,    // 树木管理列表
        pagination: result.pagination  // 分页信息
      });
    } catch (error) {
      // 捕获错误并传递给错误处理中间件
      next(error);
    }
  }

  /**
   * 创建新的树木管理记录
   * 
   * @param {Object} req - Express请求对象
   * @param {Object} req.body - 请求体，包含树木管理信息
   * @param {number} req.body.tree_id - 树木ID
   * @param {string} req.body.manage_status - 管理状态（normal/abnormal/pruning）
   * @param {string} req.body.batch_no - 批次号
   * @param {string} req.body.import_source - 导入来源
   * @param {number} req.body.operator_id - 操作员ID
   * @param {Object} res - Express响应对象
   * @param {Function} next - Express下一个中间件函数（错误处理）
   * @returns {Promise<void>} - 返回创建的树木管理记录或错误
   */
  async createTree(req, res, next) {
    try {
      // 调用Service层创建树木管理记录
      // req.body包含树木管理的详细信息
      const tree = await TreeManageService.createTree(req.body);
      
      // 返回201 Created响应，表示资源创建成功
      res.status(201).json({
        success: true,              // 操作成功标识
        message: '树木创建成功',  // 成功消息
        data: tree                // 创建的树木管理数据
      });
    } catch (error) {
      // 捕获错误并传递给错误处理中间件
      next(error);
    }
  }

  /**
   * 更新树木管理记录
   * 
   * @param {Object} req - Express请求对象
   * @param {Object} req.params - URL路径参数
   * @param {string} req.params.id - 树木管理记录ID
   * @param {Object} req.body - 请求体，包含要更新的树木管理信息
   * @param {string} [req.body.manage_status] - 管理状态
   * @param {string} [req.body.batch_no] - 批次号
   * @param {string} [req.body.import_source] - 导入来源
   * @param {Object} res - Express响应对象
   * @param {Function} next - Express下一个中间件函数（错误处理）
   * @returns {Promise<void>} - 返回更新后的树木管理记录或错误
   */
  async updateTree(req, res, next) {
    try {
      // 从URL路径参数中获取树木管理记录ID
      const { id } = req.params;
      console.log('更新树木ID:', id);
      console.log('更新树木数据:', req.body);
      
      // 调用Service层更新树木管理记录
      const tree = await TreeManageService.updateTree(id, req.body);
      console.log('更新结果:', tree);
      
      // 返回200成功响应，包含更新后的树木管理信息
      res.status(200).json({
        success: true,              // 操作成功标识
        message: '树木更新成功',  // 成功消息
        data: tree                // 更新后的树木管理数据
      });
    } catch (error) {
      console.error('更新树木失败:', error);
      // 捕获错误并传递给错误处理中间件
      next(error);
    }
  }

  /**
   * 删除树木管理记录
   * 
   * @param {Object} req - Express请求对象
   * @param {Object} req.params - URL路径参数
   * @param {string} req.params.id - 树木管理记录ID
   * @param {Object} res - Express响应对象
   * @param {Function} next - Express下一个中间件函数（错误处理）
   * @returns {Promise<void>} - 返回删除结果或错误
   */
  async deleteTree(req, res, next) {
    try {
      // 从URL路径参数中获取树木管理记录ID
      const { id } = req.params;
      
      // 调用Service层删除树木管理记录
      await TreeManageService.deleteTree(id);
      
      // 返回200成功响应
      res.status(200).json({
        success: true,              // 操作成功标识
        message: '树木删除成功'   // 成功消息
      });
    } catch (error) {
      // 捕获错误并传递给错误处理中间件
      next(error);
    }
  }
}

// 导出TreeManageController的单例实例
module.exports = new TreeManageController();