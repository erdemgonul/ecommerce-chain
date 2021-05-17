const db = require('../models');
const util = require('../util/index');

const Product = db.product;
const ElasticSearchWrapper = require('../common/elasticsearchwrapper');
const elasticSearch = new ElasticSearchWrapper(process.env.ELASTIC_SEARCH_REGION, process.env.ELASTIC_SEARCH_DOMAIN, process.env.ELASTIC_SEARCH_PRODUCT_INDEX, process.env.ELASTIC_SEARCH_PRODUCT_INDEXTYPE, true, process.env.ELASTIC_SEARCH_USERNAME, process.env.ELASTIC_SEARCH_PASSWORD);

const self = {
  isProductIdExists: async (productId) => {
    try {
      const product = await Product.findOne({
        sku: productId
      }).exec();

      if (product) {
        return true;
      }
    } catch (err) {
      return err;
    }

    return false;
  },

  getQuantityOfProduct: async (productId) => {
    try {
      const product = await Product.findOne({
        sku: productId
      }, ['quantity']).exec();

      if (product) {
        return product;
      }
    } catch (err) {
      return err;
    }

    return false;
  },

  subtractQuantityFromProduct: async (productId, amountToSubtract) => {
    try {
      const product = await Product.findOne({
        sku: productId
      }).exec();

      if (product) {
        let newQuantity = product.quantity - amountToSubtract;

        if (newQuantity < 0) {
          newQuantity = 0;
        }
        product.quantity = newQuantity
        product.save();
        return true;
      }
    } catch (err) {
      return err;
    }

    return false;
  },


  createProduct: async (sku, title, description, image, quantity, price, product_details, shipping_details, categories) => {

    const product = new Product({
      sku, title, description, image, quantity, price, product_details, shipping_details, categories
    });

    try {
      const createdProduct = await product.save();

      if (createdProduct) {
        const productObj = createdProduct.toObject();

        delete productObj._id;
        delete productObj.__v;

        return createdProduct.toObject();
      }
    } catch (err) {
      console.log(err)
      return err;
    }
  },

  getProductByProductId: async (productId) => {
    try {
      const product = await Product.findOne({
        sku: productId
      }).exec();

      if (product) {
        return product.toObject();
      }
    } catch (err) {
      return err;
    }
  },

  deleteProductWithId: async (productId, deleteFromElasticSearch=true) => {
    try {
      const product = await Product.findOne({
        sku: productId
      }).exec();

      if (product) {
        const removedProduct = await product.remove();

        if (deleteFromElasticSearch) {
          try {
            await elasticSearch.DeleteDocument(product.sku);
          } catch (err) {
            console.log('Elastic Search Error: ', err)
          }
        }

        return true;
      }

      return false;
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

  getSuggestedProducts: async () => {
    try {
      const result = [];

      const products = await Product.find({ "quantity": { $ne: 0 }}).exec();
      // const products = await Product.find({ "quantity": { $ne: 0 }}, ['title', 'price', 'image']).exec();

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

  getAllProductsInCategory: async (categoryQuery, strictMode=false) => {
    try {
      const result = [];
      let filter;

      filter = categoryQuery;

      if (!strictMode) {
        filter = new RegExp(`^${categoryQuery}`);
      }

      const products = await Product.find({categories: filter}).exec();

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
