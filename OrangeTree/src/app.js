const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// 导入自定义中间件
const errorHandler = require('./middleware/error.middleware');
const loggerMiddleware = require('./middleware/logger.middleware');
const corsMiddleware = require('./middleware/cors.middleware');

// 导入路由
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');

// 创建Express应用实例
const app = express();

// ==================== 安全中间件 ====================

/**
 * 使用Helmet中间件增强HTTP安全性
 * 设置各种HTTP头，保护应用免受已知的Web漏洞
 * 包括：XSS保护、内容安全策略、点击劫持保护等
 */
app.use(helmet());

/**
 * 使用自定义CORS中间件
 * 允许前端应用从不同域访问API接口
 * 配置在cors.middleware.js中定义
 */
app.use(corsMiddleware);

/**
 * 使用Morgan日志中间件
 * 记录HTTP请求日志，格式为combined（Apache风格）
 * 包含：远程地址、请求方法、URL、HTTP版本、状态码、响应大小等
 */
app.use(morgan('combined'));

// ==================== 请求解析中间件 ====================

/**
 * 解析JSON格式的请求体
 * limit: '10mb' - 限制请求体最大为10MB
 * 用于处理POST/PUT请求中的JSON数据
 */
app.use(express.json({ limit: '10mb' }));

/**
 * 解析URL编码格式的请求体
 * extended: true - 使用qs库解析复杂对象
 * limit: '10mb' - 限制请求体最大为10MB
 * 用于处理表单提交的数据
 */
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==================== 限流中间件 ====================

/**
 * 配置请求限流中间件
 * 防止API被恶意频繁调用，保护服务器资源
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 时间窗口：15分钟（毫秒）
  max: 100,                     // 时间窗口内最多允许100个请求
  message: '请求过于频繁，请稍后再试'  // 超出限制时的提示消息
});

/**
 * 对/api/路径下的所有请求应用限流
 * 保护API接口不被过度调用
 */
app.use('/api/', limiter);

// ==================== 自定义中间件 ====================

/**
 * 使用自定义日志中间件
 * 记录每个请求的方法、URL、状态码和处理时间
 * 在logger.middleware.js中定义
 */
app.use(loggerMiddleware);

// ==================== 路由注册 ====================

/**
 * 注册用户端路由
 * 所有用户端API路径以/api/user开头
 * 包括：用户管理、认养订单、树木信息、生长记录、物流、互动等
 */
app.use('/api/user', userRoutes);

/**
 * 注册管理员端路由
 * 所有管理员端API路径以/api/admin开头
 * 包括：管理员管理、角色权限、操作日志、树木管理、收获管理等
 */
app.use('/api/admin', adminRoutes);

// ==================== 健康检查路由 ====================

/**
 * 健康检查接口
 * 用于负载均衡器或监控系统检查服务是否正常运行
 * 不需要认证，返回服务状态和时间戳
 * 
 * @route GET /health
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',                              // 服务状态：正常
    timestamp: new Date().toISOString()              // 当前服务器时间（ISO 8601格式）
  });
});

// ==================== 错误处理中间件 ====================

/**
 * 全局错误处理中间件
 * 捕获所有未处理的错误，统一返回错误响应
 * 必须放在所有路由之后，确保能捕获所有错误
 */
app.use(errorHandler);

// 导出Express应用实例
// 供server.js使用，启动HTTP服务器
module.exports = app;