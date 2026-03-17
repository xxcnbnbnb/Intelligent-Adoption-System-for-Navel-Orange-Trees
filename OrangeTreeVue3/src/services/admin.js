import api from './api';

export const adminApi = {
  // 登录
  login: (data) => api.post('/admin/login', data),
  
  // 获取个人资料
  getProfile: () => api.get('/admin/profile'),
  
  // 更新个人资料
  updateProfile: (data) => api.put('/admin/profile', data),
  
  // 获取角色列表
  getRoles: (params) => api.get('/admin/roles', { params }),
  
  // 创建角色
  createRole: (data) => api.post('/admin/roles', data),
  
  // 更新角色
  updateRole: (id, data) => api.put(`/admin/roles/${id}`, data),
  
  // 删除角色
  deleteRole: (id) => api.delete(`/admin/roles/${id}`),
  
  // 获取操作日志
  getOperations: (params) => api.get('/admin/operations', { params }),
  
  // 获取操作日志详情
  getOperationById: (id) => api.get(`/admin/operations/${id}`),
  
  // 获取树木管理列表
  getTrees: (params) => api.get('/admin/trees', { params }),
  
  // 创建树木管理记录
  createTree: (data) => api.post('/admin/trees', data),
  
  // 更新树木管理记录
  updateTree: (id, data) => api.put(`/admin/trees/${id}`, data),
  
  // 删除树木管理记录
  deleteTree: (id) => api.delete(`/admin/trees/${id}`),
  
  // 获取收获记录列表
  getHarvests: (params) => api.get('/admin/harvests', { params }),
  
  // 创建收获记录
  createHarvest: (data) => api.post('/admin/harvests', data),
  
  // 更新收获记录
  updateHarvest: (id, data) => api.put(`/admin/harvests/${id}`, data),
  
  // 获取认养订单列表
  getAdoptions: (params) => api.get('/admin/adoptions', { params }),
  
  // 获取认养订单详情
  getAdoptionById: (id) => api.get(`/admin/adoptions/${id}`),
  
  // 更新认养订单状态
  updateAdoptionStatus: (id, data) => api.put(`/admin/adoptions/${id}`, data),
  
  // 删除认养订单
  deleteAdoption: (id) => api.delete(`/admin/adoptions/${id}`),
  
  // 获取用户列表
  getUsers: (params) => api.get('/admin/users', { params }),
  
  // 获取用户详情
  getUserById: (id) => api.get(`/admin/users/${id}`),
  
  // 更新用户信息
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  
  // 删除用户
  deleteUser: (id) => api.delete(`/admin/users/${id}`)
};