const moment = require('moment');

const productBAL = require('./product');
const userLog = require('./userlog');
const util = require('../util')
const paymentBAL = require('./payment')
const orderDAL = require('../dal/order');
const userBAL = require('./user')
const AWSLambdaFunctions = require('../common/lambda');
const AWSSESWrapper = require('../common/ses');
const ElasticSearchWrapper = require('../common/elasticsearchwrapper');

const elasticSearch = new ElasticSearchWrapper(process.env.ELASTIC_SEARCH_REGION, process.env.ELASTIC_SEARCH_DOMAIN, process.env.ELASTIC_SEARCH_PRODUCT_INDEX, process.env.ELASTIC_SEARCH_PRODUCT_INDEXTYPE, true, process.env.ELASTIC_SEARCH_USERNAME, process.env.ELASTIC_SEARCH_PASSWORD);

const self = {
  async createOrder(user, shippingAddress, billingAddress, products, shouldLog) {
    let orderTotal = 0;

    for (const product of products) {
      const productId = product.sku;
      const productQuantity = product.quantity;

      const productData = await productBAL.getProductByProductId(productId);

      if (!productData) {
        return { error: `Product with sku: ${productId} not found!` };
      }

      if (productData.quantity - productQuantity < 0) {
        return { error: `Not enough stock for ${productId}!` };
      }

      product.unitPrice = productData.price;
      product.categories = productData.categories;
      product.sellerId = productData.sellerId;
      orderTotal += productQuantity * productData.price;

      const subtractSuccess = await productBAL.subtractQuantityFromProduct(product.sku, productQuantity);

      if (!subtractSuccess) {
        return { error: `Reducing quantity failed for ${productId}!` };
      }

      try {
        await productBAL.updateProductOnElasticSearch(productData);
      } catch (err) {
        return { error: 'Elastic search error !' };
      }
    }

    const expireAt = moment.utc().add(2, 'days').toDate();
    const createdOrder = await orderDAL.createOrder(user.id, shippingAddress, billingAddress, products, orderTotal, expireAt);

    if (createdOrder && createdOrder._id) {
      AWSSESWrapper.SendEmailWithTemplate(user, 'ORDER_CREATED', { recipient_name: user.firstName });

      const scheduledEmailResponse = await AWSLambdaFunctions.invokeMailScheduler({
        to: [user.email],
        templateName: 'ORDER_PAYMENT_REMINDER',
        templateData: { recipient_name: user.firstName }
      }, moment.utc().add(2, 'minutes').toISOString());

      // Add to logs of user
      if (shouldLog) {
        const productCategories = [];

        for (let product of products) {
          productCategories.push(...product.categories)
        }

        const productIds = products.map(product => product.sku);

        const orderPlaceLog = {
          productIds: productIds,
          productCategories: Array.from(new Set(productCategories))
        }

        await userLog.createUserLog(user.id, userLog.LogType.PLACE_ORDER, orderPlaceLog)
      }

      return createdOrder;
    }
    return { error: 'Order creation failed!' };
  },

  async _payOrder(currentUser, order) {
    const paymentMap = new Map();

    for (let product of order.products) {
      const sellerId = product.sellerId;

      if (paymentMap.has(sellerId)) {
        const newValue = paymentMap.get(sellerId) + product.unitPrice;
        paymentMap.set(sellerId, newValue);
      } else {
        paymentMap.set(sellerId, product.unitPrice)
      }
    }

    const transferArray = [];
    let transferCount = 0;

    const currentUserDecodedPrivateKey = util.aesDecrypt(currentUser.cryptoAccountPrivateKey);

    for (let [sellerId, amountToPay] of paymentMap) {
        const sellerUser = await userBAL.getUserDetailsById(sellerId, true);

        transferArray.push(paymentBAL.transfer(currentUserDecodedPrivateKey, sellerUser.cryptoAccountPublicKey, amountToPay).catch(err => {
          throw { error: 'Payment error ! Please make sure you have enough balance to pay !' };
        }));
        transferCount++;
    }

    const transferResults = await Promise.all(transferArray);

    if (transferResults.length === transferCount) {
      return transferResults;
    }

    return { error: 'Payment error !' };
  },

  async _updateOrderToCompleted(orderId) {
    const detailsToChange = {
      status: 'ORDER_COMPLETED',
      paymentDate: moment.utc().toDate(),
      expireAt: moment.utc().add(1, 'year').toDate()
    }

    const updateResult = await orderDAL.updateOrderDetails(orderId, detailsToChange);

    console.log(updateResult)

    if (!updateResult) {
      throw { error: 'Order update failed!' };
    }
  },

  async finishPayment(currentUser, orderId) {
    const order = await orderDAL.getOrderByOrderId(orderId);

    if (!order) {
      return { error: 'Order does not exists!' };
    }

    if (order.status !== 'ORDER_PLACED') {
      return { error: 'You cant pay for already paid orders !' };
    }

    if (order.createdBy.toString() !== currentUser.id.toString()) {
      console.log(order.createdBy, currentUser.id)

      return { error: 'You cant pay for other user\'s orders' };
    }

    let paymentResult;

    try {
      paymentResult = await self._payOrder(currentUser, order);
    } catch (err) {
      return err;
    }

    // Update order state and postpone expiration by a year

    try {
      await self._updateOrderToCompleted(order)
    } catch (err) {
      return err;
    }

    return paymentResult;

    // Remove scheduled order remainder mail

    // Call invoiceBAL.generateInvoice <- set a record on db and generate pdf

    // Return generated pdf or invoice
  },

  async deleteOrderWithId(orderId) {
    return await orderDAL.deleteOrderWithId(orderId);
  },

  async getOrdersOfCurrentUser(userId) {
    return await orderDAL.getOrdersOfCurrentUser(userId);
  },

  async getOrderByOrderId(orderId) {
    const orderDetails = await orderDAL.getOrderByOrderId(orderId);

    if (orderDetails) {
      orderDetails.id = orderDetails._id;
      delete orderDetails._id;
      delete orderDetails.__v;

      return orderDetails;
    }
    return { error: 'Product not found !' };
  },
};

module.exports = self;
