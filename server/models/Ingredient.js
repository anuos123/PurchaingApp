const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  spec: {
    type: String,
    default: '-'
  },
  price: {
    type: Number,
    default: 0
  },
  note: {
    type: String,
    default: '-'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Ingredient', IngredientSchema);