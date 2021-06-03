const moment = require('moment');
const db = require('../models');

const Order = db.order;

const self = {
  createOrder: async (createdBy, shippingAddress, billingAddress, products, orderTotal, expireAt) => {
    const createdOn = moment.utc().toISOString();

    const status = 'ORDER_PLACED';

    const order = new Order({
      shippingAddress, billingAddress, products, orderTotal, createdOn, createdBy, status, expireAt
    });

    try {
      const createdOrder = await order.save();

      if (createdOrder) {
        const orderObj = createdOrder.toObject();

        delete orderObj.__v;

        return createdOrder.toObject();
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  },

  getOrdersOfCurrentUser: async (userId) => {
    try {
      const result = [];

      const orders = await Order.find({
        createdBy: userId
      }).sort({createdOn: -1}).exec();

      for (const order of orders) {
        const orderObj = order.toObject();
        orderObj.id = orderObj._id;

        delete orderObj._id;
        delete orderObj.__v;
        result.push(orderObj);
      }

      return result;
    } catch (err) {
      return err;
    }
  },

  updateOrderDetails: async (orderId, detailsToChange) => {
    const updatedOrder = await Order.findOneAndUpdate({
      _id: orderId
    }, detailsToChange);

    if (updatedOrder) {
      return true;
    }
  },

  getOrderByOrderId: async (orderId) => {
    try {
      const order = await Order.findOne({
        _id: orderId
      }).exec();

      if (order) {
        return order.toObject();
      }
    } catch (err) {
      return err;
    }
  },

  deleteOrderWithId: async (orderId) => {
    try {
      const order = await Order.findOne({
        _id: orderId
      }).exec();

      if (order) {
        const removedProduct = await order.remove();

        return true;
      }

      return false;
    } catch (err) {
      return err;
    }
  },
};

module.exports = self;
