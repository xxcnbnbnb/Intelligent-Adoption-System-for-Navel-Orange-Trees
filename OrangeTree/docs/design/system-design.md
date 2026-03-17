# 橙子树认养系统 - 系统设计文档

## 1. 系统概述

### 1.1 项目简介

橙子树认养系统是一个基于Web的在线果树认养管理平台，旨在为用户提供便捷的果树认养服务，同时为管理员提供高效的后台管理工具。系统采用前后端分离架构，支持用户端和管理员端两种角色，实现了从用户注册、果树浏览、认养下单到订单管理、物流配送等完整的业务流程。

### 1.2 系统目标

- 为用户提供便捷的果树认养服务，实现线上认养、管理、配送一体化
- 为管理员提供高效的后台管理工具，支持用户管理、订单管理、树木管理等
- 实现数据可视化展示，帮助管理员了解系统运营状况
- 支持多角色权限管理，确保系统安全性和数据隔离
- 提供良好的用户体验，包括响应式设计、交互友好等

### 1.3 核心功能

#### 用户端功能
- 用户注册与登录
- 树木浏览与搜索
- 树木详情查看
- 果树认养下单
- 认养订单管理
- 生长记录查看
- 互动记录查看
- 物流信息管理
- 个人中心

#### 管理员端功能
- 管理员登录
- 数据仪表盘
- 用户管理
- 角色权限管理
- 操作日志查看
- 树木管理
- 收获管理
- 认养订单管理

## 2. 系统架构

### 2.1 整体架构

系统采用前后端分离的架构设计，前端使用Vue 3框架，后端使用Node.js + Express.js框架，数据库采用MySQL。系统分为用户端和管理员端两个独立的应用，共享相同的后端API服务。

```
┌─────────────────────────────────────────────────────────┐
│                   前端应用层                      │
│  ┌──────────────┐  ┌──────────────┐     │
│  │ 用户端应用  │  │ 管理员端应用  │     │
│  └──────────────┘  └──────────────┘     │
│           │                │                │
│           └────────────────┴────────────────┘     │
│                   API服务层                      │
│           │                │                │
│           └────────────────┴────────────────┘     │
│                  业务逻辑层                      │
│           │                │                │
│           └────────────────┴────────────────┘     │
│                  数据访问层                      │
│           │                │                │
│           └────────────────┴────────────────┘     │
│                  数据库层                        │
│           ┌──────────────┐  ┌──────────────┐     │
│  │  用户数据库   │  │ 管理员数据库   │     │
│  └──────────────┘  └──────────────┘     │
│           │                │                │
│           └────────────────┴────────────────┘     │
└─────────────────────────────────────────────────────────┘
```

### 2.2 技术栈

#### 前端技术栈
- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **UI组件库**: Element Plus
- **状态管理**: Pinia
- **路由管理**: Vue Router
- **HTTP客户端**: Axios
- **样式**: SCSS
- **开发工具**: ESLint, Prettier

#### 后端技术栈
- **运行环境**: Node.js
- **Web框架**: Express.js
- **数据库**: MySQL
- **ORM**: Objection.js
- **身份认证**: JWT (JSON Web Token)
- **日志管理**: Morgan
- **参数验证**: Joi
- **CORS**: cors
- **环境变量**: dotenv

### 2.3 部署架构

- **开发环境**: 本地开发
- **生产环境**: 待定（建议使用Nginx反向代理）
- **端口配置**:
  - 前端开发服务器: 5173
  - 后端API服务器: 3000

## 3. 功能模块设计

### 3.1 用户端模块

#### 3.1.1 用户认证模块

**功能描述**: 提供用户注册、登录、退出登录等基础认证功能

**主要功能**:
- 用户注册：支持手机号注册，设置昵称、密码
- 用户登录：支持手机号登录，返回JWT令牌
- 退出登录：清除本地存储的令牌和用户信息
- 密码重置：支持通过手机号重置密码

**数据模型**:
- 用户基本信息：手机号、昵称、头像、状态
- 认证信息：密码（加密存储）

**API接口**:
- POST `/api/user/register` - 用户注册
- POST `/api/user/login` - 用户登录
- POST `/api/user/logout` - 退出登录
- POST `/api/user/reset-password` - 重置密码

#### 3.1.2 树木浏览模块

**功能描述**: 为用户提供果树浏览和搜索功能，支持多种筛选条件

**主要功能**:
- 树木列表展示：分页展示所有可认养的果树
- 树木搜索：支持按品种、树龄、位置、价格范围筛选
- 树木详情：查看果树的详细信息，包括全景图、生长记录等
- 树木收藏：支持收藏感兴趣的果树

**数据模型**:
- 树木基本信息：树木编号、品种、树龄、位置、认养费用、状态
- 树木图片：封面图片、全景URL
- 树木状态：可认养、已认养、维护中

**API接口**:
- GET `/api/user/trees` - 获取树木列表（支持分页和筛选）
- GET `/api/user/trees/:id` - 获取树木详情
- GET `/api/user/trees/:id/growth` - 获取树木生长记录
- POST `/api/user/trees/:id/favorite` - 收藏树木

#### 3.1.3 认养订单模块

**功能描述**: 用户可以创建认养订单，管理自己的认养订单

