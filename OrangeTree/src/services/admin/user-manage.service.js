const UserManageRepository = require('../../repositories/admin/user-manage.repository');

/**
 * 管理员端用户管理服务类
 * 处理用户管理的业务逻辑，包括查询用户列表、查看用户详情、更新用户信息和删除用户
 * 协调多个Repository的数据访问
 */
class UserManageService {
  /**
   * 获取用户列表（支持分页和筛选）
   * 管理员可以查看所有认养用户
   * 
   * @param {Object} query - 查询参数
   * @param {number} [query.page=1] - 页码，默认为1
   * @param {number} [query.limit=10] - 每页数量，默认为10
   * @param {string} [query.status] - 用户状态筛选（active/disabled）
   * @param {string} [query.phone] - 手机号筛选
   * @param {string} [query.nickname] - 昵称筛选
   * @returns {Promise<Object>} 返回包含用户列表和分页信息的对象
   */
  async getUsers(query) {
    // 解析查询参数，设置默认值
    const { page = 1, limit = 10, status, phone, nickname } = query;
    
    // 计算分页偏移量：offset = (page - 1) * limit
    const offset = (page - 1) * limit;

    // 调用Repository层查询用户列表
    const result = await UserManageRepository.findAll({
      limit,      // 每页数量
      offset,     // 偏移量
      status,     // 用户状态筛选
      phone,      // 手机号筛选
      nickname    // 昵称筛选
    });

    // 返回查询结果（包含用户列表和分页信息）
    return result;
  }

  /**
   * 获取用户详情
   * 查询用户信息并关联其订单和果树信息
   * 
   * @param {number} userId - 用户ID
   * @returns {Promise<Object>} 返回包含用户、订单和果树信息的对象
   * @throws {Error} 当用户不存在时抛出错误
   */
  async getUserDetail(userId) {
    // 调用Repository层查询用户详情
    const user = await UserManageRepository.findById(userId);
    if (!user) {
      throw new Error('用户不存在');
    }

    // 调用Repository层查询用户的订单列表
    const adoptions = await UserManageRepository.findAdoptionsByUserId(userId);

    // 调用Repository层查询用户的果树列表
    const trees = await UserManageRepository.findTreesByUserId(userId);

    // 组装返回数据，包含用户、订单和果树信息
    return {
      ...user,  // 用户基本信息
      adoptions,  // 用户的订单列表
      trees      // 用户的果树列表
    };
  }

  /**
   * 更新用户信息
   * 管理员可以更新用户状态、昵称和大客户备注
   * 
   * @param {number} userId - 用户ID
   * @param {Object} userData - 要更新的用户信息
   * @param {string} [userData.nickname] - 昵称
   * @param {string} [userData.status] - 用户状态（active/disabled）
   * @param {string} [userData.vip_remark] - 大客户备注
   * @returns {Promise<Object>} 返回更新后的用户对象
   * @throws {Error} 当用户不存在时抛出错误
   */
  async updateUser(userId, userData) {
    // 调用Repository层更新用户信息
    const user = await UserManageRepository.update(userId, userData);
    return user;
  }

  /**
   * 删除用户（软删除）
   * 管理员可以删除用户
   * 
   * @param {number} userId - 用户ID
   * @returns {Promise<Object>} 返回删除结果
   * @throws {Error} 当用户不存在时抛出错误
   */
  async deleteUser(userId) {
    // 调用Repository层删除用户
    const user = await UserManageRepository.delete(userId);
    return user;
  }
}

// 导出UserManageService的单例实例
module.exports = new UserManageService();
