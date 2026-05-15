const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth, merchantAuth } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('merchantId', 'name');
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
});

router.get('/merchant', merchantAuth, async (req, res) => {
  try {
    const products = await Product.find({ merchantId: req.user.id });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('merchantId', 'name');
    if (!product) {
      return res.status(404).json({ msg: '商品不存在' });
    }
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
});

router.post('/', merchantAuth, async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    
    const product = new Product({
      name,
      description,
      price,
      stock,
      category,
      merchantId: req.user.id
    });

    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
});

router.put('/:id', merchantAuth, async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: '商品不存在' });
    }

    if (product.merchantId.toString() !== req.user.id) {
      return res.status(403).json({ msg: '无权修改此商品' });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, stock, category },
      { new: true }
    );

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
});

router.delete('/:id', merchantAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: '商品不存在' });
    }

    if (product.merchantId.toString() !== req.user.id) {
      return res.status(403).json({ msg: '无权删除此商品' });
    }

    await Product.findByIdAndRemove(req.params.id);
    res.json({ msg: '商品已删除' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
});

module.exports = router;