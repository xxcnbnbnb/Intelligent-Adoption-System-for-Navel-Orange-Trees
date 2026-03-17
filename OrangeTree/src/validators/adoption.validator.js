const Joi = require('joi');

/**
 * 认养订单相关的验证规则
 * 使用Joi库定义各种请求参数的验证规则
 * 提供友好的中文错误提示信息
 */
const adoptionSchemas = {
  /**
   * 创建认养订单的验证规则
   * 验证请求体中的tree_id和adopt_years字段
   * 
   * @example
   * const { error } = adoptionSchemas.create.validate(req.body);
   * if (error) {
   *   return res.status(400).json({ message: error.details[0].message });
   * }
   */
  create: Joi.object({
    // 树木ID：必须是正整数，必填
    tree_id: Joi.number().integer().positive().required().messages({
      'number.base': '树木ID必须是数字',
      'number.positive': '树木ID必须大于0',
      'any.required': '树木ID不能为空'
    }),
    
    // 认养年限：必须是1-10之间的整数，必填
    adopt_years: Joi.number().integer().min(1).max(10).required().messages({
      'number.base': '认养年限必须是数字',
      'number.min': '认养年限至少为1年',
      'number.max': '认养年限最多为10年',
      'any.required': '认养年限不能为空'
    })
  }),

  /**
   * 更新订单状态的验证规则
   * 验证请求体中的status字段
   */
  updateStatus: Joi.object({
    // 订单状态：必须是unpaid、paid或canceled之一，必填
    status: Joi.string().valid('unpaid', 'paid', 'canceled').required().messages({
      'any.only': '状态值必须是unpaid、paid或canceled',
      'any.required': '状态不能为空'
    })
  }),

  /**
   * 查询参数的验证规则
   * 验证URL查询字符串中的分页和筛选参数
   */
  query: Joi.object({
    // 页码：必须是大于等于1的整数，默认为1
    page: Joi.number().integer().min(1).default(1),
    
    // 每页数量：必须是1-100之间的整数，默认为10
    limit: Joi.number().integer().min(1).max(100).default(10),
    
    // 订单状态筛选：必须是unpaid、paid或canceled之一，可选
    status: Joi.string().valid('unpaid', 'paid', 'canceled')
  })
};

// 导出所有验证规则
module.exports = adoptionSchemas;