**主要功能**:
- 创建认养订单：选择果树、认养年限、物流信息等
- 订单列表：查看所有认养订单，支持状态筛选
- 订单详情：查看订单详细信息，包括物流信息
- 订单支付：支持在线支付订单
- 订单取消：取消未支付的订单

**数据模型**:
- 订单基本信息：订单编号、认养年限、总金额、支付状态
- 认养信息：认养开始日期、结束日期、协议编号
- 物流信息：收货人、联系电话、收货地址

**API接口**:
- POST `/api/user/adoptions` - 创建认养订单
- GET `/api/user/adoptions` - 获取订单列表（支持分页和筛选）
- GET `/api/user/adoptions/:id` - 获取订单详情
- PUT `/api/user/adoptions/:id/status` - 更新订单状态
- DELETE `/api/user/adoptions/:id` - 取消订单

#### 3.1.4 生长记录模块

**功能描述**: 展示果树的生长记录，包括图片、描述等信息

**主要功能**:
- 生长记录列表：按时间倒序展示
- 记录详情：查看详细的生长记录信息
- 记录筛选：按时间范围筛选

**数据模型**:
- 记录基本信息：记录时间、描述
- 记录图片：支持多张图片上传
- 记录类型：生长阶段、施肥记录、病虫害记录等

**API接口**:
- GET `/api/user/trees/:id/growth` - 获取生长记录列表
- GET `/api/user/growth/:id` - 获取生长记录详情

#### 3.1.5 互动记录模块

**功能描述**: 记录用户与果树的互动，包括浇水、施肥、留言等

**主要功能**:
- 互动记录列表：按时间倒序展示
- 互动类型：浇水、施肥、留言、拍照等
- 互动统计：统计各类互动次数

**数据模型**:
- 互动基本信息：互动时间、互动类型、描述
- 互动图片：支持图片上传

**API接口**:
- GET `/api/user/trees/:id/interactions` - 获取互动记录列表
- POST `/api/user/trees/:id/interactions` - 创建互动记录

#### 3.1.6 物流管理模块

**功能描述**: 管理认养果实的物流配送信息

**主要功能**:
- 物流信息查看：查看订单的物流状态
- 物流地址管理：添加、编辑收货地址
- 物流跟踪：查看物流配送进度

**数据模型**:
- 物流基本信息：物流单号、物流公司、配送状态
- 收货信息：收货人、联系电话、收货地址

**API接口**:
- GET `/api/user/adoptions/:id/logistics` - 获取物流信息
- POST `/api/user/logistics` - 添加物流信息
- PUT `/api/user/logistics/:id` - 更新物流信息

#### 3.1.7 个人中心模块

**功能描述**: 用户可以查看和管理个人信息

**主要功能**:
- 个人信息查看：查看用户基本信息
- 个人信息编辑：修改昵称、头像等
- 密码修改：修改登录密码
- 认养统计：统计认养的果树数量、总金额等

**数据模型**:
- 用户基本信息：手机号、昵称、头像、注册时间、状态
- 用户统计信息：认养数量、总金额、活跃度等

**API接口**:
- GET `/api/user/profile` - 获取个人信息
- PUT `/api/user/profile` - 更新个人信息
- PUT `/api/user/password` - 修改密码
- GET `/api/user/statistics` - 获取用户统计数据

### 3.2 管理员端模块

#### 3.2.1 管理员认证模块

**功能描述**: 提供管理员登录认证和权限管理

**主要功能**:
- 管理员登录：支持用户名和密码登录
- 权限验证：基于角色的权限控制
- 操作日志：记录管理员的操作历史

**数据模型**:
- 管理员基本信息：用户名、密码、真实姓名、手机号
- 角色信息：角色名称、权限配置
- 操作日志：操作时间、操作类型、操作模块、操作详情

**API接口**:
- POST `/api/admin/login` - 管理员登录
- GET `/api/admin/profile` - 获取管理员个人信息
- PUT `/api/admin/profile` - 更新管理员个人信息
- GET `/api/admin/operations` - 获取操作日志列表

#### 3.2.2 数据仪表盘模块

**功能描述**: 为管理员提供系统运营数据的可视化展示

**主要功能**:
- 数据统计：用户总数、订单总数、树木总数、收入统计等
- 图表展示：订单趋势、用户增长、收入分析等
- 实时数据：今日新增用户、今日新增订单等

**数据模型**:
- 统计数据：各类业务指标的聚合数据
- 趋势数据：按时间序列的业务指标

**API接口**:
- GET `/api/admin/dashboard/statistics` - 获取统计数据
- GET `/api/admin/dashboard/trends` - 获取趋势数据

#### 3.2.3 用户管理模块

**功能描述**: 管理员可以查看和管理所有认养用户

**主要功能**:
- 用户列表：分页展示所有注册用户
- 用户详情：查看用户详细信息，包括其订单和果树
- 用户编辑：修改用户状态、昵称、大客户备注
- 用户删除：软删除用户账号
- 用户筛选：按手机号、昵称、状态筛选用户

**数据模型**:
- 用户基本信息：手机号、昵称、头像、状态、注册时间
- 大客户备注：管理员备注的重要客户信息
- 关联数据：用户的订单列表、用户的果树列表

**API接口**:
- GET `/api/admin/users` - 获取用户列表（支持分页和筛选）
- GET `/api/admin/users/:id` - 获取用户详情
- PUT `/api/admin/users/:id` - 更新用户信息
- DELETE `/api/admin/users/:id` - 删除用户

