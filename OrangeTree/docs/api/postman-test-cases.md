# 脐橙树认养系统 Postman 测试用例

## 📋 目录

- [前置准备](#前置准备)
- [数据库架构说明](#数据库架构说明)
- [登录测试](#登录测试)
- [用户端API测试](#用户端api测试)
- [管理员端API测试](#管理员端api测试)
- [测试数据说明](#测试数据说明)
- [错误响应示例](#错误响应示例)
- [测试建议与最佳实践](#测试建议与最佳实践)

---

## 前置准备

### 1. 环境准备

确保后端服务已启动：

```bash
cd c:\Users\XXC\Desktop\毕业论文\OrangeTree
npm run dev
```

启动成功后，服务地址为：
- 用户端API: `http://localhost:3000/api/user`
- 管理员端API: `http://localhost:3000/api/admin`
- 健康检查: `http://localhost:3000/health`

### 2. Postman环境配置

在Postman中配置以下环境变量：

| 变量名 | 值 | 说明 |
|---------|-----|------|
| `baseUrl` | `http://localhost:3000` | API基础地址 |
| `userToken` | `{{loginResponse.token}}` | 用户JWT令牌（登录后自动设置）|
| `adminToken` | `{{adminLoginResponse.token}}` | 管理员JWT令牌（登录后自动设置）|
| `userId` | `1` | 测试用户ID |
| `adminId` | `1` | 测试管理员ID |

### 3. 请求头配置

所有需要认证的接口都需要添加以下请求头：

```
Content-Type: application/json
Authorization: Bearer {{userToken}}  // 用户端
Authorization: Bearer {{adminToken}}  // 管理员端
```

---

## 数据库架构说明

### 1. 分离数据库架构

系统采用分离的数据库架构，确保数据安全性和管理权限的隔离：

- **用户数据库** (`orange_user`): 存储用户相关数据
  - 表：`user_users`, `user_trees`, `user_adoptions`, `user_growth_records`, `user_logistics`, `user_interactions`, `user_pay_records`, `user_renew_reminders`

- **管理员数据库** (`orange_admin`): 存储管理员相关数据
  - 表：`admin_users`, `admin_roles`, `admin_operation_logs`, `admin_tree_manage`, `admin_harvest_manage`, `admin_statistics`, `common_dict`

### 2. 数据库连接验证

在测试前，请确保：
1. 两个数据库都已创建并配置正确
2. 数据库表结构已正确建立
3. 数据库用户权限已正确设置
4. `.env` 文件中的数据库连接配置已正确填写

---

## 登录测试

### 1. 用户登录

**接口信息**
- 方法：`POST`
- 路径：`{{baseUrl}}/api/user/login`
- 认证：不需要JWT

**请求示例**
```http
POST {{baseUrl}}/api/user/login
Content-Type: application/json

{
  "phone": "13800138000",
  "password": "123456"
}
```

**预期响应**
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "phone": "13800138000",
      "nickname": "测试用户",
      "avatar": null,
      "status": "active"
    }
  }
}
```

### 2. 管理员登录

**接口信息**
- 方法：`POST`
- 路径：`{{baseUrl}}/api/admin/login`
- 认证：不需要JWT

**请求示例**
```http
POST {{baseUrl}}/api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**预期响应**
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": 1,
      "username": "admin",
      "real_name": "管理员",
      "phone": "13800138000",
      "role_id": 1,
      "status": "active"
    }
  }
}
```

### 3. 登录失败测试

**测试场景1: 用户名/手机号不存在**

**请求示例**
```http
POST {{baseUrl}}/api/user/login
Content-Type: application/json

{
  "phone": "12345678901",
  "password": "123456"
}
```

**预期响应**
```json
{
  "success": false,
  "message": "用户不存在"
}
```

**测试场景2: 密码错误**

**请求示例**
```http
POST {{baseUrl}}/api/user/login
Content-Type: application/json

{
  "phone": "13800138000",
  "password": "wrongpassword"
}
```

**预期响应**
```json
{
  "success": false,
  "message": "密码错误"
}
```

---

## 用户端API测试

### 1. 用户管理

#### 1.1 获取用户信息

**接口信息**
- 方法：`GET`
- 路径：`{{baseUrl}}/api/user/profile`
- 认证：需要JWT

**请求示例**
```http
GET {{baseUrl}}/api/user/profile
Authorization: Bearer {{userToken}}
```

**预期响应**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "phone": "13800138000",
    "nickname": "测试用户",
    "avatar": "https://example.com/avatar.jpg",
    "status": "active",
    "created_at": "2024-01-01 10:00:00",
    "updated_at": "2024-01-01 10:00:00"
  }
}
```

#### 1.2 更新用户信息

**接口信息**
- 方法：`PUT`
- 路径：`{{baseUrl}}/api/user/profile`
- 认证：需要JWT

**请求示例**
```http
PUT {{baseUrl}}/api/user/profile
Authorization: Bearer {{userToken}}
Content-Type: application/json

{
  "nickname": "更新后的昵称",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

**预期响应**
```json
{
  "success": true,
  "message": "个人资料更新成功",
  "data": {
    "id": 1,
    "phone": "13800138000",
    "nickname": "更新后的昵称",
    "avatar": "https://example.com/new-avatar.jpg",
    "status": "active",
    "updated_at": "2024-01-01 11:00:00"
  }
}
```

---

### 2. 认养订单管理

#### 2.1 创建认养订单

**接口信息**
- 方法：`POST`
- 路径：`{{baseUrl}}/api/user/adoptions`
- 认证：需要JWT

**请求示例**
```http
POST {{baseUrl}}/api/user/adoptions
Authorization: Bearer {{userToken}}
Content-Type: application/json

{
  "tree_id": 1,
  "adopt_years": 2
}
```

**预期响应**
```json
{
  "success": true,
  "message": "认养订单创建成功",
  "data": {
    "id": 1,
    "user_id": 1,
    "tree_id": 1,
    "adopt_years": 2,
    "total_amount": 2000,
    "pay_status": "unpaid",
    "agreement_no": "AGR17040672000001234",
    "start_date": "2024-01-01",
    "end_date": "2026-01-01",
    "created_at": "2024-01-01 10:00:00"
  }
}
```

#### 2.2 获取订单详情

**接口信息**
- 方法：`GET`
- 路径：`{{baseUrl}}/api/user/adoptions/1`
- 认证：需要JWT

**请求示例**
```http
GET {{baseUrl}}/api/user/adoptions/1
Authorization: Bearer {{userToken}}
```

**预期响应**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "tree_id": 1,
    "adopt_years": 2,
    "total_amount": 2000,
    "pay_status": "unpaid",
    "agreement_no": "AGR17040672000001234",
    "start_date": "2024-01-01",
    "end_date": "2026-01-01",
    "user_info": {
      "id": 1,
      "nickname": "测试用户",
      "avatar": "https://example.com/avatar.jpg"
    },
    "tree_info": {
      "id": 1,
      "tree_no": "TREE001",
      "variety": "纽荷尔脐橙",
      "age": 5,
      "location": "江西省赣州市",
      "cover_img": "https://example.com/tree-cover.jpg",
      "panorama_url": "https://example.com/panorama.jpg"
    }
  }
}
```

#### 2.3 获取用户订单列表

**接口信息**
- 方法：`GET`
- 路径：`{{baseUrl}}/api/user/adoptions`
- 认证：需要JWT

**请求示例**
```http
GET {{baseUrl}}/api/user/adoptions?page=1&limit=10&status=unpaid
Authorization: Bearer {{userToken}}
```

**预期响应**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "tree_id": 1,
      "adopt_years": 2,
      "total_amount": 2000,
      "pay_status": "unpaid",
      "agreement_no": "AGR17040672000001234",
      "start_date": "2024-01-01",
      "end_date": "2026-01-01"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

---

### 3. 树木信息管理

#### 3.1 获取树木列表

**接口信息**
- 方法：`GET`
- 路径：`{{baseUrl}}/api/user/trees`
- 认证：需要JWT

**请求示例**
```http
GET {{baseUrl}}/api/user/trees?page=1&limit=10&status=available&variety=纽荷尔脐橙
Authorization: Bearer {{userToken}}
```

**预期响应**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "tree_no": "TREE001",
      "variety": "纽荷尔脐橙",
      "age": 5,
      "location": "江西省赣州市",
      "status": "available",
      "price": 1000,
      "cover_img": "https://example.com/tree-cover.jpg",
      "panorama_url": "https://example.com/panorama.jpg"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 10,
    "pages": 1
  }
}
```

#### 3.2 获取树木详情

**接口信息**
- 方法：`GET`
- 路径：`{{baseUrl}}/api/user/trees/1`
- 认证：需要JWT

**请求示例**
```http
GET {{baseUrl}}/api/user/trees/1
Authorization: Bearer {{userToken}}
```

**预期响应**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "tree_no": "TREE001",
    "variety": "纽荷尔脐橙",
    "age": 5,
    "location": "江西省赣州市",
    "status": "available",
    "price": 1000,
    "cover_img": "https://example.com/tree-cover.jpg",
    "panorama_url": "https://example.com/panorama.jpg",
    "created_at": "2024-01-01 10:00:00",
    "updated_at": "2024-01-01 10:00:00"
  }
}
```

