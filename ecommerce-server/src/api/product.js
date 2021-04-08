const express = require('express');
const productBAL = require('../bal/product');

const router = express.Router();

router.post('/create', async (req, res) => {
  const result = await productBAL.createProduct(req.body.id, req.body.image, req.body.title, req.body.price, req.body.description, req.body.size, req.body.color);
  if (result && !result.error) {
    console.log(result)
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

module.exports = router;