#### 3.2.4 角色权限管理模块

**功能描述**: 管理员可以创建和管理系统角色及权限

**主要功能**:
- 角色列表：查看所有系统角色
- 角色创建：创建新角色，配置权限
- 角色编辑：修改角色名称和权限
- 角色删除：删除角色
- 权限配置：配置不同角色的访问权限

**数据模型**:
- 角色基本信息：角色名称、创建时间、更新时间
- 权限配置：用户管理权限、树木管理权限、订单管理权限等

**API接口**:
- GET `/api/admin/roles` - 获取角色列表
- POST `/api/admin/roles` - 创建角色
- PUT `/api/admin/roles/:id` - 更新角色
- DELETE `/api/admin/roles/:id` - 删除角色

#### 3.2.5 树木管理模块

**功能描述**: 管理员可以管理系统中的果树信息

**主要功能**:
- 树木列表：查看所有果树信息
- 树木添加：添加新的果树
- 树木编辑：修改果树信息
- 树木删除：删除果树
- 树木筛选：按品种、状态等筛选

**数据模型**:
- 树木基本信息：树木编号、品种、树龄、位置、认养费用、状态
- 树木图片：封面图片、全景URL
- 树木状态：可认养、已认养、维护中

**API接口**:
- GET `/api/admin/trees` - 获取树木列表（支持分页和筛选）
- POST `/api/admin/trees` - 添加树木
- PUT `/api/admin/trees/:id` - 更新树木信息
- DELETE `/api/admin/trees/:id` - 删除树木

#### 3.2.6 收获管理模块

**功能描述**: 管理员可以管理果实的收获信息

**主要功能**:
- 收获记录列表：查看所有收获记录
- 收获记录添加：添加新的收获记录
- 收获记录编辑：修改收获信息
- 收获记录删除：删除收获记录
- 收获统计：统计收获产量、质量等级等

**数据模型**:
- 收获基本信息：收获批次、收获日期、产量、质量等级、存储位置
- 关联信息：关联的果树信息、操作员信息

**API接口**:
- GET `/api/admin/harvests` - 获取收获记录列表
- POST `/api/admin/harvests` - 添加收获记录
- PUT `/api/admin/harvests/:id` - 更新收获记录
- DELETE `/api/admin/harvests/:id` - 删除收获记录

#### 3.2.7 认养订单管理模块

**功能描述**: 管理员可以查看和管理所有认养订单

**主要功能**:
- 订单列表：查看所有认养订单
- 订单详情：查看订单详细信息
- 订单状态更新：更新订单支付状态
- 订单删除：删除订单
- 订单筛选：按状态、用户ID、树木ID筛选订单

**数据模型**:
- 订单基本信息：订单编号、认养年限、总金额、支付状态
- 用户信息：用户昵称、用户电话
- 树木信息：树木编号、品种、树龄
- 物流信息：物流单号、配送状态

**API接口**:
- GET `/api/admin/adoptions` - 获取订单列表（支持分页和筛选）
- GET `/api/admin/adoptions/:id` - 获取订单详情
- PUT `/api/admin/adoptions/:id` - 更新订单状态
- DELETE `/api/admin/adoptions/:id` - 删除订单

#### 3.2.8 操作日志模块

**功能描述**: 记录管理员的操作历史，便于审计和追踪

**主要功能**:
- 操作日志列表：分页展示所有操作日志
- 日志详情：查看操作详细信息
- 日志筛选：按操作类型、操作模块、管理员筛选
- 日志导出：支持导出操作日志

**数据模型**:
- 日志基本信息：操作时间、操作类型、操作模块、操作详情
- 管理员信息：操作的管理员ID、用户名
- 关联信息：关联的资源ID、操作结果

**API接口**:
- GET `/api/admin/operations` - 获取操作日志列表（支持分页和筛选）
- GET `/api/admin/operations/:id` - 获取操作日志详情

## 4. 数据库设计

### 4.1 数据库架构

系统采用双数据库架构，用户数据和管理员数据分别存储在不同的数据库中，实现数据隔离和安全性。

```
┌─────────────────────────────────────────┐
│         MySQL数据库服务器           │
│  ┌──────────────┐  ┌──────────────┐ │
│  │ 用户数据库    │  │ 管理员数据库  │ │
│  │ orange_user  │  │ orange_admin │ │
│  └──────────────┘  └──────────────┘ │
│           │                │                │
│           └────────────────┴────────────────┘     │
└─────────────────────────────────────────┘
```

### 4.2 用户数据库表设计

#### user_users表
用户基本信息表，存储注册用户的账号信息。

| 字段名 | 类型 | 说明 | 约束 |
|---------|------|------|--------|
| id | bigint | 主键，自增 | PRIMARY KEY, AUTO_INCREMENT |
| phone | varchar(20) | 手机号，唯一标识 | UNIQUE KEY, NOT NULL |
| password | varchar(255) | 密码，加密存储 | NOT NULL |
| nickname | varchar(50) | 用户昵称 | NOT NULL |
| avatar | varchar(500) | 头像URL | NULL |
| status | enum('active','disabled') | 用户状态 | 'active' |
| is_deleted | tinyint(1) | 软删除标记 | DEFAULT '0', KEY |
| created_at | timestamp | 创建时间 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | timestamp | 更新时间 | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

