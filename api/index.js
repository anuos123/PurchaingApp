const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const serverless = require('serverless-http');
const User = require('../server/models/User');
const Product = require('../server/models/Product');
const Order = require('../server/models/Order');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB连接成功'))
.catch(err => console.error('MongoDB连接失败:', err));

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: '用户已存在' });
    }

    user = new User({ name, email, password, role: role || 'user' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: '服务器错误' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: '用户不存在' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: '密码错误' });
    }

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: '服务器错误' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: '服务器错误' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: '商品不存在' });
    }
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: '服务器错误' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, price, stock, category, description } = req.body;
    const product = new Product({ name, price, stock, category, description });
    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: '服务器错误' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name email');
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: '服务器错误' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { items, total } = req.body;
    const userId = req.headers['user-id'];

    const order = new Order({ userId, items, total });
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: '服务器错误' });
  }
});

app.get('/', (req, res) => {
  res.send('采购系统服务端运行中...');
});

module.exports.handler = serverless(app);