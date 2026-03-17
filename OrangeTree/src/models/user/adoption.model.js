const { Model } = require('objection');
const { user: db } = require('../../config/database.config');

// 不要使用全局Model.knex()，而是在类中设置

/**
 * 认养订单模型（Model层）
 * 对应数据库表：user_adoptions
 * 定义认养订单的数据结构、验证规则和表关系
 * 使用Objection.js ORM框架实现数据模型映射
 */
class Adoption extends Model {
  /**
   * 指定对应的数据库表名
   * 
   * @returns {string} 数据库表名
   */
  static get tableName() {
    return 'user_adoptions';
  }

  /**
   * 指定主键字段名
   * 默认为'id'，这里显式声明以提高代码可读性
   * 
   * @returns {string} 主键字段名
   */
  static get idColumn() {
    return 'id';
  }

  /**
   * 定义JSON Schema验证规则
   * 用于验证插入和更新数据的有效性
   * 
   * @returns {Object} JSON Schema验证规则对象
   */
  static get jsonSchema() {
    return {
      type: 'object',
      // 必填字段列表
      required: ['user_id', 'tree_id', 'adopt_years', 'total_amount', 'start_date', 'end_date'],
      properties: {
        id: { type: 'integer' },                              // 订单ID（自增主键）
        user_id: { type: 'integer' },                           // 认养用户ID（逻辑关联user_users.id）
        tree_id: { type: 'integer' },                            // 被认养树木ID（逻辑关联user_trees.id）
        adopt_years: { type: 'integer', minimum: 1 },             // 认养年限，最少1年
        total_amount: { type: 'number', minimum: 0 },              // 订单总金额，不能为负数
        pay_status: { 
          type: 'string', 
          enum: ['unpaid', 'paid', 'canceled'],  // 支付状态枚举值
          default: 'unpaid'                              // 默认为未支付
        },
        pay_time: { type: 'string', format: 'date-time' },      // 支付成功时间
        agreement_no: { type: 'string' },                        // 电子认养协议编号（唯一）
        start_date: { type: 'string', format: 'date' },         // 认养开始日期
        end_date: { type: 'string', format: 'date' },           // 认养结束日期
        is_deleted: { 
          type: 'integer', 
          enum: [0, 1],                    // 软删除标记：0-未删除，1-已删除
          default: 0                              // 默认为未删除
        },
        created_at: { type: 'string', format: 'date-time' },     // 记录创建时间
        updated_at: { type: 'string', format: 'date-time' }      // 记录最后更新时间
      }
    };
  }

  /**
   * 定义表关系映射
   * 声明该模型与其他模型的关联关系
   * 注意：这些是逻辑关联，数据库层面没有外键约束
   * 
   * @returns {Object} 关系映射对象
   */
  static get relationMappings() {
    // 延迟加载关联模型，避免循环依赖
    const User = require('./user.model');
    const Tree = require('./tree.model');
    const GrowthRecord = require('./growth-record.model');
    const Logistics = require('./logistics.model');
    const PayRecord = require('./pay-record.model');

    return {
      // 认养订单属于一个用户（多对一关系）
      user: {
        relation: Model.BelongsToOneRelation,  // 多对一关系
        modelClass: User,                      // 关联的模型类
        join: {
          from: 'user_adoptions.user_id',       // 当前表的外键字段
          to: 'user_users.id'                  // 关联表的主键字段
        }
      },
      // 认养订单属于一棵树（多对一关系）
      tree: {
        relation: Model.BelongsToOneRelation,  // 多对一关系
        modelClass: Tree,                      // 关联的模型类
        join: {
          from: 'user_adoptions.tree_id',       // 当前表的外键字段
          to: 'user_trees.id'                  // 关联表的主键字段
        }
      },
      // 一个认养订单可以有多个生长记录（一对多关系）
      growth_records: {
        relation: Model.HasManyRelation,         // 一对多关系
        modelClass: GrowthRecord,               // 关联的模型类
        join: {
          from: 'user_adoptions.id',           // 当前表的主键字段
          to: 'user_growth_records.adopt_id'    // 关联表的外键字段
        }
      },
      // 一个认养订单对应一条物流记录（一对一关系）
      logistics: {
        relation: Model.HasOneRelation,          // 一对一关系
        modelClass: Logistics,                  // 关联的模型类
        join: {
          from: 'user_adoptions.id',           // 当前表的主键字段
          to: 'user_logistics.adopt_id'        // 关联表的外键字段
        }
      },
      // 一个认养订单可以有多个支付记录（一对多关系）
      pay_records: {
        relation: Model.HasManyRelation,         // 一对多关系
        modelClass: PayRecord,                  // 关联的模型类
        join: {
          from: 'user_adoptions.id',           // 当前表的主键字段
          to: 'user_pay_records.adopt_id'      // 关联表的外键字段
        }
      }
    };
  }

  /**
   * 插入前的钩子函数
   * 在数据插入数据库前自动执行
   * 用于设置创建时间和更新时间
   * 
   * @param {Object} queryContext - 查询上下文对象
   * @returns {Promise<void>}
   */
  async $beforeInsert(queryContext) {
    // 调用父类的钩子函数
    await super.$beforeInsert(queryContext);
    
    // 设置创建时间为当前时间
    // 格式化为MySQL DATETIME格式：YYYY-MM-DD HH:mm:ss
    this.created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    // 设置更新时间与创建时间相同
    this.updated_at = this.created_at;
  }

  /**
   * 更新前的钩子函数
   * 在数据更新前自动执行
   * 用于更新更新时间
   * 
   * @param {Object} opt - 更新选项对象
   * @param {Object} queryContext - 查询上下文对象
   * @returns {Promise<void>}
   */
  async $beforeUpdate(opt, queryContext) {
    // 调用父类的钩子函数
    await super.$beforeUpdate(opt, queryContext);
    
    // 更新更新时间为当前时间
    // 格式化为MySQL DATETIME格式：YYYY-MM-DD HH:mm:ss
    this.updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
  }
}

// 设置数据库连接
Adoption.knex(db);

// 导出Adoption模型类
module.exports = Adoption;