---

### 4. 生长记录管理

#### 4.1 获取树木生长记录列表

**接口信息**
- 方法：`GET`
- 路径：`{{baseUrl}}/api/user/trees/1/growth`
- 认证：需要JWT

**请求示例**
```http
GET {{baseUrl}}/api/user/trees/1/growth?page=1&limit=10
Authorization: Bearer {{userToken}}
```

**预期响应**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "tree_id": 1,
      "adopt_id": 1,
      "record_date": "2024-01-15",
      "growth_stage": "sprout",
      "content": "树木开始发芽，生长状况良好",
      "img_urls": "https://example.com/growth1.jpg,https://example.com/growth2.jpg",
      "video_url": "https://example.com/growth-video.mp4",
      "created_at": "2024-01-15 10:00:00"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 10,
    "pages": 1
  }
}
```

---

### 5. 物流信息管理

#### 5.1 获取订单物流信息

**接口信息**
- 方法：`GET`
- 路径：`{{baseUrl}}/api/user/adoptions/1/logistics`
- 认证：需要JWT

**请求示例**
```http
GET {{baseUrl}}/api/user/adoptions/1/logistics
Authorization: Bearer {{userToken}}
```

**预期响应**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "adopt_id": 1,
    "harvest_batch": "BATCH202401",
    "product_amount": 50,
    "receiver_name": "张三",
    "receiver_phone": "13800138000",
    "receiver_address": "广东省深圳市南山区科技园",
    "logistics_company": "顺丰速运",
    "logistics_no": "SF1234567890",
    "status": "shipped",
    "send_time": "2024-01-20 10:00:00",
    "created_at": "2024-01-20 09:00:00",
    "updated_at": "2024-01-20 10:00:00"
  }
}
```

