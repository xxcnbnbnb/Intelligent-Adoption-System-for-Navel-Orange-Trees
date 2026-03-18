const UserRepository = require('../../repositories/user/user.repository');
const jwt = require('jsonwebtoken');
const config = require('../../config');

/**
 * 用户服务类
 * 处理用户相关的业务逻辑，包括查询用户信息、更新用户资料和用户登录
 * 协调Repository层的数据访问
 */
class UserService {
  /**
   * 用户注册
   * 创建新用户账号
   * 
   * @param {string} phone - 用户手机号
   * @param {string} password - 用户密码
   * @param {string} nickname - 用户昵称
   * @returns {Promise<Object>} 返回创建的用户对象
   * @throws {Error} 当手机号已被注册时抛出错误
   */
  async register(phone, password, nickname) {
    const existingUser = await UserRepository.findByPhone(phone);
    
    if (existingUser) {
      throw new Error('该手机号已被注册');
    }
    
    const newUser = await UserRepository.create({
      phone,
      password,
      nickname,
      status: 'active',
      is_deleted: 0
    });
    
    const { password: _, ...userInfo } = newUser;
    
    return userInfo;
  }

  /**
   * 获取用户个人资料
   * 根据用户ID查询用户信息
   * 
   * @param {number} userId - 用户ID
   * @returns {Promise<Object>} 返回用户对象
   * @throws {Error} 当用户不存在时抛出错误
   */
  async getProfile(userId) {
    // 调用Repository层查询用户
    const user = await UserRepository.findById(userId);
    
    // 验证用户是否存在
    if (!user) {
      throw new Error('用户不存在');
    }
    
    // 返回用户信息
    return user;
  }

  /**
   * 更新用户个人资料
   * 根据请求体中的数据更新用户信息
   * 
   * @param {number} userId - 用户ID
   * @param {Object} profileData - 要更新的用户信息
   * @param {string} [profileData.nickname] - 用户昵称
   * @param {string} [profileData.avatar] - 用户头像URL
   * @param {string} [profileData.phone] - 联系方式
   * @returns {Promise<Object>} 返回更新后的用户对象
   */
  async updateProfile(userId, profileData) {
    // 调用Repository层更新用户信息
    // userId是要更新的用户ID
    // profileData包含要更新的字段
    return await UserRepository.update(userId, profileData);
  }

  /**
   * 用户登录
   * 根据手机号和密码验证用户身份，生成JWT令牌
   * 
   * @param {string} phone - 用户手机号
   * @param {string} password - 用户密码
   * @returns {Promise<Object>} 返回包含令牌和用户信息的对象
   * @throws {Error} 当用户不存在、密码错误或用户被禁用时抛出错误
   */
  async login(phone, password) {
    // 根据手机号查询用户
    const user = await UserRepository.findByPhone(phone);
    
    // 验证用户是否存在
    if (!user) {
      throw new Error('用户不存在');
    }
    
    // 验证用户状态
    if (user.status !== 'active') {
      throw new Error('用户账号已被禁用');
    }
    
    // 验证密码
    console.log('用户输入的密码:', password);
    console.log('数据库中的密码:', user.password);
    // 由于项目中没有实现密码哈希，这里使用简单的字符串比较
    // 为了测试方便，允许直接比较密码
    if (user.password !== password) {
      throw new Error('密码错误');
    }
    
    // 生成JWT令牌
    const token = jwt.sign(
      {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        role: 'user' // 用户角色
      },
      config.jwt.secret,
      {
        expiresIn: config.jwt.expiresIn
      }
    );
    
    // 构建返回对象，不包含密码字段
    const userInfo = {
      id: user.id,
      phone: user.phone,
      nickname: user.nickname,
      avatar: user.avatar,
      status: user.status
    };
    
    return {
      token,
      user: userInfo
    };
  }
}

// 导出UserService的单例实例
module.exports = new UserService();