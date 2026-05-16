# 采购系统 - 本地开发环境说明

## 📖 项目简介

这是一个功能完善的采购管理系统，包含以下模块：

- **客户端** (`client/`)：用户采购界面
- **商家端** (`merchant/`)：商家管理界面
- **服务端** (`server/`)：后端 API 服务
- **API 接口** (`api/`)：Serverless API 入口
- **小程序** (`miniprogram/`)：微信小程序版本

---

## 🏗️ 项目结构

```
PurchaingApp/
├── api/                    # Serverless API 入口
│   └── index.js
├── client/                 # 用户端 Vue 项目
│   ├── src/
│   │   ├── components/     # Vue 组件
│   │   ├── App.vue        # 主应用
│   │   └── main.js        # 入口文件
│   ├── package.json
│   └── index.html
├── merchant/               # 商家端 Vue 项目
│   ├── src/
│   │   ├── components/
│   │   ├── App.vue
│   │   └── main.js
│   ├── package.json
│   └── index.html
├── miniprogram/            # 微信小程序
│   └── pages/
├── server/                 # 后端服务
│   ├── models/            # 数据模型
│   │   ├── User.js       # 用户模型
│   │   ├── Product.js     # 商品模型
│   │   └── Order.js      # 订单模型
│   ├── routes/            # 路由
│   │   ├── auth.js       # 认证路由
│   │   ├── products.js   # 商品路由
│   │   └── orders.js     # 订单路由
│   ├── middleware/        # 中间件
│   │   └── auth.js       # JWT 认证中间件
│   ├── server.js         # 服务端入口
│   ├── package.json
│   └── .env              # 环境变量配置
├── package.json           # 根目录配置
└── README.md             # 本文档
```

---

## 🔧 环境要求

| 软件 | 版本要求 | 说明 |
|------|---------|------|
| **Node.js** | ≥ 18.0.0 | 后端运行环境 |
| **npm** | ≥ 9.0.0 | 包管理器 |
| **MongoDB** | 云数据库 | 使用 MongoDB Atlas 或本地 MongoDB |

---

## 🚀 安装步骤

### 1. 克隆项目

```bash
git clone https://github.com/anuos123/PurchaingApp.git
cd PurchaingApp
```

### 2. 安装依赖

#### 方式一：一键安装所有依赖（推荐）

```bash
npm run install:all
```

#### 方式二：分别安装

```bash
# 安装根目录依赖
npm install

# 安装服务端依赖
cd server
npm install

# 安装客户端依赖
cd ../client
npm install
```

---

## ⚙️ 环境变量配置

### 配置文件位置

`server/.env`

### 配置项说明

| 变量名 | 必填 | 说明 | 示例值 |
|--------|------|------|--------|
| `PORT` | ✅ | 服务端口 | `3000` |
| `MONGODB_URI` | ✅ | MongoDB 连接字符串 | `mongodb+srv://...` |
| `JWT_SECRET` | ✅ | JWT 加密密钥 | `your-secret-key` |
| `JWT_EXPIRE` | ❌ | Token 过期时间 | `7d` |

### MONGODB_URI 格式

```env
# 标准格式
MONGODB_URI=mongodb://用户名:密码@主机地址:27017/数据库名

# SRV 格式（推荐，用于 MongoDB Atlas）
MONGODB_URI=mongodb+srv://用户名:URL编码密码@集群地址/数据库名?参数
```

**注意**：密码中包含特殊字符时需要 URL 编码：
- `.` → `%2E`
- `/` → `%2F`
- `@` → `%40`

### JWT_SECRET 生成方法

```bash
# 使用 Node.js 生成安全的随机密钥
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🎯 启动项目

### 开发模式

#### 启动后端服务

```bash
cd server
npm run dev
```

服务端将在 `http://localhost:3000` 运行，支持热重载。

#### 启动用户端

```bash
cd client
npm run serve
```

客户端将在 `http://localhost:8080` 运行。

#### 启动商家端

```bash
cd merchant
npm run serve
```

商家端将在 `http://localhost:8081` 运行。

