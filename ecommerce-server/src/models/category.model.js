const mongoose = require('mongoose');

const Category = mongoose.model(
  'Category',
  new mongoose.Schema({
    title: String,
    parent: String,
    path: String
  })
);

module.exports = Category;
