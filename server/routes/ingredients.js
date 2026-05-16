const express = require('express');
const router = express.Router();
const Ingredient = require('../models/Ingredient');

router.get('/', async (req, res) => {
  try {
    const ingredients = await Ingredient.find().sort({ createdAt: -1 });
    res.json(ingredients);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);
    if (!ingredient) {
      return res.status(404).json({ msg: '食材不存在' });
    }
    res.json(ingredient);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, category, spec, price, note } = req.body;

    if (!name) {
      return res.status(400).json({ msg: '食材名称不能为空' });
    }

    const ingredient = new Ingredient({
      name,
      category: category || '其他',
      spec: spec || '-',
      price: price || 0,
      note: note || '-'
    });

    await ingredient.save();
    res.json(ingredient);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
});

router.post('/bulk', async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ msg: '无效的食材数据' });
    }

    const results = [];
    for (const item of ingredients) {
      const existing = await Ingredient.findOne({ name: item.name });
      if (existing) {
        Object.assign(existing, {
          category: item.category || existing.category,
          spec: item.spec || existing.spec,
          price: item.price || existing.price,
          note: item.note || existing.note
        });
        await existing.save();
        results.push(existing);
      } else {
        const ingredient = new Ingredient({
          name: item.name,
          category: item.category || '其他',
          spec: item.spec || '-',
          price: item.price || 0,
          note: item.note || '-'
        });
        await ingredient.save();
        results.push(ingredient);
      }
    }

    res.json({ msg: `成功导入 ${results.length} 条食材数据`, ingredients: results });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, category, spec, price, note } = req.body;

    let ingredient = await Ingredient.findById(req.params.id);
    if (!ingredient) {
      return res.status(404).json({ msg: '食材不存在' });
    }

    ingredient = await Ingredient.findByIdAndUpdate(
      req.params.id,
      { name, category, spec, price, note },
      { new: true }
    );

    res.json(ingredient);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);
    if (!ingredient) {
      return res.status(404).json({ msg: '食材不存在' });
    }

    await Ingredient.findByIdAndRemove(req.params.id);
    res.json({ msg: '食材已删除' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
});

router.delete('/', async (req, res) => {
  try {
    await Ingredient.deleteMany({});
    res.json({ msg: '所有食材已删除' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
});

module.exports = router;