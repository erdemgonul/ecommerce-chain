const express = require('express');
const categoryBAL = require('../bal/category');

const router = express.Router();

router.post('/create', async (req, res) => {
  const result = await categoryBAL.createCategory(req.body.title, req.body.parent, req.body.path);

  if (result && !result.error) {
    res.send({ success: true });
  } else {
    res.send(result);
  }
});

router.post('/get/all', async (req, res) => {
  const categories = await categoryBAL.getAllCategories();

  if (categories && !categories.error) {
    res.send({ data: {categories}, success: true });
  } else {
    res.send(categories);
  }
});

router.post('/get/details', async (req, res) => {
  const categories = await categoryBAL.getCategoryByPath(req.body.path);

  if (categories && !categories.error) {
    res.send({ data: categories, success: true });
  } else {
    res.send(categories);
  }
});

router.post('/get/subcategories', async (req, res) => {
  const categories = await categoryBAL.getSubCategoriesOfCategory(req.body.category);

  if (categories && !categories.error) {
    res.send({ data: {categories}, success: true });
  } else {
    res.send(categories);
  }
});

module.exports = router;
