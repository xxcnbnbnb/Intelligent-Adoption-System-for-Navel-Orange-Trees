# 数据库迁移文件

此目录包含数据库迁移文件，用于创建和修改数据库表结构。

## 用户端迁移

运行用户端数据库迁移：
```bash
npm run migrate:user
```

## 管理员端迁移

运行管理员端数据库迁移：
```bash
npm run migrate:admin
```

## 迁移文件命名规范

迁移文件命名格式：`YYYYMMDDHHMMSS_description.js`

例如：`20240101120000_create_users_table.js`