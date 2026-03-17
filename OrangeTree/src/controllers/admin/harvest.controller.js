const HarvestService = require('../../services/admin/harvest.service');

/**
 * 收获管理控制器
 * 处理收获管理相关的HTTP请求，包括查询收获记录列表、创建和更新
 * 所有方法都是异步的，使用try-catch捕获错误并传递给错误处理中间件
 */
class HarvestController {
  /**
   * 获取收获记录列表
   * 支持分页和筛选
   * 
   * @param {Object} req - Express请求对象
   * @param {Object} req.query - 查询字符串参数
   * @param {number} [req.query.page=1] - 页码，默认为1
   * @param {number} [req.query.limit=10] - 每页数量，默认为10
   * @param {number} [req.query.tree_id] - 树木ID筛选
   * @param {string} [req.query.harvest_batch] - 收获批次筛选
   * @param {Object} res - Express响应对象
   * @param {Function} next - Express下一个中间件函数（错误处理）
   * @returns {Promise<void>} - 返回收获记录列表或错误
   */
  async getHarvests(req, res, next) {
    try {
      // 调用Service层获取收获记录列表
      // req.query包含分页和筛选参数
      const result = await HarvestService.getHarvests(req.query);
      
      // 返回200成功响应，包含收获记录列表
      res.status(200).json({
        success: true,  // 操作成功标识
        data: result.data,    // 收获记录列表
        pagination: result.pagination  // 分页信息
      });
    } catch (error) {
      // 捕获错误并传递给错误处理中间件
      next(error);
    }
  }

  /**
   * 创建新的收获记录
   * 
   * @param {Object} req - Express请求对象
   * @param {Object} req.body - 请求体，包含收获信息
   * @param {number} req.body.tree_id - 树木ID
   * @param {string} req.body.harvest_batch - 收获批次
   * @param {Date} req.body.harvest_date - 收获日期
   * @param {number} req.body.yield - 产量（斤）
   * @param {string} req.body.quality_grade - 质量等级
   * @param {string} req.body.storage_location - 存放位置
   * @param {number} req.body.operator_id - 操作员ID
   * @param {Object} res - Express响应对象
   * @param {Function} next - Express下一个中间件函数（错误处理）
   * @returns {Promise<void>} - 返回创建的收获记录或错误
   */
  async createHarvest(req, res, next) {
    try {
      // 调用Service层创建收获记录
      // req.body包含收获的详细信息
      const harvest = await HarvestService.createHarvest(req.body);
      
      // 返回201 Created响应，表示资源创建成功
      res.status(201).json({
        success: true,                // 操作成功标识
        message: '收获记录创建成功', // 成功消息
        data: harvest                // 创建的收获记录数据
      });
    } catch (error) {
      // 捕获错误并传递给错误处理中间件
      next(error);
    }
  }

  /**
   * 更新收获记录
   * 
   * @param {Object} req - Express请求对象
   * @param {Object} req.params - URL路径参数
   * @param {string} req.params.id - 收获记录ID
   * @param {Object} req.body - 请求体，包含要更新的收获信息
   * @param {Date} [req.body.harvest_date] - 收获日期
   * @param {number} [req.body.yield] - 产量（斤）
   * @param {string} [req.body.quality_grade] - 质量等级
   * @param {string} [req.body.storage_location] - 存放位置
   * @param {Object} res - Express响应对象
   * @param {Function} next - Express下一个中间件函数（错误处理）
   * @returns {Promise<void>} - 返回更新后的收获记录或错误
   */
  async updateHarvest(req, res, next) {
    try {
      // 从URL路径参数中获取收获记录ID
      const { id } = req.params;
      
      // 调用Service层更新收获记录
      const harvest = await HarvestService.updateHarvest(id, req.body);
      
      // 返回200成功响应，包含更新后的收获记录
      res.status(200).json({
        success: true,                // 操作成功标识
        message: '收获记录更新成功', // 成功消息
        data: harvest                // 更新后的收获记录数据
      });
    } catch (error) {
      // 捕获错误并传递给错误处理中间件
      next(error);
    }
  }
}

// 导出HarvestController的单例实例
module.exports = new HarvestController();