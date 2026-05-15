# 部署说明

## 项目已完成 ✅

微信小程序项目已创建完成，包含以下四个核心功能模块：

### 📁 项目结构

```
miniprogram/
├── app.js                      # 应用入口（数据初始化）
├── app.json                    # 应用配置
├── app.wxss                    # 全局样式（含底部导航栏样式）
├── sitemap.json                # SEO配置
├── project.config.json         # 微信开发者工具配置
├── .gitignore                  # Git忽略文件
├── README.md                   # 项目说明文档
├── push-to-github.bat          # Git推送脚本（Windows）
├── images/                     # 图标资源目录
│   └── README.md               # 图标制作说明
└── pages/
    ├── ingredients/             # 食材清单页面
    │   ├── ingredients.js
    │   ├── ingredients.wxml
    │   └── ingredients.wxss
    ├── purchase/               # 采购任务页面
    │   ├── purchase.js
    │   ├── purchase.wxml
    │   └── purchase.wxss
    ├── history/                # 历史采购页面
    │   ├── history.js
    │   ├── history.wxml
    │   └── history.wxss
    └── customers/              # 客户名单页面
        ├── customers.js
        ├── customers.wxml
        └── customers.wxss
```

---

## 推送到GitHub步骤

### 方法一：使用推送脚本（推荐）

1. **安装 Git**（如果尚未安装）
   - 下载地址：https://git-scm.com/download/win
   - 安装时选择 "Use Git from Windows Command Prompt"

2. **双击运行** `push-to-github.bat`

3. **创建 GitHub 仓库**
   - 访问 https://github.com/new
   - 仓库名称：`miniprogram-ingredient-purchase`（或您喜欢的名称）
   - 选择 Private（私有）或 Public（公开）
   - 点击 "Create repository"

4. **按照脚本提示推送代码**

### 方法二：手动推送

```bash
# 1. 进入小程序目录
cd miniprogram

# 2. 初始化Git仓库
git init

# 3. 配置用户信息
git config user.name "Your Name"
git config user.email "your.email@example.com"

# 4. 添加所有文件
git add .

# 5. 提交
git commit -m "feat: 采购系统-食材端微信小程序 v1.0.0"

# 6. 添加远程仓库（替换 YOUR_USERNAME 和 REPO_NAME）
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 7. 推送
git push -u origin master
```

---

## 微信开发者工具配置

1. 下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

2. 打开微信开发者工具，点击 "导入项目"

3. 选择 `miniprogram` 目录

4. 配置 AppID
   - 如果有测试号：使用测试号
   - 如果没有：选择"体验版"或申请正式 AppID

5. 点击"确定"完成导入

---

## 功能演示

### TabBar 导航
- 🍅 食材清单
- 🛒 采购任务
- 📜 历史采购
- 👥 客户名单

### 食材清单
- 卡片式布局展示
- 支持搜索和分类筛选
- 添加/编辑/删除食材
- 分类颜色标签（冻品-蓝、酱料-橙、蔬菜-绿、肉类-红）

### 采购任务
- 从食材清单选择采购项
- 支持修改数量和单价
- 状态管理：未买(黄)、缺货(红)、已买(绿)
- 一键完成采购

### 历史采购
- 按时间筛选
- 统计采购次数、品类数量、总金额
- 一键清空历史

### 客户名单
- 搜索客户
- 完整的客户信息管理
- 包含微信/QQ字段

---

## 热更新说明

热更新通常指的是小程序通过后台审核后自动更新。但微信小程序的热更新机制由微信官方控制：

1. **提交审核**：在微信公众平台提交新版本
2. **审核通过后发布**：线上用户会在一定时间内更新

如果您希望实现代码的即时更新，可以考虑：

1. **使用小程序云开发**：将部分业务逻辑移至云函数
2. **使用跨平台框架**：如 Taro、uni-app 等，支持代码热更新

---

## 常见问题

### Q: 底部TabBar图标不显示？
A: 微信开发者工具中可能需要勾选"不校验合法域名"选项

### Q: 数据存储在哪里？
A: 使用 LocalStorage 存储在用户本地设备

### Q: 如何添加更多分类？
A: 在各页面的 `categories` 数组中添加新分类，并更新 `categoryColors` 映射

---

## 版本信息

- 当前版本：v1.0.0
- 更新日期：2026-05-14
- 技术栈：微信小程序 + JavaScript + LocalStorage