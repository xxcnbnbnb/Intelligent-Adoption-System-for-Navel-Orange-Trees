// 加载环境变量配置文件
// 从项目根目录的.env文件中读取配置
require('dotenv').config();

/**
 * 应用程序主配置对象
 * 集中管理所有配置项，从环境变量中读取
 * 提供默认值，确保应用在没有环境变量时也能运行
 * 
 * @module config
 * @property {string} env - 运行环境（development/production/test）
 * @property {number} port - 服务器监听端口
 * @property {Object} database - 数据库配置
 * @property {Object} jwt - JWT认证配置
 * @property {Object} alipay - 支付宝配置
 * @property {Object} wechat - 微信支付配置
 * @property {Object} redis - Redis缓存配置
 * @property {Object} upload - 文件上传配置
 * @property {Object} log - 日志配置
 */
module.exports = {
  // ==================== 应用基础配置 ====================
  
  /**
   * 运行环境
   * development: 开发环境
   * production: 生产环境
   * test: 测试环境
   */
  env: process.env.NODE_ENV || 'development',
  
  /**
   * 服务器监听端口
   * 默认为3000，可通过环境变量PORT修改
   */
  port: process.env.PORT || 3000,

  // ==================== 数据库配置 ====================
  
  database: {
    /**
     * 用户端数据库配置
     * 用于存储用户、认养订单、树木信息等业务数据
     */
    user: {
      host: process.env.DB_HOST || 'localhost',           // 数据库主机地址
      port: process.env.DB_PORT || 3306,               // 数据库端口
      user: process.env.DB_USER || 'root',              // 数据库用户名
      password: process.env.DB_PASSWORD || '',              // 数据库密码
      database: process.env.DB_NAME || 'orange_user'      // 数据库名称
    },
    
    /**
     * 管理员端数据库配置
     * 用于存储管理员、角色、操作日志等后台数据
     */
    admin: {
      host: process.env.ADMIN_DB_HOST || 'localhost',         // 数据库主机地址
      port: process.env.ADMIN_DB_PORT || 3306,            // 数据库端口
      user: process.env.ADMIN_DB_USER || 'root',            // 数据库用户名
      password: process.env.ADMIN_DB_PASSWORD || '',            // 数据库密码
      database: process.env.ADMIN_DB_NAME || 'orange_admin'    // 数据库名称
    }
  },

  // ==================== JWT认证配置 ====================
  
  jwt: {
    /**
     * JWT密钥
     * 用于签名和验证JWT令牌
     * 生产环境必须使用强密钥
     */
    secret: process.env.JWT_SECRET || 'your-secret-key',
    
    /**
     * JWT令牌过期时间
     * 格式：数字 + 单位（s=秒，m=分钟，h=小时，d=天）
     * 默认为7天
     */
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },

  // ==================== 支付宝配置 ====================
  
  alipay: {
    /**
     * 支付宝应用ID
     * 在支付宝开放平台创建应用后获取
     */
    appId: process.env.ALIPAY_APP_ID || '',
    
    /**
     * 支付宝应用私钥
     * 用于签名请求，必须保密
     */
    privateKey: process.env.ALIPAY_PRIVATE_KEY || '',
    
    /**
     * 支付宝公钥
     * 用于验证支付宝回调签名
     */
    publicKey: process.env.ALIPAY_PUBLIC_KEY || ''
  },

  // ==================== 微信支付配置 ====================
  
  wechat: {
    /**
     * 微信应用ID
     * 在微信公众平台或开放平台创建应用后获取
     */
    appId: process.env.WECHAT_APP_ID || '',
    
    /**
     * 微信应用密钥
     * 用于调用微信API，必须保密
     */
    appSecret: process.env.WECHAT_APP_SECRET || ''
  },

  // ==================== Redis缓存配置 ====================
  
  redis: {
    /**
     * Redis服务器地址
     * 默认为localhost
     */
    host: process.env.REDIS_HOST || 'localhost',
    
    /**
     * Redis服务器端口
     * 默认为6379
     */
    port: process.env.REDIS_PORT || 6379,
    
    /**
     * Redis密码
     * 如果Redis设置了密码则需要提供
     */
    password: process.env.REDIS_PASSWORD || ''
  },

  // ==================== 文件上传配置 ====================
  
  upload: {
    /**
     * 文件上传目录
     * 相对于项目根目录的路径
     */
    dir: process.env.UPLOAD_DIR || './uploads',
    
    /**
     * 最大文件大小（字节）
     * 默认为10MB（10485760字节）
     */
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760
  },

  // ==================== 日志配置 ====================
  
  log: {
    /**
     * 日志级别
     * error: 只记录错误
     * warn: 记录警告和错误
     * info: 记录信息、警告和错误
     * debug: 记录所有级别
     */
    level: process.env.LOG_LEVEL || 'info',
    
    /**
     * 日志文件目录
     * 相对于项目根目录的路径
     */
    dir: process.env.LOG_DIR || './logs'
  }
};