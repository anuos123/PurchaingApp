## Supabase 数据库配置指南

### 第一步：注册 Supabase

1. 访问 **https://supabase.com**
2. 点击 **"Start your project"**
3. 使用 **GitHub 账号登录**（推荐）

---

### 第二步：创建新项目

1. 点击 **"New Project"**
2. 填写项目信息：
   - **Organization**: 选择您的个人账户
   - **Name**: `purchasing-app`
   - **Database Password**: 设置一个强密码（记住它！）
   - **Region**: 选择 `Northeast Asia (Tokyo)` 或 `Southeast Asia (Singapore)` - 距离中国较近

3. 点击 **"Create new project"**
4. 等待项目创建完成（约 2 分钟）

---

### 第三步：获取 API 密钥

项目创建成功后：

1. 进入项目 → **Settings** → **API**
2. 找到以下信息：

| 配置项 | 位置 | 示例值 |
|--------|------|--------|
| **Project URL** | 页面顶部 | `https://xxxxx.supabase.co` |
| **anon/public** key | API Settings | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

---

### 第四步：创建数据库表

在 Supabase 控制台中：

1. 点击左侧菜单 **SQL Editor**
2. 点击 **"New query"**
3. 粘贴以下 SQL 并点击 **"Run"**：

```sql
-- ============================================
-- 采购系统数据库表结构
-- ============================================

-- 1. 创建用户表
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'merchant', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建商品表
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER DEFAULT 0,
  category TEXT,
  description TEXT,
  image_url TEXT,
  merchant_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 创建订单表
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  items JSONB NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 创建客户表
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  merchant_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 创建消息表
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 创建采购任务表
CREATE TABLE purchase_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  ingredient_name TEXT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'purchasing', 'completed')),
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. 创建采购历史表
CREATE TABLE purchase_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  ingredient_name TEXT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit TEXT,
  price DECIMAL(10, 2),
  supplier TEXT,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 启用 Row Level Security (RLS)
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_history ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 创建公开访问策略（开发环境）
-- 生产环境请根据需要调整
-- ============================================

-- Users 表策略
CREATE POLICY "Allow all reads on users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow all inserts on users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all updates on users" ON users FOR UPDATE USING (true);

-- Products 表策略
CREATE POLICY "Allow all reads on products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow all inserts on products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all updates on products" ON products FOR UPDATE USING (true);
CREATE POLICY "Allow all deletes on products" ON products FOR DELETE USING (true);

-- Orders 表策略
CREATE POLICY "Allow all reads on orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow all inserts on orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all updates on orders" ON orders FOR UPDATE USING (true);

-- Customers 表策略
CREATE POLICY "Allow all reads on customers" ON customers FOR SELECT USING (true);
CREATE POLICY "Allow all inserts on customers" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all updates on customers" ON customers FOR UPDATE USING (true);
CREATE POLICY "Allow all deletes on customers" ON customers FOR DELETE USING (true);

-- Messages 表策略
CREATE POLICY "Allow all reads on messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Allow all inserts on messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all updates on messages" ON messages FOR UPDATE USING (true);
CREATE POLICY "Allow all deletes on messages" ON messages FOR DELETE USING (true);

-- Purchase Tasks 表策略
CREATE POLICY "Allow all reads on purchase_tasks" ON purchase_tasks FOR SELECT USING (true);
CREATE POLICY "Allow all inserts on purchase_tasks" ON purchase_tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all updates on purchase_tasks" ON purchase_tasks FOR UPDATE USING (true);
CREATE POLICY "Allow all deletes on purchase_tasks" ON purchase_tasks FOR DELETE USING (true);

-- Purchase History 表策略
CREATE POLICY "Allow all reads on purchase_history" ON purchase_history FOR SELECT USING (true);
CREATE POLICY "Allow all inserts on purchase_history" ON purchase_history FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all updates on purchase_history" ON purchase_history FOR UPDATE USING (true);
CREATE POLICY "Allow all deletes on purchase_history" ON purchase_history FOR DELETE USING (true);

-- ============================================
-- 创建索引以提高查询性能
-- ============================================

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_products_merchant_id ON products(merchant_id);
CREATE INDEX idx_customers_merchant_id ON customers(merchant_id);
CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_purchase_tasks_user_id ON purchase_tasks(user_id);
CREATE INDEX idx_purchase_history_user_id ON purchase_history(user_id);

-- ============================================
-- 插入示例数据
-- ============================================

-- 添加示例用户（密码是 123456 的 bcrypt 哈希）
INSERT INTO users (name, email, password, role) VALUES
('管理员', 'admin@example.com', '$2a$10$xJwDxcGzS.zGDGa0QqTQfuzaGQkQ.T8GxV3GtKqTqP0nU3U7W8Wuy', 'admin'),
('商家1', 'merchant1@example.com', '$2a$10$xJwDxcGzS.zGDGa0QqTQfuzaGQkQ.T8GxV3GtKqTqP0nU3U7W8Wuy', 'merchant'),
('测试用户', 'user@example.com', '$2a$10$xJwDxcGzS.zGDGa0QqTQfuzaGQkQ.T8GxV3GtKqTqP0nU3U7W8Wuy', 'user');

-- 添加示例商品
INSERT INTO products (name, price, stock, category, description, merchant_id) VALUES
('大米', 25.00, 100, '主食', '优质东北大米 5kg装', (SELECT id FROM users WHERE email = 'merchant1@example.com')),
('面粉', 18.00, 80, '主食', '高筋面粉 5kg装', (SELECT id FROM users WHERE email = 'merchant1@example.com')),
('食用油', 45.00, 50, '调料', '金龙鱼调和油 5L', (SELECT id FROM users WHERE email = 'merchant1@example.com')),
('鸡蛋', 12.00, 200, '副食', '新鲜土鸡蛋 30个', (SELECT id FROM users WHERE email = 'merchant1@example.com')),
('猪肉', 35.00, 30, '肉类', '新鲜五花肉 500g', (SELECT id FROM users WHERE email = 'merchant1@example.com'));
```

