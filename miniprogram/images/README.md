# TabBar 图标说明

本目录需要放置微信小程序 tabBar 所需的图标文件：

## 图标文件清单

| 文件名称 | 尺寸要求 | 说明 |
|---------|---------|------|
| ingredients.png | 81x81 px | 食材清单图标（未选中状态） |
| ingredients-active.png | 81x81 px | 食材清单图标（选中状态） |
| purchase.png | 81x81 px | 采购任务图标（未选中状态） |
| purchase-active.png | 81x81 px | 采购任务图标（选中状态） |
| history.png | 81x81 px | 历史采购图标（未选中状态） |
| history-active.png | 81x81 px | 历史采购图标（选中状态） |
| customers.png | 81x81 px | 客户名单图标（未选中状态） |
| customers-active.png | 81x81 px | 客户名单图标（选中状态） |

## 图标要求

1. 格式：PNG
2. 尺寸：81px × 81px
3. 未选中图标：建议使用灰色
4. 选中图标：建议使用主题色 #67C23A（绿色）

## 获取图标

可以使用以下方法获取图标：

1. **使用图标库**：从 IconFont、Material Icons 等图标库下载并调整尺寸
2. **在线生成**：使用在线图标生成工具
3. **自定义绘制**：使用 Photoshop、Sketch、Figma 等工具绘制

## 临时方案

如果暂时没有图标文件，可以：
1. 注释掉 app.json 中的 tabBar 配置
2. 使用 base64 编码的简单图标

## 图标示例

以下是推荐的图标风格：
- 食材清单：🍅 或 🌿
- 采购任务：🛒 或 ✅
- 历史采购：📜 或 📊
- 客户名单：👥 或 📋