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

  updateProductDetails: async (productId, detailsToChange) => {
    const updatedProduct = await Product.findOneAndUpdate({
      sku: productId
    }, detailsToChange);

    if (updatedProduct && updatedProduct._id) {
      return updatedProduct.toObject();
    }
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
        product.quantity = newQuantity;
        product.save();
        return true;
      }
    } catch (err) {
      return err;
    }

    return false;
  },

  createProduct: async (sku, title, description, image, quantity, price, product_details, shipping_details, categories, sellerId) => {
    const product = new Product({
      sku, title, description, image, quantity, price, product_details, shipping_details, categories, sellerId
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
      console.log(err);
      return err;
    }
  },

  getProductByProductId: async (productId, projectionFields) => {
    try {
      const filter = {
        sku: productId
      }

      const product = await Product.findOne(filter, projectionFields).exec();

      if (product) {
        return product.toObject();
      }
    } catch (err) {
      return err;
    }
  },

  deleteProductWithId: async (productId, deleteFromElasticSearch = true) => {
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
            console.log('Elastic Search Error: ', err);
          }
        }

        return true;
      }

      return false;
    } catch (err) {
      return false;
    }
  },

  getAllProducts: async () => {
    try {
      const result = [];

      const products = await Product.find({
      }).exec();

      for (const product of products) {
        const productObj = product.toObject();
        delete productObj._id;
        delete productObj.__v;
        result.push(productObj);
      }

      return result;
    } catch (err) {
      return err;
    }
  },

  getSuggestedProducts: async (count, excludeList, randomOrder) => {
    try {
      const result = [];
      let products;
      let needsConverting = true;

      if (excludeList && count) {
        if (randomOrder) {
          products = await Product.aggregate([
            {$match: {quantity: { $ne: 0 }, sku: { $nin: excludeList }}}, // filter the results
            {$sample: {size: count}} // You want to get 5 docs
          ]).exec();
          needsConverting = false;
        }
        else
          products = await Product.find({quantity: { $ne: 0 }, sku: { $nin: excludeList }}).limit(count).exec();
      }
      else if (count)
        products = await Product.find({ quantity: { $ne: 0 } }).limit(count).exec();
      else
        products = await Product.find({ quantity: { $ne: 0 } }).exec();

      // const products = await Product.find({ "quantity": { $ne: 0 }}, ['title', 'price', 'image']).exec();

      for (const product of products) {
        if (!needsConverting) {
          delete product._id;
          delete product.__v;
          result.push(product);
          continue;
        }
        const productObj = product.toObject();
        delete productObj._id;
        delete productObj.__v;
        result.push(productObj);
      }

      return result;
    } catch (err) {
      return err;
    }
  },

  getAllProductsInCategory: async (categoryQuery, strictMode = false, filterZeroQuantity = false) => {
    try {
      const result = [];

      let categoryFilter;

      categoryFilter = categoryQuery;

      if (!strictMode) {
        categoryFilter = new RegExp(`^${categoryQuery}`);
      }

      const filter = { categories: categoryFilter }

      if (filterZeroQuantity) {
        filter.quantity = { $ne: 0 }
      }

      const products = await Product.find(filter).exec();

      for (const product of products) {
        const productObj = product.toObject();
        delete productObj._id;
        delete productObj.__v;
        result.push(productObj);
      }

      return result;
    } catch (err) {
      return err;
    }
  }
};

module.exports = self;
