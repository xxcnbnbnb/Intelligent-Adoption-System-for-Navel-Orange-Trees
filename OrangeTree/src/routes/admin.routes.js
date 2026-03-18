const express = require('express');
const router = express.Router();

// 导入中间件
const authMiddleware = require('../middleware/auth.middleware');
const adminAuthMiddleware = require('../middleware/admin-auth.middleware');

// 导入管理员端控制器
const adminController = require('../controllers/admin/admin.controller');
const roleController = require('../controllers/admin/role.controller');
const operationController = require('../controllers/admin/operation.controller');
const treeManageController = require('../controllers/admin/tree-manage.controller');
const harvestController = require('../controllers/admin/harvest.controller');
const adoptionController = require('../controllers/admin/adoption.controller');
const userManageController = require('../controllers/admin/user-manage.controller');
const logisticsController = require('../controllers/admin/logistics.controller');

// ==================== 登录路由 ====================

/**
 * POST /api/admin/login
 * 管理员登录
 * 不需要JWT认证
 * 请求体：{ username, password }
 */
router.post('/login', adminController.login);

// 应用身份认证中间件
// 验证JWT令牌的有效性
router.use(authMiddleware);

// 应用管理员权限认证中间件
// 验证用户角色是否为管理员
router.use(adminAuthMiddleware);

// ==================== 管理员管理路由 ====================

/**
 * GET /api/admin/profile
 * 获取当前管理员的个人资料
 * 需要管理员权限
 */
router.get('/profile', adminController.getProfile);

/**
 * PUT /api/admin/profile
 * 更新当前管理员的个人资料
 * 需要管理员权限
 * 请求体：{ real_name?, phone? }
 */
router.put('/profile', adminController.updateProfile);

// ==================== 角色权限路由 ====================

/**
 * GET /api/admin/roles
 * 获取角色列表（支持分页）
 * 需要管理员权限
 * 查询参数：page, limit
 */
router.get('/roles', roleController.getRoles);

/**
 * POST /api/admin/roles
 * 创建新角色
 * 需要管理员权限
 * 请求体：{ role_name, permissions }
 */
router.post('/roles', roleController.createRole);

/**
 * PUT /api/admin/roles/:id
 * 更新角色信息
 * 需要管理员权限
 * 路径参数：id - 角色ID
 * 请求体：{ role_name?, permissions? }
 */
router.put('/roles/:id', roleController.updateRole);

/**
 * DELETE /api/admin/roles/:id
 * 删除角色
 * 需要管理员权限
 * 路径参数：id - 角色ID
 */
router.delete('/roles/:id', roleController.deleteRole);

// ==================== 操作日志路由 ====================

/**
 * GET /api/admin/operations
 * 获取操作日志列表（支持分页和筛选）
 * 需要管理员权限
 * 查询参数：page, limit, admin_id, operation_module
 */
router.get('/operations', operationController.getOperations);

/**
 * GET /api/admin/operations/:id
 * 获取指定操作日志的详情
 * 需要管理员权限
 * 路径参数：id - 操作日志ID
 */
router.get('/operations/:id', operationController.getOperationById);

// ==================== 树木管理路由 ====================

/**
 * GET /api/admin/trees
 * 获取树木列表（支持分页和筛选）
 * 需要管理员权限
 * 查询参数：page, limit, status, variety
 */
router.get('/trees', treeManageController.getTrees);

/**
 * POST /api/admin/trees
 * 创建新的树木
 * 需要管理员权限
 * 请求体：{ id, name, variety, age, location, price, expectedYield, status, description }
 */
router.post('/trees', treeManageController.createTree);

/**
 * PUT /api/admin/trees/:id
 * 更新树木信息
 * 需要管理员权限
 * 路径参数：id - 树木ID
 * 请求体：{ name?, variety?, age?, location?, price?, expectedYield?, status?, description? }
 */
router.put('/trees/:id', treeManageController.updateTree);

/**
 * DELETE /api/admin/trees/:id
 * 删除树木
 * 需要管理员权限
 * 路径参数：id - 树木ID
 */
router.delete('/trees/:id', treeManageController.deleteTree);

// ==================== 收获管理路由 ====================

/**
 * GET /api/admin/harvests
 * 获取收获记录列表（支持分页和筛选）
 * 需要管理员权限
 * 查询参数：page, limit, tree_id, harvest_batch
 */