---

### 6. 用户互动管理

#### 6.1 创建互动记录

**接口信息**
- 方法：`POST`
- 路径：`{{baseUrl}}/api/user/interactions`
- 认证：需要JWT

**请求示例**
```http
POST {{baseUrl}}/api/user/interactions
Authorization: Bearer {{userToken}}
Content-Type: application/json

{
  "tree_id": 1,
  "tree_name": "我的小橙树",
  "blessing": "希望小树茁壮成长，结出甜美的果实！",
  "share_platform": "wechat",
  "share_time": "2024-01-15 10:00:00"
}
```

**预期响应**
```json
{
  "success": true,
  "message": "互动记录创建成功",
  "data": {
    "id": 1,
    "user_id": 1,
    "tree_id": 1,
    "tree_name": "我的小橙树",
    "blessing": "希望小树茁壮成长，结出甜美的果实！",
    "share_platform": "wechat",
    "share_time": "2024-01-15 10:00:00",
    "created_at": "2024-01-15 10:00:00"
  }
}
```

---

## 管理员端API测试

### 1. 管理员管理

#### 1.1 获取管理员信息

**接口信息**
- 方法：`GET`
- 路径：`{{baseUrl}}/api/admin/profile`
- 认证：需要管理员JWT

**请求示例**
```http
GET {{baseUrl}}/api/admin/profile
Authorization: Bearer {{adminToken}}
```

