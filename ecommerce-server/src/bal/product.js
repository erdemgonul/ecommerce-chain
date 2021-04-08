const productDAL = require('../dal/product');

const self = {
  async createProduct(id, image, title, price, description, size, color) {
    // check if product with id exists or not
    const productIdExists = await productDAL.isProductIdExists(id);

    if (productIdExists) {
      return { error: 'Product with given product id already exists !' };
    }

    return await productDAL.createProduct(id, image, title, price, description, size, color);
  },

  async getAllProducts() {
    // check if product with id exists or not
    const allProducts = await productDAL.getAllProducts();
    return allProducts;
  }
};

module.exports = self;
