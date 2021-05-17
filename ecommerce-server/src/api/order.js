const express = require('express');
const orderBAL = require('../bal/order');

const router = express.Router();

router.post('/create', async (req, res) => {
  const result = await orderBAL.createOrder(req.user, req.body.shippingAddress, req.body.billingAddress, req.body.products);
  if (result && !result.error) {
    res.send({ success: true, orderId: result._id });
  } else {
    res.send(result);
  }
});

router.post('/get/all', async (req, res) => {
  const orders = await orderBAL.getOrdersOfCurrentUser(req.userId);

  if (orders && !orders.error) {
    res.send({ data: orders, success: true });
  } else {
    res.send(orders);
  }
});

router.post('/get', async (req, res) => {
  const orders = await orderBAL.getOrderByOrderId(req.body.orderId);

  if (orders && !orders.error) {
    res.send({ data: orders, success: true });
  } else {
    res.send(orders);
  }
});

router.post('/delete', async (req, res) => {
  const orders = await orderBAL.deleteOrderWithId(req.body.orderId);

  if (orders && !orders.error) {
    res.send({ success: true });
  } else {
    res.send(orders);
  }
});

module.exports = router;
