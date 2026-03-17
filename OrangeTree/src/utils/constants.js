/**
 * 应用程序常量定义
 * 集中管理所有业务常量，避免硬编码
 * 提高代码可维护性和可读性
 */
module.exports = {
  /**
   * 用户状态常量
   * 定义用户账号的启用和禁用状态
   */
  USER_STATUS: {
    ACTIVE: 'active',      // 用户账号正常，可以正常使用
    DISABLED: 'disabled'   // 用户账号已禁用，无法登录和使用
  },

  /**
   * 树木状态常量
   * 定义树木的认养和维护状态
   */
  TREE_STATUS: {
    AVAILABLE: 'available',    // 树木可认养，未被认养
    ADOPTED: 'adopted',        // 树木已被认养
    MAINTAINING: 'maintaining'  // 树木正在维护中，暂时不可认养
  },

  /**
   * 认养订单状态常量
   * 定义认养订单的支付状态
   */
  ADOPTION_STATUS: {
    UNPAID: 'unpaid',    // 订单未支付，等待用户完成支付
    PAID: 'paid',          // 订单已支付，认养关系已建立
    CANCELED: 'canceled'   // 订单已取消，认养关系未建立
  },

  /**
   * 支付方式常量
   * 定义支持的支付渠道
   */
  PAYMENT_METHOD: {
    ALIPAY: 'alipay',  // 支付宝支付
    WECHAT: 'wechat'    // 微信支付
  },

  /**
   * 物流状态常量
   * 定义物流配送的状态
   */
  LOGISTICS_STATUS: {
    PENDING: 'pending',    // 待发货，等待管理员发货
    SHIPPED: 'shipped',    // 已发货，物流已发出
    RECEIVED: 'received'   // 已签收，用户已确认收货
  },

  /**
   * 生长阶段常量
   * 定义树木生长的不同阶段
   */
  GROWTH_STAGE: {
    SPROUT: 'sprout',      // 发芽期
    FLOWERING: 'flowering',  // 开花期
    FRUITING: 'fruiting',   // 结果期
    MATURITY: 'maturity'     // 成熟期
  },

  /**
   * 管理员角色常量
   * 定义管理员的权限级别
   */
  ADMIN_ROLE: {
    SUPER_ADMIN: 'super_admin',  // 超级管理员，拥有所有权限
    OPERATOR: 'operator',        // 操作员，拥有部分操作权限
    VIEWER: 'viewer'           // 查看者，只有查看权限，不能修改数据
  },

  /**
   * 提醒类型常量
   * 定义续费提醒的发送方式
   */
  REMIND_TYPE: {
    SMS: 'sms',      // 短信提醒
    APP: 'app',      // 应用内推送提醒
    WECHAT: 'wechat'  // 微信公众号提醒
  },

  /**
   * 分享平台常量
   * 定义支持的社交分享平台
   */
  SHARE_PLATFORM: {
    WECHAT: 'wechat',  // 微信分享
    WEIBO: 'weibo',    // 微博分享
    QQ: 'qq'            // QQ分享
  }
};