# GitHub Pages 部署说明

## 🎉 使用 GitHub Pages 部署

### 方法一：直接部署 HTML 文件（推荐）

项目中包含现成的静态页面，可直接部署：

| 文件名 | 说明 | 访问路径 |
|--------|------|---------|
| `simple-client.html` | 客户端页面 | `https://anuos123.github.io/PurchaingApp/simple-client.html` |
| `simple-admin.html` | 管理后台 | `https://anuos123.github.io/PurchaingApp/simple-admin.html` |
| `simple-merchant.html` | 商家端 | `https://anuos123.github.io/PurchaingApp/simple-merchant.html` |
| `ingredient-purchase-client.html` | 原料采购 | `https://anuos123.github.io/PurchaingApp/ingredient-purchase-client.html` |

---

## 🚀 部署步骤

### 步骤 1：在 GitHub 仓库中启用 Pages

1. 访问项目仓库：https://github.com/anuos123/PurchaingApp
2. 点击 **Settings**（设置）
3. 在左侧菜单中点击 **Pages**
4. 配置如下：
   - **Source（来源）**: `Deploy from a branch`
   - **Branch（分支）**: `main`
   - **Folder（文件夹）**: `/ (root)`
5. 点击 **Save**（保存）

### 步骤 2：等待部署完成

- 首次部署需要 1-3 分钟
- 部署成功后会显示绿色的 **Your site is live at** 提示
- 访问地址：`https://anuos123.github.io/PurchaingApp/`

---

## 📱 访问页面

部署成功后，您可以通过以下地址访问：

| 页面 | URL |
|------|-----|
| **首页** | `https://anuos123.github.io/PurchaingApp/` |
| **客户端** | `https://anuos123.github.io/PurchaingApp/simple-client.html` |
| **管理后台** | `https://anuos123.github.io/PurchaingApp/simple-admin.html` |
| **商家端** | `https://anuos123.github.io/PurchaingApp/simple-merchant.html` |
| **原料采购** | `https://anuos123.github.io/PurchaingApp/ingredient-purchase-client.html` |

---

## 🎨 自定义首页

如果需要设置自定义首页：

### 方法一：重命名文件

将 `simple-client.html` 重命名为 `index.html`

### 方法二：创建 index.html 重定向

创建 `index.html` 文件，内容如下：

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>采购系统</title>
    <meta http-equiv="refresh" content="0;url=simple-client.html">
</head>
<body>
    <p>正在跳转到采购系统...</p>
    <p>如果没有自动跳转，请 <a href="simple-client.html">点击这里</a></p>
</body>
</html>
```

---

## 📝 更新部署

### 每次提交代码后：

1. 提交代码到 GitHub
2. GitHub Pages 会自动检测并重新部署
3. 等待 1-2 分钟，刷新页面即可看到更新

---

## ⚠️ 注意事项

1. **API 访问限制**: GitHub Pages 是静态托管，无法直接运行 Node.js 后端
   - 如需后端 API，可以考虑使用 GitHub Issues 或第三方服务
2. **数据存储**: HTML 页面中的数据存储在 localStorage 中
3. **自动部署**: 每次 push 到 main 分支会触发自动部署

---

## 🎯 下一步建议

如需完整功能部署，可以考虑：

| 方案 | 说明 |
|------|------|
| **GitHub Pages + Supabase** | 使用 Supabase 作为后端 |
| **Vercel** | 支持完整的前后端部署 |
| **Netlify** | 与 Vercel 类似的托管服务 |

---

**最后更新**: 2026-05-16