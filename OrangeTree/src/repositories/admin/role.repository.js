const Role = require('../../models/admin/role.model');

class RoleRepository {
  async findById(id, trx = null) {
    const query = Role.query(trx || Role.knex());
    const role = await query.findById(id);
    
    // 转换权限格式为前端期望的结构
    if (role && role.permissions) {
      let permissions = role.permissions;
      if (Array.isArray(permissions)) {
        // 转换数组格式为对象格式
        const formattedPermissions = {
          user: [],
          tree: [],
          adoption: []
        };
        permissions.forEach(permission => {
          if (permission.includes('user:')) {
            formattedPermissions.user.push(permission.split(':')[1]);
          } else if (permission.includes('tree:')) {
            formattedPermissions.tree.push(permission.split(':')[1]);
          } else if (permission.includes('order:') || permission.includes('adoption:')) {
            formattedPermissions.adoption.push(permission.split(':')[1]);
          }
        });
        role.permissions = formattedPermissions;
      }
    }
    
    return role;
  }

  async create(data, trx = null) {
    const query = Role.query(trx || Role.knex());
    return await query.insert(data);
  }

  async update(id, data, trx = null) {
    const query = Role.query(trx || Role.knex());
    return await query.patchAndFetchById(id, data);
  }

  async delete(id, trx = null) {
    const query = Role.query(trx || Role.knex());
    return await query.patchAndFetchById(id, { is_deleted: 1 });
  }

  async findAll(options = {}) {
    const { limit = 10, offset = 0 } = options;

    const results = await Role.query()
      .where('is_deleted', 0)
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    // 转换权限格式为前端期望的结构
    const formattedResults = results.map(role => {
      let permissions = role.permissions;
      if (Array.isArray(permissions)) {
        // 转换数组格式为对象格式
        const formattedPermissions = {
          user: [],
          tree: [],
          adoption: []
        };
        permissions.forEach(permission => {
          if (permission.includes('user:')) {
            formattedPermissions.user.push(permission.split(':')[1]);
          } else if (permission.includes('tree:')) {
            formattedPermissions.tree.push(permission.split(':')[1]);
          } else if (permission.includes('order:') || permission.includes('adoption:')) {
            formattedPermissions.adoption.push(permission.split(':')[1]);
          }
        });
        permissions = formattedPermissions;
      }
      return {
        ...role,
        permissions
      };
    });

    const total = await Role.query()
      .where('is_deleted', 0)
      .resultSize();

    return {
      data: formattedResults,
      pagination: {
        page: Math.floor(offset / limit) + 1,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
}

module.exports = new RoleRepository();