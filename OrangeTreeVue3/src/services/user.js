import api from './api';

export const userApi = {
  // 注册
  register: (data) => api.post('/user/register', data),
  
  // 登录
  login: (data) => api.post('/user/login', data),
  
  // 获取个人资料
  getProfile: () => api.get('/user/profile'),
  
  // 更新个人资料
  updateProfile: (data) => api.put('/user/profile', data),
  
  // 获取树木列表
  getTrees: (params) => api.get('/user/trees', { params }),
  
  // 获取树木详情
  getTreeById: (id) => api.get(`/user/trees/${id}`),
  
  // 创建认养订单
  createAdoption: (data) => api.post('/user/adoptions', data),
  
  // 获取订单列表
  getUserAdoptions: (params) => api.get('/user/adoptions', { params }),
  
  // 获取订单详情
  getAdoptionById: (id) => api.get(`/user/adoptions/${id}`),
  
  // 更新订单状态
  updateAdoptionStatus: (id, data) => api.put(`/user/adoptions/${id}/status`, data),
  
  // 获取生长记录
  getGrowthRecords: (treeId, params) => api.get(`/user/trees/${treeId}/growth`, { params }),
  
  // 获取生长记录详情
  getGrowthRecordById: (id) => api.get(`/user/growth/${id}`),
  
  // 获取物流信息
  getLogistics: (adoptionId) => api.get(`/user/adoptions/${adoptionId}/logistics`),
  
  // 获取物流列表
  getUserLogisticsList: (params) => api.get('/user/logistics', { params }),
  
  // 创建物流信息
  createLogistics: (data) => api.post('/user/logistics', data),
  
  // 更新物流信息
  updateLogistics: (id, data) => api.put(`/user/logistics/${id}`, data),
  
  // 发货
  shipLogistics: (id, data) => api.put(`/user/logistics/${id}/ship`, data),
  
  // 确认收货
  receiveLogistics: (id) => api.put(`/user/logistics/${id}/receive`),
  
  // 删除物流信息
  deleteLogistics: (id) => api.delete(`/user/logistics/${id}`),
  
  // 创建互动记录
  createInteraction: (data) => api.post('/user/interactions', data),
  
  // 获取树木互动记录
  getTreeInteractions: (treeId, params) => api.get(`/user/trees/${treeId}/interactions`, { params })
};