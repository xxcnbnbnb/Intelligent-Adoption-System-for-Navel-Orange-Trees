const express = require('express');
const router = express.Router();

// 导入中间件
const authMiddleware = require('../middleware/auth.middleware');

// 导入用户端控制器
const userController = require('../controllers/user/user.controller');
const adoptionController = require('../controllers/user/adoption.controller');
const treeController = require('../controllers/user/tree.controller');
const growthController = require('../controllers/user/growth.controller');
const logisticsController = require('../controllers/user/logistics.controller');
const interactionController = require('../controllers/user/interaction.controller');

// ==================== 登录路由 ====================

/**
 * POST /api/user/register
 * 用户注册
 * 不需要JWT认证
 * 请求体：{ phone, password, nickname }
 */
router.post('/register', userController.register);

/**
 * POST /api/user/login
 * 用户登录
 * 不需要JWT认证
 * 请求体：{ phone, password }
 */
router.post('/login', userController.login);

// 应用身份认证中间件
// 所有用户端路由都需要先验证JWT令牌
router.use(authMiddleware);

// ==================== 用户管理路由 ====================

/**
 * GET /api/user/profile
 * 获取当前用户的个人资料
 * 需要JWT认证
 */
router.get('/profile', userController.getProfile);

/**
 * PUT /api/user/profile
 * 更新当前用户的个人资料
 * 需要JWT认证
 * 请求体：{ nickname?, avatar? }
 */
router.put('/profile', userController.updateProfile);

// ==================== 认养订单路由 ====================

/**
 * POST /api/user/adoptions
 * 创建新的认养订单
 * 需要JWT认证
 * 请求体：{ tree_id, adopt_years }
 */
router.post('/adoptions', adoptionController.createAdoption);

/**
 * GET /api/user/adoptions/:id
 * 获取指定认养订单的详情
 * 需要JWT认证
 * 路径参数：id - 订单ID
 */
router.get('/adoptions/:id', adoptionController.getAdoptionById);

/**
 * GET /api/user/adoptions
 * 获取当前用户的认养订单列表
 * 需要JWT认证
 * 查询参数：page, limit, status
 */
router.get('/adoptions', adoptionController.getUserAdoptions);

/**
 * PUT /api/user/adoptions/:id/status
 * 更新认养订单的状态
 * 需要JWT认证
 * 路径参数：id - 订单ID
 * 请求体：{ status }
 */
router.put('/adoptions/:id/status', adoptionController.updateAdoptionStatus);

// ==================== 树木信息路由 ====================

/**
 * GET /api/user/trees
 * 获取树木列表（支持分页和筛选）
 * 需要JWT认证
 * 查询参数：page, limit, status, variety
 */
router.get('/trees', treeController.getTrees);

/**
 * GET /api/user/trees/:id
 * 获取指定树木的详情
 * 需要JWT认证
 * 路径参数：id - 树木ID
 */
router.get('/trees/:id', treeController.getTreeById);

// ==================== 生长记录路由 ====================

/**
 * GET /api/user/trees/:treeId/growth
 * 获取指定树木的生长记录列表
 * 需要JWT认证
 * 路径参数：treeId - 树木ID
 * 查询参数：page, limit
 */
router.get('/trees/:treeId/growth', growthController.getGrowthRecords);

/**
 * GET /api/user/growth/:id
 * 获取指定生长记录的详情
 * 需要JWT认证
 * 路径参数：id - 生长记录ID
 */
router.get('/growth/:id', growthController.getGrowthRecordById);

// ==================== 物流信息路由 ====================
/**
 * GET /api/user/logistics
 * 获取当前用户的物流列表
 * 需要JWT认证
 * 查询参数：page, limit, status
 */
router.get('/logistics', logisticsController.getUserLogisticsList);

/**
 * GET /api/user/adoptions/:adoptionId/logistics
 * 获取指定认养订单的物流信息
 * 需要JWT认证
 * 路径参数：adoptionId - 认养订单ID
 */
router.get('/adoptions/:adoptionId/logistics', logisticsController.getLogistics);

/**
 * POST /api/user/logistics
 * 创建物流信息
 * 需要JWT认证
 * 请求体：{ adopt_id, harvest_batch, product_amount, receiver_name, receiver_phone, receiver_address }
 */
router.post('/logistics', logisticsController.createLogistics);

/**
 * PUT /api/user/logistics/:id
 * 更新物流信息
 * 需要JWT认证
 * 路径参数：id - 物流记录ID
 * 请求体：{ receiver_name?, receiver_phone?, receiver_address? }
 */
router.put('/logistics/:id', logisticsController.updateLogistics);

/**
 * PUT /api/user/logistics/:id/ship
 * 发货
 * 需要JWT认证
 * 路径参数：id - 物流记录ID
 * 请求体：{ logistics_company, logistics_no }
 */
router.put('/logistics/:id/ship', logisticsController.shipLogistics);

/**
 * PUT /api/user/logistics/:id/receive
 * 确认收货
 * 需要JWT认证
 * 路径参数：id - 物流记录ID
 */
router.put('/logistics/:id/receive', logisticsController.receiveLogistics);

/**
 * DELETE /api/user/logistics/:id
 * 删除物流信息
 * 需要JWT认证
 * 路径参数：id - 物流记录ID
 */
router.delete('/logistics/:id', logisticsController.deleteLogistics);

// ==================== 用户互动路由 ====================

/**
 * POST /api/user/interactions
 * 创建用户互动记录
 * 需要JWT认证
 * 请求体：{ tree_id, tree_name?, blessing?, share_platform? }
 */
router.post('/interactions', interactionController.createInteraction);

/**
 * GET /api/user/trees/:treeId/interactions
 * 获取指定树木的互动记录列表
 * 需要JWT认证
 * 路径参数：treeId - 树木ID
 * 查询参数：page, limit
 */
router.get('/trees/:treeId/interactions', interactionController.getTreeInteractions);

// 导出路由器
module.exports = router;