router.get('/harvests', harvestController.getHarvests);

/**
 * POST /api/admin/harvests
 * 创建新的收获记录
 * 需要管理员权限
 * 请求体：{ tree_id, harvest_batch, harvest_date, yield, quality_grade, storage_location, operator_id }
 */
router.post('/harvests', harvestController.createHarvest);

/**
 * PUT /api/admin/harvests/:id
 * 更新收获记录
 * 需要管理员权限
 * 路径参数：id - 收获记录ID
 * 请求体：{ harvest_date?, yield?, quality_grade?, storage_location? }
 */
router.put('/harvests/:id', harvestController.updateHarvest);

// ==================== 认养订单管理路由 ====================

/**
 * GET /api/admin/adoptions
 * 获取认养订单列表（支持分页和筛选）
 * 需要管理员权限
 * 查询参数：page, limit, status, user_id, tree_id
 */
router.get('/adoptions', adoptionController.getAdoptions);

/**
 * GET /api/admin/adoptions/:id
 * 获取指定认养订单的详情
 * 需要管理员权限
 * 路径参数：id - 订单ID
 */
router.get('/adoptions/:id', adoptionController.getAdoptionById);

/**
 * PUT /api/admin/adoptions/:id
 * 更新认养订单状态
 * 需要管理员权限
 * 路径参数：id - 订单ID
 * 请求体：{ status }
 */
router.put('/adoptions/:id', adoptionController.updateAdoptionStatus);

/**
 * DELETE /api/admin/adoptions/:id
 * 删除认养订单（软删除）
 * 需要管理员权限
 * 路径参数：id - 订单ID
 */
router.delete('/adoptions/:id', adoptionController.deleteAdoption);

// ==================== 用户管理路由 ====================

/**
 * GET /api/admin/users
 * 获取用户列表（支持分页和筛选）
 * 需要管理员权限
 * 查询参数：page, limit, status, phone, nickname
 */
router.get('/users', userManageController.getUsers);

/**
 * GET /api/admin/users/:id
 * 获取用户详情
 * 需要管理员权限
 * 路径参数：id - 用户ID
 */
router.get('/users/:id', userManageController.getUserById);

/**
 * PUT /api/admin/users/:id
 * 更新用户信息
 * 需要管理员权限
 * 路径参数：id - 用户ID
 * 请求体：{ nickname?, status?, vip_remark? }
 */
router.put('/users/:id', userManageController.updateUser);

/**
 * DELETE /api/admin/users/:id
 * 删除用户（软删除）
 * 需要管理员权限
 * 路径参数：id - 用户ID
 */
router.delete('/users/:id', userManageController.deleteUser);

// ==================== 物流管理路由 ====================

/**
 * GET /api/admin/logistics
 * 获取物流列表（支持分页和筛选）
 * 需要管理员权限
 * 查询参数：page, limit, status, adoption_id
 */
router.get('/logistics', logisticsController.getLogisticsList);

/**
 * GET /api/admin/logistics/:id
 * 获取指定物流的详情
 * 需要管理员权限
 * 路径参数：id - 物流ID
 */
router.get('/logistics/:id', logisticsController.getLogisticsById);

/**
 * POST /api/admin/logistics
 * 创建新的物流信息
 * 需要管理员权限
 * 请求体：{ adopt_id, harvest_batch, product_amount, receiver_name, receiver_phone, receiver_address, logistics_company?, logistics_no? }
 */
router.post('/logistics', logisticsController.createLogistics);

/**
 * PUT /api/admin/logistics/:id
 * 更新物流信息
 * 需要管理员权限
 * 路径参数：id - 物流ID
 * 请求体：{ receiver_name?, receiver_phone?, receiver_address?, logistics_company?, logistics_no? }
 */
router.put('/logistics/:id', logisticsController.updateLogistics);

/**
 * PUT /api/admin/logistics/:id/ship
 * 发货
 * 需要管理员权限
 * 路径参数：id - 物流ID
 * 请求体：{ logistics_company, logistics_no }
 */
router.put('/logistics/:id/ship', logisticsController.shipLogistics);

/**
 * DELETE /api/admin/logistics/:id
 * 删除物流信息（软删除）
 * 需要管理员权限
 * 路径参数：id - 物流ID
 */
router.delete('/logistics/:id', logisticsController.deleteLogistics);

// 导出路由器
module.exports = router;