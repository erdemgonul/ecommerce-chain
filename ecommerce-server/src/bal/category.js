const categoryDAL = require('../dal/category');

const self = {
  async createCategory(title, parent, path) {
    // check if product with id exists or not
    const categoryExists = await categoryDAL.isCategoryExists(path);

    if (categoryExists) {
      return { error: 'Category with given path already exists !' };
    }

    return await categoryDAL.createCategory(title, parent, path);
  },

  async getAllCategories() {
    // check if product with id exists or not
    const allCategories = await categoryDAL.getAllCategories();
    return allCategories;
  },

  async getCategoryByPath(categoryPath, fullDetails) {
    // check if product with id exists or not
    const categoryDetails = await categoryDAL.getCategoryByPath(categoryPath);

    if (categoryDetails) {
      if (fullDetails) {
        return categoryDetails;
      }

      delete categoryDetails._id;
      delete categoryDetails.__v;

      return categoryDetails;
    }

    return { error: 'Category not found !' };
  },

  async isCategoryExists(categoryPath) {
    // check if product with id exists or not
    return await categoryDAL.isCategoryExists(categoryPath);
  },

  async getSubCategoriesOfCategory(category) {
    // check if product with id exists or not
    const subCategories = await categoryDAL.getSubCategoriesOfCategory(category);
    return subCategories;
  }
};

module.exports = self;
