# 脐橙树认养系统后端项目

基于 Express + Objection + Knex 五层架构的脐橙树认养系统后端服务。

## 技术栈

- **Node.js**: 18.x+
- **Express**: 4.18+ - Web应用框架
- **Objection.js**: 3.0+ - ORM框架
- **Knex.js**: 2.5+ - SQL查询构建器
- **MySQL**: 8.0+ - 关系型数据库

## 项目结构

```
orange-tree-adoption-system/
├── src/
│   ├── config/                      # 配置文件
│   │   ├── database.config.js       # 数据库配置
│   │   ├── knexfile.user.js         # 用户端数据库配置
│   │   ├── knexfile.admin.js        # 管理员端数据库配置
│   │   └── index.js                 # 主配置文件
│   │
│   ├── controllers/                 # 控制器层
│   │   ├── user/                    # 用户端控制器
│   │   └── admin/                   # 管理员端控制器
│   │
│   ├── services/                    # 服务层
│   │   ├── user/                    # 用户端服务
│   │   └── admin/                   # 管理员端服务
│   │
│   ├── repositories/                # 数据访问层
│   │   ├── user/                    # 用户端数据访问
│   │   └── admin/                   # 管理员端数据访问
│   │
│   ├── models/                      # 模型层
│   │   ├── user/                    # 用户端模型
│   │   └── admin/                   # 管理员端模型
│   │
│   ├── middleware/                  # 中间件
│   │   ├── auth.middleware.js       # 身份认证中间件
│   │   ├── error.middleware.js      # 错误处理中间件
│   │   ├── logger.middleware.js     # 日志记录中间件
│   │   ├── cors.middleware.js       # CORS跨域中间件
│   │   └── validator.middleware.js  # 参数验证中间件
│   │
│   ├── routes/                      # 路由
│   │   ├── user.routes.js           # 用户端路由
│   │   └── admin.routes.js          # 管理员端路由
│   │
│   ├── validators/                  # 验证器
│   │   ├── adoption.validator.js    # 认养订单验证器
│   │   └── tree.validator.js        # 树木信息验证器
│   │
│   ├── utils/                       # 工具类
│   │   ├── database.js              # 数据库工具
│   │   ├── response.js              # 响应工具
│   │   ├── error.js                 # 错误工具
│   │   └── constants.js             # 常量定义
│   │
│   └── app.js                       # Express应用入口
│
├── database/                        # 数据库相关
│   ├── migrations/                  # 数据库迁移
│   │   ├── user/                    # 用户端迁移文件
│   │   └── admin/                   # 管理员端迁移文件
│   └── seeds/                       # 数据填充
│       ├── user/                    # 用户端种子数据
│       └── admin/                   # 管理员端种子数据
│
├── tests/                           # 测试文件
│   ├── unit/                        # 单元测试
│   ├── integration/                 # 集成测试
│   └── e2e/                         # 端到端测试
│
├── docs/                            # 文档
│   ├── api/                         # API文档
│   └── architecture/                # 架构文档
│
├── .env.example                     # 环境变量示例
├── .gitignore                       # Git忽略文件
├── package.json                     # 项目依赖
├── README.md                        # 项目说明
└── server.js                        # 服务器启动文件
```

## 安装依赖

```bash
npm install
```

## 环境配置

1. 复制环境变量示例文件：
```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，配置数据库连接等信息：
```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=orange_user

ADMIN_DB_HOST=localhost
ADMIN_DB_PORT=3306
ADMIN_DB_USER=root
ADMIN_DB_PASSWORD=your_password
ADMIN_DB_NAME=orange_admin

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

## 数据库迁移

运行用户端数据库迁移：
```bash
npm run migrate:user
```

运行管理员端数据库迁移：
```bash
npm run migrate:admin
```

填充测试数据：
```bash
npm run seed:user
npm run seed:admin
```

## 启动项目

开发模式：
```bash
npm run dev
```

生产模式：
```bash
npm start
```

## API文档

### 用户端API

#### 用户管理
- `GET /api/user/profile` - 获取用户信息
- `PUT /api/user/profile` - 更新用户信息

#### 认养订单
- `POST /api/user/adoptions` - 创建认养订单
- `GET /api/user/adoptions/:id` - 获取订单详情
- `GET /api/user/adoptions` - 获取用户订单列表
- `PUT /api/user/adoptions/:id/status` - 更新订单状态

#### 树木信息
- `GET /api/user/trees` - 获取树木列表
- `GET /api/user/trees/:id` - 获取树木详情

#### 生长记录
- `GET /api/user/trees/:treeId/growth` - 获取树木生长记录
- `GET /api/user/growth/:id` - 获取生长记录详情

#### 物流信息
- `GET /api/user/adoptions/:adoptionId/logistics` - 获取物流信息
- `PUT /api/user/logistics/:id/receive` - 确认收货

#### 用户互动
- `POST /api/user/interactions` - 创建互动记录
- `GET /api/user/trees/:treeId/interactions` - 获取树木互动记录

### 管理员端API

#### 管理员管理
- `GET /api/admin/profile` - 获取管理员信息
- `PUT /api/admin/profile` - 更新管理员信息

#### 角色权限
- `GET /api/admin/roles` - 获取角色列表
- `POST /api/admin/roles` - 创建角色
- `PUT /api/admin/roles/:id` - 更新角色
- `DELETE /api/admin/roles/:id` - 删除角色

#### 操作日志
- `GET /api/admin/operations` - 获取操作日志
- `GET /api/admin/operations/:id` - 获取操作日志详情

#### 树木管理
- `GET /api/admin/trees` - 获取树木列表
- `POST /api/admin/trees` - 创建树木
- `PUT /api/admin/trees/:id` - 更新树木
- `DELETE /api/admin/trees/:id` - 删除树木

#### 收获管理
- `GET /api/admin/harvests` - 获取收获记录
- `POST /api/admin/harvests` - 创建收获记录
- `PUT /api/admin/harvests/:id` - 更新收获记录

## 五层架构说明

### 1. Middleware 层
负责请求预处理、身份认证、错误处理、日志记录等。

### 2. Controller 层
负责接收HTTP请求、参数验证、调用Service层、格式化响应。

### 3. Service 层
负责业务逻辑处理、事务管理、数据关联验证、协调多个Repository。

### 4. Repository 层
负责数据访问、查询构建、缓存策略、提供数据访问接口。

### 5. Model 层
负责数据模型定义、关系映射、验证规则、钩子函数。

## 测试

运行所有测试：
```bash
npm test
```

运行测试并生成覆盖率报告：
```bash
npm run test:coverage
```

## 代码规范

运行代码检查：
```bash
npm run lint
```

自动修复代码问题：
```bash
npm run lint:fix
```

## 部署

### 使用PM2部署

```bash
npm install -g pm2
pm2 start ecosystem.config.js
```

### 使用Docker部署

```bash
docker-compose up -d
```

## 许可证

MIT

## 联系方式

如有问题，请联系项目维护者。