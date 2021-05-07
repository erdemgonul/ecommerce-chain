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

  async getCategoryFilters(category) {
    const allDetails = await categoryDAL.getCategoryFilters(category);

    const allKeys = {};

    for (let details of allDetails) {
      let keysOfObj = Object.keys(details);

      for (let key of keysOfObj) {
        let valueOfKey = details[key];

        if (Object.keys(allKeys).includes(key)) {
          if (!allKeys[key].includes(valueOfKey)) {
            allKeys[key] = [...allKeys[key], valueOfKey];
          }
        } else {
          allKeys[key] = [valueOfKey];
        }
      }
    }

    return allKeys;
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
