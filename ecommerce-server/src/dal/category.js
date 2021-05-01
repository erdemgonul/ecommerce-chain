const db = require('../models');

const Category = db.category;

const self = {
  isCategoryExists: async (categoryPath) => {
    try {
      const category = await Category.findOne({
        path: categoryPath
      }).exec();

      if (category) {
        return true;
      }
    } catch (err) {
      return err;
    }

    return false;
  },

  createCategory: async (title, parent, path) => {
    const category = new Category({
      title, parent, path
    });

    try {
      const createdCategory = await category.save();

      if (createdCategory) {
        return category.toObject();
      }
    } catch (err) {
      return err;
    }
  },

  getAllCategories: async () => {
    try {
      const result = [];

      const categories = await Category.find({
      }).exec();

      for (let category of categories) {
        const categoryObj = category.toObject();
        delete categoryObj._id;
        delete categoryObj.__v;
        result.push(categoryObj)
      }

      return result;
    } catch (err) {
      return err;
    }
  },

  getCategoryByPath: async (path) => {
    try {
      const category = await Category.findOne({
        path: path
      }).exec();

      if (category) {
        return category.toObject();
      }
    } catch (err) {
      return err;
    }
  },

  getSubCategoriesOfCategory: async (categoryQuery) => {
    try {
      const result = [];

      const regex = new RegExp(`^${categoryQuery}`);

      const categories = await Category.find({parent: regex}, {_id: 0}).exec();

      for (let category of categories) {
        const categoryObj = category.toObject();
        delete categoryObj._id;
        delete categoryObj.__v;
        result.push(categoryObj)
      }

      return result;
    } catch (err) {
      return err;
    }
  },
};

module.exports = self;
