const mongoose = require('mongoose');

const Product = mongoose.model(
  'Product',
  new mongoose.Schema({
    id: Number,
    image: String,
    title: String,
    price: Number,
    description: String,
    size: Number,
    color: String,
  })
);

module.exports = Product;
