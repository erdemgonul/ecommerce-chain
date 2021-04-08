const db = require('../models');

const Product = db.product;

const self = {
  isProductIdExists: async (productId) => {
    try {
      const product = await Product.findOne({
        id: productId
      }).exec();

      if (product) {
        return true;
      }
    } catch (err) {
      return err;
    }

    return false;
  },

  createProduct: async (id, image, title, price, description, size, color) => {
    const product = new Product({
      id, image, title, price, description, size, color
    });

    try {
      const createdProduct = await product.save();

      if (createdProduct) {
        return createdProduct.toObject();
      }
    } catch (err) {
      return err;
    }
  },

  getProductByProductId: async (productId) => {
    try {
      const product = await Product.findOne({
        id: productId
      }).exec();

      if (product) {
        return product.toObject();
      }
    } catch (err) {
      return err;
    }
  },

  getAllProducts: async () => {
    try {
      const result = [];

      const products = await Product.find({
      }).exec();

      for (let product of products) {
        const productObj = product.toObject();
        delete productObj._id;
        delete productObj.__v;
        result.push(productObj)
      }

      return result;
    } catch (err) {
      return err;
    }
  },
};

module.exports = self;
