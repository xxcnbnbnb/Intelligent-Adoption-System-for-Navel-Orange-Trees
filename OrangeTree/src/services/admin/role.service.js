const RoleRepository = require('../../repositories/admin/role.repository');

/**
 * 角色服务类
 * 处理角色权限相关的业务逻辑，包括查询角色列表、创建、更新和删除角色
 * 协调Repository层的数据访问
 */
class RoleService {
  /**
   * 获取角色列表
   * 支持分页查询
   * 
   * @param {Object} query - 查询参数
   * @param {number} [query.page=1] - 页码，默认为1
   * @param {number} [query.limit=10] - 每页数量，默认为10
   * @returns {Promise<Object>} 返回包含角色列表和分页信息的对象
   */
  async getRoles(query) {
    // 解析查询参数，设置默认值
    const { page = 1, limit = 10 } = query;
    
    // 计算分页偏移量：offset = (page - 1) * limit
    const offset = (page - 1) * limit;

    // 调用Repository层查询角色列表
    const result = await RoleRepository.findAll({
      limit,      // 每页数量
      offset      // 偏移量
    });

    // 返回查询结果（包含角色列表和分页信息）
    return result;
  }

  /**
   * 创建新角色
   * 
   * @param {Object} roleData - 角色数据
   * @param {string} roleData.role_name - 角色名称
   * @param {Object} roleData.permissions - 权限配置对象
   * @returns {Promise<Object>} 返回创建的角色对象
   */
  async createRole(roleData) {
    // 调用Repository层创建角色
    return await RoleRepository.create(roleData);
  }

  /**
   * 更新角色信息
   * 
   * @param {number} roleId - 角色ID
   * @param {Object} roleData - 要更新的角色信息
   * @param {string} [roleData.role_name] - 角色名称
   * @param {Object} [roleData.permissions] - 权限配置对象
   * @returns {Promise<Object>} 返回更新后的角色对象
   */
  async updateRole(roleId, roleData) {
    // 调用Repository层更新角色信息
    return await RoleRepository.update(roleId, roleData);
  }

  /**
   * 删除角色
   * 
   * @param {number} roleId - 角色ID
   * @returns {Promise<Object>} 返回删除后的角色对象（软删除）
   */
  async deleteRole(roleId) {
    // 调用Repository层删除角色（软删除）
    return await RoleRepository.delete(roleId);
  }
}

// 导出RoleService的单例实例
module.exports = new RoleService();