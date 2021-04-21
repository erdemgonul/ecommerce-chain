const express = require('express');
const productBAL = require('../bal/product');

const router = express.Router();

router.post('/create', async (req, res) => {
  const result = await productBAL.createProduct(req.body.sku, req.body.title, req.body.description, req.body.image, req.body.quantity, req.body.price, req.body.product_details, req.body.shipping_details, req.body.categories);
  if (result && !result.error) {
    res.send({ success: true });
  } else {
    res.send(result);
  }
});

router.post('/suggestedproducts', async (req, res) => {
  const products = await productBAL.getAllProducts();

  if (products && !products.error) {
    res.send({ data: {products}, success: true });
  } else {
    res.send(products);
  }
});

router.post('/get/category', async (req, res) => {
  const products = await productBAL.getAllProductsInCategory(req.body.path, req.body.strictMode);

  if (products && !products.error) {
    res.send({ data: {products}, success: true });
  } else {
    res.send(products);
  }
});

router.post('/get', async (req, res) => {
  const products = await productBAL.getProductByProductId(req.body.sku);

  if (products && !products.error) {
    res.send({ data: products, success: true });
  } else {
    res.send(products);
  }
});

router.post('/delete', async (req, res) => {
  const products = await productBAL.deleteProductWithId(req.body.sku, req.body.deleteFromElasticSearch);

  if (products && !products.error) {
    res.send({ success: true });
  } else {
    res.send(products);
  }
});

router.post('/search', async (req, res) => {
  const products = await productBAL.searchProduct(req.body.query, req.body.filter, req.body.fullData);

  if (products && !products.error) {
    res.send({ data: {products}, success: true });
  } else {
    res.send(products);
  }
});

router.post('/get/category/filter', async (req, res) => {
  const products = await productBAL.filterProductsInCategory(req.body.category, req.body.filter, req.body.fullData);

  if (products && !products.error) {
    res.send({ data: {products}, success: true });
  } else {
    res.send(products);
  }
});

module.exports = router;