#### user_trees表
果树信息表，存储所有可认养的果树信息。

| 字段名 | 类型 | 说明 | 约束 |
|---------|------|------|--------|
| id | bigint | 主键，自增 | PRIMARY KEY, AUTO_INCREMENT |
| tree_no | varchar(50) | 树木编号，唯一标识 | UNIQUE KEY, NOT NULL |
| variety | varchar(50) | 树木品种 | NOT NULL, KEY |
| age | int | 树龄 | NOT NULL |
| location | varchar(200) | 种植位置 | NOT NULL |
| status | enum('available','adopted','maintaining') | 树木状态 | 'available', KEY |
| price | decimal(10,2) | 认养费用（元/年） | NOT NULL, KEY |
| panorama_url | varchar(500) | 全景图片URL | NULL |
| cover_img | varchar(500) | 封面图片URL | NULL |
| is_deleted | tinyint(1) | 软删除标记 | DEFAULT '0', KEY |
| created_at | timestamp | 创建时间 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | timestamp | 更新时间 | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

#### user_adoptions表
认养订单表，存储用户的认养订单信息。

| 字段名 | 类型 | 说明 | 约束 |
|---------|------|------|--------|
| id | bigint | 主键，自增 | PRIMARY KEY, AUTO_INCREMENT |
| user_id | bigint | 用户ID，外键 | NOT NULL, KEY |
| tree_id | bigint | 树木ID，外键 | NOT NULL, KEY |
| agreement_no | varchar(50) | 协议编号 | NOT NULL, UNIQUE |
| adopt_years | int | 认养年限 | NOT NULL |
| start_date | date | 认养开始日期 | NOT NULL |
| end_date | date | 认养结束日期 | NOT NULL |
| total_amount | decimal(10,2) | 总金额 | NOT NULL |
| pay_status | enum('unpaid','paid','canceled') | 支付状态 | 'unpaid', KEY |
| is_deleted | tinyint(1) | 软删除标记 | DEFAULT '0', KEY |
| created_at | timestamp | 创建时间 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | timestamp | 更新时间 | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

#### user_growth_records表
生长记录表，存储果树的生长记录。

| 字段名 | 类型 | 说明 | 约束 |
|---------|------|------|--------|
| id | bigint | 主键，自增 | PRIMARY KEY, AUTO_INCREMENT |
| tree_id | bigint | 树木ID，外键 | NOT NULL, KEY |
| record_date | date | 记录日期 | NOT NULL |
| description | text | 记录描述 | NULL |
| images | json | 记录图片（JSON格式） | NULL |
| is_deleted | tinyint(1) | 软删除标记 | DEFAULT '0', KEY |
| created_at | timestamp | 创建时间 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | timestamp | 更新时间 | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

#### user_interactions表
互动记录表，存储用户与果树的互动信息。

| 字段名 | 类型 | 说明 | 约束 |
|---------|------|------|--------|
| id | bigint | 主键，自增 | PRIMARY KEY, AUTO_INCREMENT |
| user_id | bigint | 用户ID，外键 | NOT NULL, KEY |
| tree_id | bigint | 树木ID，外键 | NOT NULL, KEY |
| interaction_type | varchar(50) | 互动类型 | NOT NULL |
| description | text | 互动描述 | NULL |
| is_deleted | tinyint(1) | 软删除标记 | DEFAULT '0', KEY |
| created_at | timestamp | 创建时间 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | timestamp | 更新时间 | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

#### user_logistics表
物流信息表，存储订单的物流配送信息。

| 字段名 | 类型 | 说明 | 约束 |
|---------|------|------|--------|
| id | bigint | 主键，自增 | PRIMARY KEY, AUTO_INCREMENT |
| adoption_id | bigint | 订单ID，外键 | NOT NULL, KEY |
| tracking_number | varchar(50) | 物流单号 | NULL |
| carrier | varchar(50) | 物流公司 | NULL |
| address | varchar(200) | 收货地址 | NULL |
| recipient | varchar(50) | 收货人 | NULL |
| phone | varchar(20) | 联系电话 | NULL |
| status | enum('pending','shipped','delivered') | 配送状态 | 'pending' |
| is_deleted | tinyint(1) | 软删除标记 | DEFAULT '0', KEY |
| created_at | timestamp | 创建时间 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | timestamp | 更新时间 | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

#### user_pay_records表
支付记录表，存储用户的支付信息。

| 字段名 | 类型 | 说明 | 约束 |
|---------|------|------|--------|
| id | bigint | 主键，自增 | PRIMARY KEY, AUTO_INCREMENT |
| adoption_id | bigint | 订单ID，外键 | NOT NULL, KEY |
| amount | decimal(10,2) | 支付金额 | NOT NULL |
| payment_method | varchar(50) | 支付方式 | NULL |
| payment_time | timestamp | 支付时间 | DEFAULT CURRENT_TIMESTAMP |
| status | enum('success','failed','pending') | 支付状态 | 'pending' |
| is_deleted | tinyint(1) | 软删除标记 | DEFAULT '0', KEY |
| created_at | timestamp | 创建时间 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | timestamp | 更新时间 | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

### 4.3 管理员数据库表设计

#### admin_users表
管理员账号表，存储管理员登录信息。

