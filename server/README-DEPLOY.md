# 采购系统后端 - Railway 部署指南

## 快速开始

### 方式一：使用部署脚本（推荐）

```powershell
# 进入 server 目录
cd server

# 运行部署脚本
.\deploy-railway.ps1
```

### 方式二：手动部署

```powershell
# 1. 安装 Railway CLI (如果尚未安装)
npm install -g @railway/cli

# 2. 登录 Railway
railway login

# 3. 初始化项目（如果是新项目）
railway init

# 4. 设置环境变量
railway variables set PORT 3000
railway variables set MONGODB_URI "<你的MongoDB连接字符串>"
railway variables set JWT_SECRET "e59adccec84a8ababb1d97f64719deea966e622848deb24891af712ea0225007"
railway variables set JWT_EXPIRE "7d"

# 5. 部署项目
railway up

# 6. 获取部署地址
railway domain
```

## 部署前准备

1. **Railway 账号**：访问 https://railway.app 注册
2. **MongoDB 数据库**：项目已使用 MongoDB Atlas，确保连接字符串正确
3. **Node.js 环境**：确保本地安装了 Node.js (v16+)

## 部署文件说明

| 文件 | 说明 |
|------|------|
| `railway.json` | Railway 项目配置 |
| `Procfile` | 进程配置（可选） |
| `deploy-railway.ps1` | PowerShell 自动部署脚本 |
| `.gitignore` | Git 忽略文件 |
| `package.json` | 项目依赖和脚本 |
| `server.js` | 服务端入口 |

## 部署后操作

### 查看日志
```powershell
railway logs
```

### 获取部署域名
```powershell
railway domain
```

### 重新部署
```powershell
# 简单部署
railway up

# 清空后重新部署
railway up --ci
```

### 连接数据库
如果需要在 Railway 上使用他们的 MongoDB，可以：
1. 访问 https://railway.app/dashboard
2. 进入你的项目
3. 添加 "MongoDB" 插件
4. 复制连接字符串
5. 更新 `MONGODB_URI` 环境变量

## 更新前端 API 地址

部署成功后，记得更新前端的 API 地址：

在 `ingredient-purchase-client.html` 中：
```javascript
const API_BASE_URL = "https://你的-railway-域名.up.railway.app/api";
```

## 常见问题

**Q: 部署失败怎么办？**
A: 查看日志：`railway logs`

**Q: 如何修改环境变量？**
A: `railway variables set KEY "value"`

**Q: 数据库连接不上？**
A: 确保 MongoDB Atlas 已将 Railway 的 IP 加入白名单，或使用 Railway 提供的 MongoDB 插件