**预期响应**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "admin",
    "role_id": 1,
    "real_name": "管理员",
    "phone": "13800138000",
    "status": "active",
    "last_login_time": "2024-01-01 10:00:00",
    "created_at": "2024-01-01 09:00:00",
    "updated_at": "2024-01-01 10:00:00"
  }
}
```

---

### 2. 角色权限管理

#### 2.1 获取角色列表

**接口信息**
- 方法：`GET`
- 路径：`{{baseUrl}}/api/admin/roles`
- 认证：需要管理员JWT

**请求示例**
```http
GET {{baseUrl}}/api/admin/roles?page=1&limit=10
Authorization: Bearer {{adminToken}}
```

**预期响应**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "role_name": "超级管理员",
      "permissions": {
        "user": ["read", "write", "delete"],
        "tree": ["read", "write", "delete"],
        "adoption": ["read", "write", "delete"]
      },
      "created_at": "2024-01-01 09:00:00"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "pages": 1
  }
}
```

---

### 3. 操作日志管理

#### 3.1 获取操作日志列表

**接口信息**
- 方法：`GET`
- 路径：`{{baseUrl}}/api/admin/operations`
- 认证：需要管理员JWT

**请求示例**
```http
GET {{baseUrl}}/api/admin/operations?page=1&limit=10&admin_id=1&operation_module=tree
Authorization: Bearer {{adminToken}}
```

**预期响应**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "admin_id": 1,
      "role_id": 1,
      "operation_module": "tree",
      "operation_desc": "创建了新的树木记录",
      "operation_ip": "192.168.1.100",
      "operation_time": "2024-01-01 10:00:00",
      "created_at": "2024-01-01 10:00:00"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 20,
    "pages": 2
  }
}
```

---

### 4. 树木管理

#### 4.1 获取树木管理列表

**接口信息**
- 方法：`GET`
- 路径：`{{baseUrl}}/api/admin/trees`
- 认证：需要管理员JWT

**请求示例**
```http
GET {{baseUrl}}/api/admin/trees?page=1&limit=10&status=normal&batch_no=BATCH202401
Authorization: Bearer {{adminToken}}
```

**预期响应**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "tree_id": 1,
      "manage_status": "normal",
      "batch_no": "BATCH202401",
      "import_source": "批量导入",
      "operator_id": 1,
      "created_at": "2024-01-01 09:00:00",
      "updated_at": "2024-01-01 09:00:00"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "pages": 2
  }
}
```

---

### 5. 收获管理

#### 5.1 获取收获记录列表

**接口信息**
- 方法：`GET`
- 路径：`{{baseUrl}}/api/admin/harvests`
- 认证：需要管理员JWT

**请求示例**
```http
GET {{baseUrl}}/api/admin/harvests?page=1&limit=10&tree_id=1&harvest_batch=BATCH202401
Authorization: Bearer {{adminToken}}
```