| 字段名 | 类型 | 说明 | 约束 |
|---------|------|------|--------|
| id | bigint | 主键，自增 | PRIMARY KEY, AUTO_INCREMENT |
| username | varchar(50) | 用户名，唯一标识 | UNIQUE KEY, NOT NULL |
| password | varchar(255) | 密码，加密存储 | NOT NULL |
| real_name | varchar(50) | 真实姓名 | NULL |
| phone | varchar(20) | 手机号 | NULL |
| status | enum('active','disabled') | 账号状态 | 'active' |
| is_deleted | tinyint(1) | 软删除标记 | DEFAULT '0', KEY |
| created_at | timestamp | 创建时间 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | timestamp | 更新时间 | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

#### admin_roles表
角色权限表，存储系统角色及权限配置。

| 字段名 | 类型 | 说明 | 约束 |
|---------|------|------|--------|
| id | bigint | 主键，自增 | PRIMARY KEY, AUTO_INCREMENT |
| role_name | varchar(50) | 角色名称 | NOT NULL |
| permissions | json | 权限配置（JSON格式） | NOT NULL |
| is_deleted | tinyint(1) | 软删除标记 | DEFAULT '0', KEY |
| created_at | timestamp | 创建时间 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | timestamp | 更新时间 | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

权限配置示例：
```json
{
  "user": ["read", "write", "delete"],
  "tree": ["read", "write", "delete"],
  "adoption": ["read", "write", "delete"],
  "harvest": ["read", "write", "delete"]
}
```

#### admin_tree_manage表
管理员树木管理表，存储管理员对果树的管理记录。

| 字段名 | 类型 | 说明 | 约束 |
|---------|------|------|--------|
| id | bigint | 主键，自增 | PRIMARY KEY, AUTO_INCREMENT |
| tree_id | bigint | 树木ID，外键 | NOT NULL, KEY |
| manage_status | enum('normal','abnormal','pruning') | 管理状态 | 'normal', KEY |
| batch_no | varchar(50) | 批次号 | NULL |
| import_source | varchar(50) | 导入来源 | NULL |
| operator_id | bigint | 操作员ID，外键 | NULL |
| notes | text | 管理备注 | NULL |
| is_deleted | tinyint(1) | 软删除标记 | DEFAULT '0', KEY |
| created_at | timestamp | 创建时间 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | timestamp | 更新时间 | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

#### admin_harvest_manage表
管理员收获管理表，存储管理员对收获的管理记录。

| 字段名 | 类型 | 说明 | 约束 |
|---------|------|------|--------|
| id | bigint | 主键，自增 | PRIMARY KEY, AUTO_INCREMENT |
| tree_id | bigint | 树木ID，外键 | NOT NULL, KEY |
| harvest_batch | varchar(50) | 收获批次 | NOT NULL |
| harvest_date | date | 收获日期 | NOT NULL |
| yield | decimal(10,2) | 产量（公斤） | NOT NULL |
| quality_grade | varchar(50) | 质量等级 | NOT NULL |
| storage_location | varchar(100) | 存储位置 | NULL |
| operator_id | bigint | 操作员ID，外键 | NULL |
| notes | text | 管理备注 | NULL |
| is_deleted | tinyint(1) | 软删除标记 | DEFAULT '0', KEY |
| created_at | timestamp | 创建时间 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | timestamp | 更新时间 | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

#### admin_operation_logs表
操作日志表，存储管理员的操作历史。

| 字段名 | 类型 | 说明 | 约束 |
|---------|------|------|--------|
| id | bigint | 主键，自增 | PRIMARY KEY, AUTO_INCREMENT |
| admin_id | bigint | 管理员ID，外键 | NOT NULL, KEY |
| operation_module | varchar(50) | 操作模块 | NOT NULL |
| operation_type | varchar(50) | 操作类型 | NOT NULL |
| operation_detail | text | 操作详情 | NULL |
| resource_id | bigint | 关联资源ID | NULL |
| resource_type | varchar(50) | 资源类型 | NULL |
| ip_address | varchar(50) | IP地址 | NULL |
| user_agent | varchar(500) | 用户代理 | NULL |
| is_deleted | tinyint(1) | 软删除标记 | DEFAULT '0', KEY |
| created_at | timestamp | 创建时间 | DEFAULT CURRENT_TIMESTAMP |

## 5. API接口设计

### 5.1 API设计原则

- **RESTful设计**: 遵循RESTful API设计规范
- **统一响应格式**: 所有API响应采用统一格式
- **错误处理**: 统一的错误处理中间件
- **身份认证**: 基于JWT的身份认证机制
- **权限控制**: 基于角色的权限控制
- **参数验证**: 使用Joi进行请求参数验证
- **CORS支持**: 支持跨域请求

### 5.2 统一响应格式

