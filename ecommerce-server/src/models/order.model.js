const mongoose = require('mongoose');

const Product = mongoose.model(
  'Order',
  new mongoose.Schema({
    status: String,
    createdOn: String,
    createdBy: String,
    shippingAddress: String,
    billingAddress: String,
    products: Array,
    orderTotal: Number,
      expireAt: Date
  })
);

module.exports = Product;
