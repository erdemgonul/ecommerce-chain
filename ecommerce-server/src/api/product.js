const express = require('express');
const productBAL = require('../bal/product');
const orderBAL = require('../bal/order');
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
  const products = await productBAL.getSuggestedProducts(req.userId);

  if (products && !products.error) {
    res.send({ data: { products }, success: true });
  } else {
    res.send(products);
  }
});

router.post('/get/category', async (req, res) => {
  const products = await productBAL.getAllProductsInCategory(req.body.path, req.body.strictMode, false, req.userId, true);

  if (products && !products.error) {
    res.send({ data: { products }, success: true });
  } else {
    res.send(products);
  }
});

router.post('/get', async (req, res) => {
  const products = await productBAL.getProductByProductId(req.body.sku, req.userId,  true);

  if (products && !products.error) {
    res.send({ data: products, success: true });
  } else {
    res.send(products);
  }
});

router.post('/edit', async (req, res) => {
  const product = await productBAL.updateProductDetails(req.body);

  if (product && !product.error) {
    const cancelOrderResponse = await orderBAL._cancelNonPaidOrders(req.body.sku);

    if (cancelOrderResponse.error) {
      return {error: 'Order cancellation failed !'};
    }

    res.send({ data: product, success: true });
  } else {
    res.send(product);
  }
});

router.post('/delete', async (req, res) => {
  const products = await productBAL.deleteProductWithId(req.body.sku, req.body.deleteFromElasticSearch);

  if (products && !products.error) {
    const cancelOrderResponse = await orderBAL._cancelNonPaidOrders(req.body.sku);

    if (cancelOrderResponse && cancelOrderResponse.error) {
      return {error: 'Order cancellation failed !'};
    }

    res.send({ success: true });
  } else {
    res.send(products);
  }
});

router.post('/search', async (req, res) => {
  const products = await productBAL.searchProduct(req.body.query, req.body.filter, req.body.fullData);

  if (products && !products.error) {
    res.send({ data: { products }, success: true });
  } else {
    res.send(products);
  }
});

router.post('/get/category/filter', async (req, res) => {
  const products = await productBAL.filterProductsInCategory(req.body.category, req.body.filter, req.body.fullData);

  if (products && !products.error) {
    res.send({ data: { products }, success: true });
  } else {
    res.send(products);
  }
});

module.exports = router;