```json
{
  "success": true,
  "message": "操作成功",
  "data": {},
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### 5.3 错误处理

```json
{
  "success": false,
  "message": "错误描述",
  "error": "错误代码"
}
```

### 5.4 API接口列表

#### 用户端API

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|--------|
| POST | /api/user/register | 用户注册 | 否 |
| POST | /api/user/login | 用户登录 | 否 |
| POST | /api/user/logout | 退出登录 | 是 |
| GET | /api/user/profile | 获取个人信息 | 是 |
| PUT | /api/user/profile | 更新个人信息 | 是 |
| GET | /api/user/trees | 获取树木列表 | 是 |
| GET | /api/user/trees/:id | 获取树木详情 | 是 |
| GET | /api/user/trees/:id/growth | 获取生长记录 | 是 |
| POST | /api/user/adoptions | 创建认养订单 | 是 |
| GET | /api/user/adoptions | 获取订单列表 | 是 |
| GET | /api/user/adoptions/:id | 获取订单详情 | 是 |
| PUT | /api/user/adoptions/:id/status | 更新订单状态 | 是 |
| DELETE | /api/user/adoptions/:id | 取消订单 | 是 |
| GET | /api/user/trees/:id/interactions | 获取互动记录 | 是 |
| POST | /api/user/trees/:id/interactions | 创建互动记录 | 是 |
| GET | /api/user/adoptions/:id/logistics | 获取物流信息 | 是 |
| POST | /api/user/logistics | 添加物流信息 | 是 |
| PUT | /api/user/logistics/:id | 更新物流信息 | 是 |

#### 管理员端API

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|--------|
| POST | /api/admin/login | 管理员登录 | 否 |
| GET | /api/admin/profile | 获取个人信息 | 是 |
| PUT | /api/admin/profile | 更新个人信息 | 是 |
| GET | /api/admin/users | 获取用户列表 | 是 |
| GET | /api/admin/users/:id | 获取用户详情 | 是 |
| PUT | /api/admin/users/:id | 更新用户信息 | 是 |
| DELETE | /api/admin/users/:id | 删除用户 | 是 |
| GET | /api/admin/roles | 获取角色列表 | 是 |
| POST | /api/admin/roles | 创建角色 | 是 |
| PUT | /api/admin/roles/:id | 更新角色 | 是 |
| DELETE | /api/admin/roles/:id | 删除角色 | 是 |
| GET | /api/admin/operations | 获取操作日志 | 是 |
| GET | /api/admin/operations/:id | 获取操作日志详情 | 是 |
| GET | /api/admin/trees | 获取树木列表 | 是 |
| POST | /api/admin/trees | 添加树木 | 是 |
| PUT | /api/admin/trees/:id | 更新树木信息 | 是 |
| DELETE | /api/admin/trees/:id | 删除树木 | 是 |
| GET | /api/admin/harvests | 获取收获记录列表 | 是 |
| POST | /api/admin/harvests | 添加收获记录 | 是 |
| PUT | /api/admin/harvests/:id | 更新收获记录 | 是 |
| DELETE | /api/admin/harvests/:id | 删除收获记录 | 是 |
| GET | /api/admin/adoptions | 获取订单列表 | 是 |
| GET | /api/admin/adoptions/:id | 获取订单详情 | 是 |
| PUT | /api/admin/adoptions/:id | 更新订单状态 | 是 |
| DELETE | /api/admin/adoptions/:id | 删除订单 | 是 |

## 6. 前端架构设计

### 6.1 项目结构

```
OrangeTreeVue3/
├── public/                 # 静态资源
├── src/
│   ├── assets/          # 样式文件
│   ├── components/       # 公共组件
│   ├── router/           # 路由配置
│   ├── services/         # API服务
│   ├── store/            # 状态管理
│   ├── utils/            # 工具函数
│   ├── views/
│   │   ├── user/         # 用户端页面
│   │   │   ├── Login.vue
│   │   │   ├── Register.vue
│   │   │   ├── Home.vue
│   │   │   ├── TreeList.vue
│   │   │   ├── TreeDetail.vue
│   │   │   ├── AdoptionList.vue
│   │   │   ├── AdoptionDetail.vue
│   │   │   ├── GrowthRecords.vue
│   │   │   ├── Interaction.vue
│   │   │   ├── Logistics.vue
│   │   │   └── Profile.vue
│   │   └── admin/        # 管理员端页面
│   │       ├── Login.vue
│   │       ├── Layout.vue
│   │       ├── Dashboard.vue
│   │       ├── UserManagement.vue
│   │       ├── RoleManagement.vue
│   │       ├── OperationLogs.vue
│   │       ├── TreeManagement.vue
│   │       ├── HarvestManagement.vue
│   │       └── AdoptionManagement.vue
│   ├── App.vue            # 根组件
│   ├── main.js            # 应用入口
│   └── vite.config.js     # Vite配置
├── index.html              # HTML模板
├── package.json            # 项目依赖
└── vite.config.js          # Vite配置
```

### 6.2 路由设计

#### 用户端路由

```javascript
const userRoutes = [
  {
    path: '/user',
    component: () => import('../views/user/Layout.vue'),
    children: [
      {
        path: 'login',
        name: 'UserLogin',
        component: () => import('../views/user/Login.vue'),
        meta: { title: '用户登录' }
      },
      {
        path: 'register',
        name: 'UserRegister',
        component: () => import('../views/user/Register.vue'),
        meta: { title: '用户注册' }
      },
      {
        path: 'home',
        name: 'UserHome',
        component: () => import('../views/user/Home.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'trees',
        name: 'TreeList',
        component: () => import('../views/user/TreeList.vue'),
        meta: { title: '树木浏览' }
      },
      {
        path: 'trees/:id',
        name: 'TreeDetail',
        component: () => import('../views/user/TreeDetail.vue'),
        meta: { title: '树木详情' }
      },
      {
        path: 'adoptions',
        name: 'AdoptionList',
        component: () => import('../views/user/AdoptionList.vue'),
        meta: { title: '认养订单' }
      },
      {
        path: 'adoptions/:id',
        name: 'AdoptionDetail',
        component: () => import('../views/user/AdoptionDetail.vue'),
        meta: { title: '订单详情' }
      },
      {
        path: 'growth',
        name: 'GrowthRecords',
        component: () => import('../views/user/GrowthRecords.vue'),
        meta: { title: '生长记录' }
      },
      {
        path: 'interaction',
        name: 'Interaction',
        component: () => import('../views/user/Interaction.vue'),
        meta: { title: '互动记录' }
      },
      {
        path: 'logistics',
        name: 'Logistics',
        component: () => import('../views/user/Logistics.vue'),
        meta: { title: '物流信息' }
      },
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('../views/user/Profile.vue'),
        meta: { title: '个人中心' }
      }
    ]
  }
];
```

#### 管理员端路由

```javascript
const adminRoutes = [
  {
    path: '/admin',
    component: () => import('../views/admin/Layout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('../views/admin/Dashboard.vue'),
        meta: { title: '数据仪表盘' }
      },
      {
        path: 'profile',
        name: 'AdminProfile',
        component: () => import('../views/admin/Profile.vue'),
        meta: { title: '个人中心' }
      },
      {
        path: 'users',
        name: 'UserManagement',
        component: () => import('../views/admin/UserManagement.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: 'roles',
        name: 'RoleManagement',
        component: () => import('../views/admin/RoleManagement.vue'),
        meta: { title: '角色管理' }
      },
      {
        path: 'operations',
        name: 'OperationLogs',
        component: () => import('../views/admin/OperationLogs.vue'),
        meta: { title: '操作日志' }
      },
      {
        path: 'trees',
        name: 'TreeManagement',
        component: () => import('../views/admin/TreeManagement.vue'),
        meta: { title: '树木管理' }
      },
      {
        path: 'harvests',
        name: 'HarvestManagement',
        component: () => import('../views/admin/HarvestManagement.vue'),
        meta: { title: '收获管理' }
      },
      {
        path: 'adoptions',
        name: 'AdoptionManagement',
        component: () => import('../views/admin/AdoptionManagement.vue'),
        meta: { title: '认养订单管理' }
      }
    ]
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('../views/admin/Login.vue'),
    meta: { title: '管理员登录' }
  }
];
```

### 6.3 状态管理设计

使用Pinia进行状态管理，分为用户端和管理员端两个独立的store。

#### 用户端Store

```javascript
// store/user.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: null,
    isLoggedIn: false
  }),
  actions: {
    setUser(state, user) {
      state.user = user;
    },
    setToken(state, token) {
      state.token = token;
      state.isLoggedIn = !!token;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
    }
  }
});
```

#### 管理员端Store

```javascript
// store/admin.js
import { defineStore } from 'pinia';

