const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth, merchantAuth } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    let orders;
    if (req.user.role === 'merchant') {
      orders = await Order.find({ merchantId: req.user.id }).populate('userId', 'name');
    } else {
      orders = await Order.find({ userId: req.user.id }).populate('merchantId', 'name');
    }
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name')
      .populate('merchantId', 'name');
    
    if (!order) {
      return res.status(404).json({ msg: '订单不存在' });
    }

    if (req.user.role === 'merchant' && order.merchantId._id.toString() !== req.user.id) {
      return res.status(403).json({ msg: '无权查看此订单' });
    }

    if (req.user.role === 'user' && order.userId._id.toString() !== req.user.id) {
      return res.status(403).json({ msg: '无权查看此订单' });
    }

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { items } = req.body;
    
    let totalAmount = 0;
    const products = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ msg: `商品 ${item.productId} 不存在` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ msg: `商品 ${product.name} 库存不足` });
      }

      products.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity
      });
      totalAmount += product.price * item.quantity;

      product.stock -= item.quantity;
      await product.save();
    }

    const order = new Order({
      userId: req.user.id,
      merchantId: products[0].productId,
      products,
      totalAmount
    });

    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
});

router.put('/:id/status', merchantAuth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: '订单不存在' });
    }

    if (order.merchantId.toString() !== req.user.id) {
      return res.status(403).json({ msg: '无权修改此订单' });
    }

    order.status = status;
    order.updatedAt = Date.now();
    await order.save();

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
});

module.exports = router;