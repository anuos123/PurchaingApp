# 采购系统

一个完整的采购系统，包含客户端、服务端和商家端。

## 技术栈

- **服务端**: Node.js + Express + MongoDB
- **客户端**: Vue.js 3 + Element Plus
- **商家端**: Vue.js 3 + Element Plus

## 项目结构

```
PurchaingApp/
├── server/          # 服务端
├── client/          # 客户端
└── merchant/        # 商家端
```

## 快速开始

### 1. 安装依赖

```bash
npm run install:all
```

### 2. 启动服务端

```bash
npm run start:server
```

服务端运行在 http://localhost:3000

### 3. 启动客户端

```bash
npm run start:client
```

客户端运行在 http://localhost:8080

### 4. 启动商家端

```bash
npm run start:merchant
```

商家端运行在 http://localhost:8081

## API接口

### 用户相关
- POST /api/auth/register - 用户注册
- POST /api/auth/login - 用户登录

### 商品相关
- GET /api/products - 获取商品列表
- GET /api/products/:id - 获取商品详情
- POST /api/products - 商家添加商品

### 订单相关
- POST /api/orders - 创建订单
- GET /api/orders - 获取订单列表
- GET /api/orders/:id - 获取订单详情
- PUT /api/orders/:id/status - 更新订单状态

## 数据库连接

确保MongoDB服务已启动，默认连接地址: mongodb://localhost:27017/purchasing