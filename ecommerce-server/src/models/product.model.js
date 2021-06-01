const mongoose = require('mongoose');

const Product = mongoose.model(
    'Product',
    new mongoose.Schema({
        sku: String,
        title: String,
        description: String,
        image: String,
        quantity: Number,
        price: Number,
        product_details: JSON,
        shipping_details: JSON,
        categories: Array,
        sellerId: String
    })
);

module.exports = Product;
