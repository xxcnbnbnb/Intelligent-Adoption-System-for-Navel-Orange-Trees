# 登录测试用例

## 1. 用户登录

### 1.1 路由信息
- **路由**: `POST /api/user/login`
- **方法**: POST
- **认证**: 不需要JWT认证

### 1.2 请求参数
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| phone  | string | 是 | 用户手机号 |
| password | string | 是 | 用户密码 |

### 1.3 请求示例
```json
{
  "phone": "13800138000",
  "password": "123456"
}
```

### 1.4 成功响应示例
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicGhvbmUiOiIxMzgwMDEzODAwMCIsIm5pY2tuYW1lIjoi546L55CGIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NzI2ODgwMDAsImV4cCI6MTc3MzI5MjgwMH0.SIGNATURE",
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

### 1.5 失败响应示例

#### 1.5.1 参数缺失
```json
{
  "success": false,
  "message": "手机号和密码不能为空"
}
```

#### 1.5.2 用户不存在
```json
{
  "success": false,
  "message": "用户不存在"
}
```

#### 1.5.3 密码错误
```json
{
  "success": false,
  "message": "密码错误"
}
```

#### 1.5.4 用户被禁用
```json
{
  "success": false,
  "message": "用户账号已被禁用"
}
```

## 2. 管理员登录

### 2.1 路由信息
- **路由**: `POST /api/admin/login`
- **方法**: POST
- **认证**: 不需要JWT认证

### 2.2 请求参数
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| username | string | 是 | 管理员用户名 |
| password | string | 是 | 管理员密码 |

### 2.3 请求示例
```json
{
  "username": "admin",
  "password": "admin123"
}
```

### 2.4 成功响应示例
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInJlYWxfbmFtZSI6IuW8oOS4iSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3MjY4ODAwMCwiZXhwIjoxNzczMjkyODAwfQ.SIGNATURE",
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

### 2.5 失败响应示例

#### 2.5.1 参数缺失
```json
{
  "success": false,
  "message": "用户名和密码不能为空"
}
```

#### 2.5.2 管理员不存在
```json
{
  "success": false,
  "message": "管理员不存在"
}
```

#### 2.5.3 密码错误
```json
{
  "success": false,
  "message": "密码错误"
}
```

#### 2.5.4 管理员被禁用
```json
{
  "success": false,
  "message": "管理员账号已被禁用"
}
```

## 3. Postman测试步骤

### 3.1 用户登录测试
1. 打开Postman
2. 创建一个新的请求
3. 设置请求方法为 `POST`
4. 输入URL: `http://localhost:3000/api/user/login`
5. 在 `Body` 标签页中选择 `raw` 格式，类型选择 `JSON`
6. 输入请求体：
   ```json
   {
     "phone": "13800138000",
     "password": "123456"
   }
   ```
7. 点击 `Send` 按钮
8. 查看响应结果

### 3.2 管理员登录测试
1. 打开Postman
2. 创建一个新的请求
3. 设置请求方法为 `POST`
4. 输入URL: `http://localhost:3000/api/admin/login`
5. 在 `Body` 标签页中选择 `raw` 格式，类型选择 `JSON`
6. 输入请求体：
   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```
7. 点击 `Send` 按钮
8. 查看响应结果

## 4. 测试数据准备

### 4.1 用户测试数据
- 手机号: `13800138000`
- 密码: `123456`
- 昵称: `测试用户`
- 状态: `active`

### 4.2 管理员测试数据
- 用户名: `admin`
- 密码: `admin123`
- 真实姓名: `管理员`
- 手机号: `13800138000`
- 角色ID: `1`
- 状态: `active`

## 5. 注意事项

1. **密码验证**：当前项目中密码验证使用简单的字符串比较，实际生产环境中应该使用bcrypt等库进行密码哈希处理。

2. **JWT令牌**：登录成功后会返回JWT令牌，该令牌用于后续需要认证的API请求。

3. **令牌使用**：在后续请求中，需要在请求头中添加 `Authorization: Bearer <token>` 来进行认证。

4. **令牌过期**：JWT令牌默认过期时间为7天，可以在 `src/config/index.js` 中配置。

5. **环境配置**：确保数据库中存在对应的用户和管理员数据，否则登录会失败。

6. **服务器状态**：确保开发服务器正在运行，默认端口为3000。

## 6. 错误排查

### 6.1 404错误
- 检查URL是否正确
- 检查服务器是否正在运行

### 6.2 500错误
- 检查数据库连接是否正常
- 检查数据库中是否存在对应的用户/管理员数据
- 查看服务器日志获取详细错误信息

### 6.3 401错误
- 检查密码是否正确
- 检查用户/管理员状态是否为 `active`

## 7. 测试建议

1. **先测试失败场景**：先测试参数缺失、用户不存在、密码错误等失败场景，确保错误处理正常。

2. **再测试成功场景**：确认失败场景测试通过后，再测试成功登录场景。

3. **保存测试用例**：将测试用例保存到Postman Collection中，方便后续重复测试。

4. **验证令牌有效性**：登录成功后，使用返回的令牌测试需要认证的API接口，确保令牌能够正常使用。

5. **测试边界情况**：测试手机号格式错误、密码长度等边界情况。

---

**测试完成后**，您可以使用登录获取的令牌来测试其他需要认证的API接口，如用户个人资料、认养订单等功能。