---

### 第五步：配置前端连接

创建 `.env` 文件或直接在代码中配置：

```javascript
// Supabase 配置
const SUPABASE_URL = 'https://您的项目ID.supabase.co';
const SUPABASE_ANON_KEY = '您的anon公钥';
```

---

### 第六步：更新前端代码

请查看 `simple-client-supabase.html` 文件，这是集成 Supabase 的完整版本。

---

## 📊 Supabase 免费额度

| 功能 | 免费额度 |
|------|---------|
| 数据库存储 | 500 MB |
| 月活跃用户 | 10,000 |
| 实时连接 | 200 并发 |
| API 请求 | 500,000 次/月 |
| 带宽 | 2 GB |

---

## 🔧 常用 Supabase API

### JavaScript SDK

```bash
npm install @supabase/supabase-js
```

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// 注册用户
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})

// 登录
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

// 查询数据
const { data: users, error } = await supabase
  .from('users')
  .select('*')

// 插入数据
const { data, error } = await supabase
  .from('products')
  .insert([
    { name: '新商品', price: 99.99, stock: 10 }
  ])
```

---

## 🆘 常见问题

### 1. CORS 错误

Supabase API 默认支持 CORS，如果遇到问题，检查：
- 是否正确配置了 anon key
- 是否启用了 RLS 策略

### 2. 数据库连接失败

检查：
- Project URL 是否正确（以 `.supabase.co` 结尾）
- 网络连接是否正常

### 3. 权限问题

如果无法读写数据：
- 检查 RLS 策略是否正确配置
- 确认 API key 有正确的权限

---

## 📞 获取帮助

- **Supabase 文档**: https://supabase.com/docs
- **GitHub**: https://github.com/supabase/supabase
- **Discord**: https://discord.gg/supabase

---

**最后更新**: 2026-05-16