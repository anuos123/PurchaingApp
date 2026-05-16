const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 支持 Railway MongoDB 插件的环境变量名称
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;

app.use(cors());
app.use(express.json());

// 记录所有可用的环境变量（用于调试）
console.log('=== 环境变量配置 ===');
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI 存在:', !!process.env.MONGO_URI);
console.log('MONGODB_URI 存在:', !!process.env.MONGODB_URI);
console.log('DATABASE_URL 存在:', !!process.env.DATABASE_URL);
console.log('使用的 MONGO_URI:', MONGO_URI ? '已设置' : '未设置');
console.log('====================');

// MongoDB 连接
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB 连接成功');
})
.catch(err => {
  console.error('❌ MongoDB 连接失败:', err.message);
  // 仍然启动服务器，但数据库操作会失败
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/ingredients', require('./routes/ingredients'));

app.get('/', (req, res) => {
  res.send('采购系统服务端运行中...');
});

// 健康检查接口
app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected';
  
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbStatus
  });
});

app.listen(PORT, () => {
  console.log(`服务端运行在 http://localhost:${PORT}`);
});