**预期响应**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "tree_id": 1,
      "harvest_batch": "BATCH202401",
      "harvest_date": "2024-01-10",
      "yield": 50,
      "quality_grade": "一级",
      "storage_location": "1号冷库",
      "operator_id": 1,
      "created_at": "2024-01-10 09:00:00",
      "updated_at": "2024-01-10 09:00:00"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 8,
    "pages": 1
  }
}
```

---

## 测试数据说明

### 测试用户数据

| ID | 手机号 | 密码 | 昵称 | 状态 |
|----|--------|------|------|------|
| 1 | 13800138000 | 123456 | 测试用户 | active |
| 2 | 13900139000 | 123456 | VIP用户 | active |

### 测试管理员数据

| ID | 用户名 | 密码 | 角色 | 状态 |
|----|--------|------|------|------|
| 1 | admin | admin123 | 超级管理员 | active |
| 2 | operator | operator123 | 操作员 | active |

### 测试树木数据

| ID | 树木编号 | 品种 | 状态 | 价格 |
|----|---------|------|------|------|
| 1 | TREE001 | 纽荷尔脐橙 | available | 1000 |
| 2 | TREE002 | 纽荷尔脐橙 | adopted | 1000 |
| 3 | TREE003 | 纽荷尔脐橙 | maintaining | 1000 |

### 测试订单数据

| ID | 订单编号 | 用户ID | 树木ID | 状态 | 金额 |
|----|---------|--------|--------|------|------|
| 1 | AGR001 | 1 | 1 | unpaid | 2000 |
| 2 | AGR002 | 1 | 2 | paid | 3000 |

---

## 错误响应示例

### 401 未授权

```json
{
  "success": false,
  "message": "未提供认证令牌"
}
```

### 403 禁止访问

```json
{
  "success": false,
  "message": "需要管理员权限"
}
```

### 404 资源不存在

```json
{
  "success": false,
  "message": "用户不存在"
}
```

### 500 服务器错误

```json
{
  "success": false,
  "message": "服务器内部错误",
  "error": "详细错误信息（开发环境）"
}
```

### 数据库连接错误

```json
{
  "success": false,
  "message": "数据库连接失败",
  "error": "数据库连接错误详情"
}
```

---

## 测试建议与最佳实践

### 1. 测试流程建议

1. **环境准备**：确保数据库已创建并配置正确
2. **登录测试**：先测试用户和管理员登录，获取JWT令牌
3. **功能测试**：按模块依次测试各功能接口
4. **异常测试**：测试各种异常情况和边界条件
5. **性能测试**：测试接口响应时间和并发处理能力

### 2. 测试注意事项

1. **数据库连接**：确保测试过程中数据库连接正常，特别是分离的用户和管理员数据库
2. **JWT令牌**：确保登录后正确获取和使用JWT令牌
3. **参数验证**：测试各种参数组合，包括必填参数、边界值等
4. **权限测试**：测试不同角色的权限访问控制
5. **数据一致性**：测试操作后数据的一致性和完整性

### 3. 最佳实践

1. **使用Postman集合**：将测试用例组织成集合，便于重复执行
2. **环境变量**：使用环境变量管理测试配置，提高可维护性
3. **测试数据隔离**：使用专门的测试数据库，避免影响生产数据
4. **自动化测试**：考虑使用Postman的自动化测试功能，定期执行测试
5. **文档更新**：及时更新测试文档，反映API的变化

### 4. 故障排查

如果遇到测试失败，建议按以下步骤排查：

1. **检查数据库连接**：确保数据库服务正常运行，连接配置正确
2. **检查API服务**：确保后端服务正常运行，无错误日志
3. **检查请求参数**：确保请求参数格式正确，符合API要求
4. **检查权限设置**：确保使用了正确的JWT令牌和权限
5. **检查数据库表结构**：确保数据库表结构与API要求一致

---

## 总结

本测试文档提供了脐橙树认养系统的完整Postman测试用例，包括：

- 详细的登录测试用例
- 完整的用户端和管理员端API测试
- 分离数据库架构的测试说明
- 全面的测试数据和错误响应示例
- 实用的测试建议和最佳实践

通过按照本文档执行测试，可以确保系统的各个功能正常工作，特别是在新的分离数据库架构下，验证用户和管理员数据的正确隔离和访问。