### 生产模式

#### 构建前端

```bash
# 构建用户端
npm run build

# 或在 client 目录执行
cd client
npm run build
```

构建产物将输出到 `client/dist/` 目录。

#### 启动后端服务

```bash
cd server
npm start
```

---

## 📡 API 接口文档

### 认证接口

#### 注册用户

```
POST /api/auth/register
Content-Type: application/json

{
  "name": "张三",
  "email": "zhangsan@example.com",
  "password": "123456",
  "role": "user"  // user | merchant
}
```

#### 用户登录

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "zhangsan@example.com",
  "password": "123456"
}
```

**响应示例**：
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "张三",
    "email": "zhangsan@example.com",
    "role": "user"
  }
}
```

### 商品接口

#### 获取商品列表

```
GET /api/products
```

#### 获取单个商品

```
GET /api/products/:id
```

#### 创建商品（需要认证）

```
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "商品名称",
  "price": 99.99,
  "stock": 100,
  "category": "分类",
  "description": "商品描述"
}
```

### 订单接口

#### 获取订单列表

```
GET /api/orders
Authorization: Bearer <token>
```

#### 创建订单

```
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "productId": "64f1a2b3c4d5e6f7a8b9c0d1",
      "quantity": 2,
      "price": 99.99
    }
  ],
  "total": 199.98
}
```

---

## 🛠️ 技术栈

### 前端

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue.js | ^3.3.4 | 渐进式 JavaScript 框架 |
| Element Plus | ^2.3.14 | UI 组件库 |
| Axios | ^1.5.0 | HTTP 请求库 |
| Vue CLI | ^5.0.8 | Vue 开发工具 |

### 后端

| 技术 | 版本 | 用途 |
|------|------|------|
| Express | ^4.18.2 | Node.js Web 框架 |
| Mongoose | ^7.5.0 | MongoDB 对象模型工具 |
| JWT | ^9.0.2 | JSON Web Token 认证 |
| Bcryptjs | ^2.4.3 | 密码加密 |
| Cors | ^2.8.5 | 跨域资源共享 |
| Dotenv | ^16.3.1 | 环境变量管理 |

### 数据库

| 技术 | 说明 |
|------|------|
| MongoDB Atlas | 云数据库服务 |
| Mongoose | MongoDB ORM |

---

## 🔍 常见问题

### 1. MongoDB 连接失败

**症状**：`MongoDB连接失败` 错误

**解决方案**：
- 检查 `.env` 文件中的 `MONGODB_URI` 是否正确
- 确认 MongoDB Atlas 的 IP 白名单允许当前 IP 访问
- 检查用户名密码是否正确

### 2. 端口被占用

**症状**：`Port 3000 is already in use`

**解决方案**：
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <进程ID> /F

# 或修改 .env 中的 PORT 值
```

### 3. 前端无法连接后端

**症状**：前端请求报错 `Network Error`

**解决方案**：
- 确认后端服务已启动并运行在正确端口
- 检查前端 API 请求地址配置
- 确认 CORS 配置正确

### 4. 依赖安装失败

**症状**：`npm install` 报错

**解决方案**：
```bash
# 清除 npm 缓存
npm cache clean --force

# 删除 node_modules 重新安装
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 开发建议

### 目录结构

```
遵循现有的项目结构：
- 后端代码放在 server/ 目录
- 前端代码放在 client/ 或 merchant/ 目录
- 共享的代码可以提取到公共目录
```

### 代码规范

- 使用 ES6+ 语法
- 使用 async/await 处理异步操作
- 环境变量存储在 .env 文件中
- 敏感信息不要提交到 Git

### Git 提交规范

```bash
# 添加文件
git add .

# 提交（使用清晰的提交信息）
git commit -m "feat: 添加新功能"

# 推送
git push origin main
```

---

## 📞 获取帮助

- **GitHub Issues**: https://github.com/anuos123/PurchaingApp/issues
- **项目文档**: 查看各模块目录下的 README 文件

---

## 📄 许可证

ISC License

---

**最后更新**: 2026-05-16