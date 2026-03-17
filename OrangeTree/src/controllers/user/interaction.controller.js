const InteractionService = require('../../services/user/interaction.service');

/**
 * 用户互动控制器
 * 处理用户互动相关的HTTP请求，包括创建互动记录和查询互动列表
 * 所有方法都是异步的，使用try-catch捕获错误并传递给错误处理中间件
 */
class InteractionController {
  /**
   * 创建用户互动记录
   * 用户为树木起昵称、留言祝福或分享到社交平台
   * 
   * @param {Object} req - Express请求对象
   * @param {Object} req.user - 从JWT令牌解码的用户信息
   * @param {number} req.user.id - 用户ID
   * @param {Object} req.body - 请求体，包含互动信息
   * @param {number} req.body.tree_id - 树木ID
   * @param {string} [req.body.tree_name] - 用户为树木起的昵称
   * @param {string} [req.body.blessing] - 用户留言祝福内容
   * @param {string} [req.body.share_platform] - 分享到的社交平台（wechat/weibo/qq）
   * @param {Date} [req.body.share_time] - 分享时间
   * @param {Object} res - Express响应对象
   * @param {Function} next - Express下一个中间件函数（错误处理）
   * @returns {Promise<void>} - 返回创建的互动记录或错误
   */
  async createInteraction(req, res, next) {
    try {
      // 调用Service层创建互动记录
      // req.user.id是发起互动的用户ID
      // req.body包含互动的详细信息
      const interaction = await InteractionService.createInteraction(req.user.id, req.body);
      
      // 返回201 Created响应，表示资源创建成功
      res.status(201).json({
        success: true,              // 操作成功标识
        message: '互动记录创建成功', // 成功消息
        data: interaction            // 创建的互动记录数据
      });
    } catch (error) {
      // 捕获错误并传递给错误处理中间件
      next(error);
    }
  }

  /**
   * 获取指定树木的互动记录列表
   * 支持分页查询
   * 
   * @param {Object} req - Express请求对象
   * @param {Object} req.params - URL路径参数
   * @param {string} req.params.treeId - 树木ID
   * @param {Object} req.query - 查询字符串参数
   * @param {number} [req.query.page=1] - 页码，默认为1
   * @param {number} [req.query.limit=10] - 每页数量，默认为10
   * @param {Object} res - Express响应对象
   * @param {Function} next - Express下一个中间件函数（错误处理）
   * @returns {Promise<void>} - 返回互动记录列表或错误
   */
  async getTreeInteractions(req, res, next) {
    try {
      // 从URL路径参数中获取树木ID
      const { treeId } = req.params;
      
      // 调用Service层获取互动记录列表
      // req.query包含分页参数
      const interactions = await InteractionService.getTreeInteractions(treeId, req.query);
      
      // 返回200成功响应，包含互动记录列表
      res.status(200).json({
        success: true,  // 操作成功标识
        data: interactions  // 互动记录列表
      });
    } catch (error) {
      // 捕获错误并传递给错误处理中间件
      next(error);
    }
  }
}

// 导出InteractionController的单例实例
module.exports = new InteractionController();