export const useAdminStore = defineStore('admin', {
  state: () => ({
    admin: null,
    token: null,
    isLoggedIn: false
  }),
  actions: {
    setAdmin(state, admin) {
      state.admin = admin;
    },
    setToken(state, token) {
      state.token = token;
      state.isLoggedIn = !!token;
    },
    logout(state) {
      state.admin = null;
      state.token = null;
      state.isLoggedIn = false;
    }
  }
});
```

### 6.4 组件设计原则

- **组件化**: 将页面拆分为可复用的组件
- **单一职责**: 每个组件只负责一个功能
- **Props向下，Events向上**: 通过props传递数据，通过events传递事件
- **响应式设计**: 使用Vue 3的响应式API
- **性能优化**: 使用computed、watch等优化性能

## 7. 安全设计

### 7.1 身份认证

- **JWT认证**: 使用JSON Web Token进行身份认证
- **Token存储**: 前端使用localStorage存储Token
- **Token刷新**: 支持Token自动刷新机制
- **密码加密**: 使用bcrypt进行密码加密存储

### 7.2 权限控制

- **基于角色的权限控制**: 不同角色拥有不同的权限
- **权限粒度**: 细粒度的权限控制，精确到具体操作
- **权限验证**: 在后端中间件中进行权限验证

### 7.3 数据安全

- **SQL注入防护**: 使用参数化查询，防止SQL注入
- **XSS防护**: 对用户输入进行转义和验证
- **CSRF防护**: 使用Token验证CSRF攻击
- **敏感数据加密**: 密码等敏感数据加密存储

### 7.4 API安全

- **请求频率限制**: 防止API被恶意调用
- **IP白名单**: 支持IP白名单配置
- **HTTPS支持**: 生产环境强制使用HTTPS
- **API版本控制**: 支持API版本控制

## 8. 性能优化

### 8.1 前端性能优化

- **代码分割**: 使用动态import实现代码分割
- **懒加载**: 路由级别的懒加载
- **图片优化**: 图片懒加载、压缩
- **缓存策略**: 合理使用缓存，减少不必要的请求
- **虚拟列表**: 大数据列表使用虚拟滚动

### 8.2 后端性能优化

- **数据库索引**: 为常用查询字段添加索引
- **查询优化**: 避免N+1查询，使用合理的JOIN策略
- **连接池**: 使用数据库连接池
- **缓存机制**: 使用Redis缓存热点数据
- **分页查询**: 大数据查询必须分页

### 8.3 数据库性能优化

- **读写分离**: 考虑数据库读写分离
- **表分区**: 大表考虑按时间分区
- **归档策略**: 历史数据定期归档
- **索引优化**: 合理设计索引，避免过多索引

## 9. 部署方案

### 9.1 开发环境部署

- **本地开发**: 使用Vite开发服务器，支持热更新
- **环境变量**: 使用.env文件管理环境变量
- **代码规范**: 使用ESLint进行代码检查
- **Git版本控制**: 使用Git进行版本控制

### 9.2 生产环境部署

- **反向代理**: 使用Nginx作为反向代理服务器
- **负载均衡**: 使用Nginx实现负载均衡
- **静态资源**: 使用CDN加速静态资源访问
- **HTTPS**: 强制使用HTTPS加密传输
- **数据库备份**: 定期备份数据库
- **日志管理**: 集中管理应用日志
- **监控告警**: 配置监控和告警系统

## 10. 扩展性设计

### 10.1 系统扩展性

- **微服务架构**: 考虑将系统拆分为微服务
- **消息队列**: 使用消息队列处理异步任务
- **缓存层**: 引入Redis等缓存层
- **搜索引擎**: 考虑引入Elasticsearch等搜索引擎
- **文件存储**: 使用OSS等对象存储服务

### 10.2 功能扩展

- **移动端适配**: 支持移动端访问
- **多语言支持**: 支持国际化，支持多语言
- **支付集成**: 集成第三方支付平台
- **社交功能**: 支持社交分享、评论等
- **数据分析**: 增强数据分析功能，提供更多报表

## 11. 测试策略

### 11.1 单元测试

- **后端测试**: 使用Jest进行单元测试
- **前端测试**: 使用Vitest进行单元测试
- **测试覆盖率**: 目标测试覆盖率达到80%以上
- **Mock数据**: 使用Mock数据进行测试

### 11.2 集成测试

- **API测试**: 使用Postman或Swagger进行API测试
- **E2E测试**: 进行端到端的集成测试
- **性能测试**: 进行性能压力测试
- **安全测试**: 进行安全漏洞扫描和渗透测试

### 11.3 用户验收测试

- **功能测试**: 按照需求文档进行功能测试
- **兼容性测试**: 测试不同浏览器和设备的兼容性
- **用户体验测试**: 进行用户体验测试
- **回归测试**: 每次发布前进行回归测试

## 12. 维护与监控

### 12.1 日志管理

- **应用日志**: 记录应用运行日志
- **错误日志**: 记录错误日志，便于排查问题
- **访问日志**: 记录访问日志，分析用户行为
- **操作日志**: 记录管理员操作日志，便于审计
- **日志分级**: 按照日志级别（DEBUG、INFO、WARN、ERROR）进行分级

### 12.2 监控指标

- **系统指标**: CPU使用率、内存使用率、磁盘使用率
- **应用指标**: 请求响应时间、错误率、吞吐量
- **业务指标**: 用户活跃度、订单量、收入等
- **数据库指标**: 数据库连接数、查询响应时间、慢查询数量

### 12.3 告警机制

- **系统告警**: 系统异常时发送告警
- **性能告警**: 响应时间超过阈值时发送告警
- **业务告警**: 关键业务指标异常时发送告警
- **告警渠道**: 邮件、短信、钉钉等

## 13. 开发规范

### 13.1 代码规范

- **命名规范**: 遵循统一的命名规范
- **注释规范**: 重要代码必须添加注释
- **格式规范**: 使用Prettier统一代码格式
- **Git规范**: 遵循Git提交规范，使用规范的commit message

### 13.2 文档规范

- **API文档**: 使用Swagger生成API文档
- **数据库文档**: 维护数据库设计文档
- **开发文档**: 编写详细的开发文档
- **部署文档**: 编写部署文档和运维手册

## 14. 项目特色

### 14.1 技术特色

- **前后端分离**: 清晰的架构分层，便于维护和扩展
- **双数据库设计**: 用户数据和管理员数据分离，提高安全性和性能
- **RESTful API**: 标准的RESTful API设计，便于第三方集成
- **响应式设计**: 基于Vue 3的响应式设计，提供良好的用户体验
- **组件化开发**: 高度组件化，代码复用性强

### 14.2 业务特色

- **完整的业务流程**: 从用户注册到订单配送的完整业务流程
- **权限管理**: 精细的权限控制，确保系统安全
- **数据可视化**: 丰富的图表和统计功能，便于数据分析
- **操作审计**: 完整的操作日志记录，便于审计和追溯
- **大客户备注**: 支持管理员备注大客户信息，便于后续服务和营销

## 15. 总结

橙子树认养系统是一个功能完善、架构清晰、技术先进的在线果树认养管理平台。系统采用前后端分离架构，使用Vue 3 + Express.js技术栈，实现了用户端和管理员端双端应用，支持从用户注册、果树浏览、认养下单到订单管理、物流配送等完整的业务流程。

系统具有良好的扩展性和维护性，采用现代化的技术栈和开发规范，为后续的功能扩展和系统优化奠定了坚实的基础。通过合理的数据库设计、API接口设计和前端架构，系统能够满足当前的业务需求，并为未来的发展预留了足够的空间。
