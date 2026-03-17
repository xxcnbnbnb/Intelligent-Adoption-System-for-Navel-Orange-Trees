const User = require('../../models/user/user.model');
const Adoption = require('../../models/user/adoption.model');
const Tree = require('../../models/user/tree.model');

/**
 * 管理员端用户管理仓库类
 * 处理用户相关的数据访问，包括查询用户列表、查看用户详情、更新用户信息和删除用户
 * 协调多个模型的数据访问
 */
class UserManageRepository {
  /**
   * 查询用户列表（支持分页和筛选）
   * 
   * @param {Object} options - 查询选项
   * @param {number} [options.limit=10] - 每页数量，默认为10
   * @param {number} [options.offset=0] - 偏移量，默认为0
   * @param {string} [options.status] - 用户状态筛选（active/disabled）
   * @param {string} [options.phone] - 手机号筛选
   * @param {string} [options.nickname] - 昵称筛选
   * @returns {Promise<Object>} 返回包含用户列表和分页信息的对象
   */
  async findAll(options = {}) {
    const { limit = 10, offset = 0, status, phone, nickname } = options;
    
    let query = User.query()
      .where('is_deleted', 0)
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);
    
    if (status) {
      query = query.where('status', status);
    }
    
    if (phone) {
      query = query.where('phone', 'like', `%${phone}%`);
    }
    
    if (nickname) {
      query = query.where('nickname', 'like', `%${nickname}%`);
    }
    
    const results = await query;
    const total = await User.query()
      .where('is_deleted', 0)
      .modify(function(queryBuilder) {
        if (status) {
          queryBuilder.where('status', status);
        }
        if (phone) {
          queryBuilder.where('phone', 'like', `%${phone}%`);
        }
        if (nickname) {
          queryBuilder.where('nickname', 'like', `%${nickname}%`);
        }
      })
      .resultSize();
    
    return {
      data: results,
      pagination: {
        page: Math.floor(offset / limit) + 1,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * 根据ID查询用户
   * 
   * @param {number} id - 用户ID
   * @returns {Promise<Object>} 返回用户对象
   */
  async findById(id) {
    return await User.query()
      .where('is_deleted', 0)
      .findById(id);
  }

  /**
   * 查询用户的订单列表
   * 
   * @param {number} userId - 用户ID
   * @returns {Promise<Array>} 返回用户的订单列表
   */
  async findAdoptionsByUserId(userId) {
    return await Adoption.query()
      .where('is_deleted', 0)
      .where('user_id', userId)
      .orderBy('created_at', 'desc')
      .limit(10);
  }

  /**
   * 查询用户的果树列表
   * 
   * @param {number} userId - 用户ID
   * @returns {Promise<Array>} 返回用户的果树列表
   */
  async findTreesByUserId(userId) {
    return await Tree.query()
      .where('is_deleted', 0)
      .where('user_id', userId)
      .orderBy('created_at', 'desc')
      .limit(10);
  }

  /**
   * 更新用户信息
   * 
   * @param {number} id - 用户ID
   * @param {Object} data - 要更新的用户数据
   * @returns {Promise<Object>} 返回更新后的用户对象
   */
  async update(id, data) {
    return await User.query()
      .where('is_deleted', 0)
      .patchAndFetchById(id, data);
  }

  /**
   * 删除用户（软删除）
   * 
   * @param {number} id - 用户ID
   * @returns {Promise<Object>} 返回删除后的用户对象
   */
  async delete(id) {
    return await User.query()
      .where('is_deleted', 0)
      .patchAndFetchById(id, { is_deleted: 1 });
  }
}

// 导出UserManageRepository的单例实例
module.exports = new UserManageRepository();
