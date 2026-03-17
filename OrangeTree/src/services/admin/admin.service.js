const AdminRepository = require('../../repositories/admin/admin.repository');
const jwt = require('jsonwebtoken');
const config = require('../../config');

/**
 * 管理员服务类
 * 处理管理员相关的业务逻辑，包括查询管理员信息、更新管理员资料和管理员登录
 * 协调Repository层的数据访问
 */
class AdminService {
  /**
   * 获取管理员个人资料
   * 根据管理员ID查询管理员信息
   * 
   * @param {number} adminId - 管理员ID
   * @returns {Promise<Object>} 返回管理员对象
   * @throws {Error} 当管理员不存在时抛出错误
   */
  async getProfile(adminId) {
    // 调用Repository层查询管理员
    const admin = await AdminRepository.findById(adminId);
    
    // 验证管理员是否存在
    if (!admin) {
      throw new Error('管理员不存在');
    }
    
    // 返回管理员信息
    return admin;
  }

  /**
   * 更新管理员个人资料
   * 根据请求体中的数据更新管理员信息
   * 
   * @param {number} adminId - 管理员ID
   * @param {Object} profileData - 要更新的管理员信息
   * @param {string} [profileData.real_name] - 管理员真实姓名
   * @param {string} [profileData.phone] - 联系方式
   * @returns {Promise<Object>} 返回更新后的管理员对象
   */
  async updateProfile(adminId, profileData) {
    // 调用Repository层更新管理员信息
    // adminId是要更新的管理员ID
    // profileData包含要更新的字段
    return await AdminRepository.update(adminId, profileData);
  }

  /**
   * 管理员登录
   * 根据用户名和密码验证管理员身份，生成JWT令牌
   * 
   * @param {string} username - 管理员用户名
   * @param {string} password - 管理员密码
   * @returns {Promise<Object>} 返回包含令牌和管理员信息的对象
   * @throws {Error} 当管理员不存在、密码错误或管理员被禁用时抛出错误
   */
  async login(username, password) {
    // 根据用户名查询管理员
    const admin = await AdminRepository.findByUsername(username);
    
    // 验证管理员是否存在
    if (!admin) {
      throw new Error('管理员不存在');
    }
    
    // 验证管理员状态
    if (admin.status !== 'active') {
      throw new Error('管理员账号已被禁用');
    }
    
    // 验证密码（这里假设密码已经在数据库中哈希存储，实际项目中应该使用bcrypt等库进行密码验证）
    // 由于项目中没有实现密码哈希，这里暂时使用简单的字符串比较
    if (admin.password !== password) {
      throw new Error('密码错误');
    }
    
    // 生成JWT令牌
    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        real_name: admin.real_name,
        role: 'admin' // 管理员角色
      },
      config.jwt.secret,
      {
        expiresIn: config.jwt.expiresIn
      }
    );
    
    // 构建返回对象，不包含密码字段
    const adminInfo = {
      id: admin.id,
      username: admin.username,
      real_name: admin.real_name,
      phone: admin.phone,
      role_id: admin.role_id,
      status: admin.status
    };
    
    return {
      token,
      admin: adminInfo
    };
  }
}

// 导出AdminService的单例实例
module.exports = new AdminService();