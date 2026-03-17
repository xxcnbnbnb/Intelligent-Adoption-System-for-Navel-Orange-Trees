const Joi = require('joi');

/**
 * 树木信息相关的验证规则
 * 使用Joi库定义各种请求参数的验证规则
 * 提供友好的中文错误提示信息
 */
const treeSchemas = {
  /**
   * 查询参数的验证规则
   * 验证URL查询字符串中的分页和筛选参数
   * 
   * @example
   * const { error } = treeSchemas.query.validate(req.query);
   * if (error) {
   *   return res.status(400).json({ message: error.details[0].message });
   * }
   */
  query: Joi.object({
    // 页码：必须是大于等于1的整数，默认为1
    page: Joi.number().integer().min(1).default(1),
    
    // 每页数量：必须是1-100之间的整数，默认为10
    limit: Joi.number().integer().min(1).max(100).default(10),
    
    // 树木状态筛选：必须是available、adopted或maintaining之一
    status: Joi.string().valid('available', 'adopted', 'maintaining'),
    
    // 品种筛选：最多50个字符
    variety: Joi.string().max(50)
  })
};

// 导出所有验证规则
module.exports = treeSchemas;