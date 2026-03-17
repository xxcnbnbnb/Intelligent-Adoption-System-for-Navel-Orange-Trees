const cors = require('cors');

/**
 * CORS跨域中间件配置
 * 允许前端应用从不同域访问API接口
 * 
 * 配置说明：
 * - origin: 允许的源地址，*表示允许所有源
 * - methods: 允许的HTTP方法
 * - allowedHeaders: 允许的请求头
 * - credentials: 是否允许发送Cookie和认证信息
 */
const corsMiddleware = cors({
  // 允许的源地址，从环境变量读取，默认为*（允许所有源）
  // 生产环境应该指定具体的域名，如 'https://example.com'
  origin: process.env.CORS_ORIGIN || '*',
  
  // 允许的HTTP方法列表
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  
  // 允许的请求头列表
  // Content-Type: 用于指定请求体的媒体类型
  // Authorization: 用于发送JWT令牌等认证信息
  allowedHeaders: ['Content-Type', 'Authorization'],
  
  // 是否允许发送Cookie和认证信息
  // 当设置为true时，前端请求需要设置withCredentials: true
  credentials: true
});

module.exports = corsMiddleware;