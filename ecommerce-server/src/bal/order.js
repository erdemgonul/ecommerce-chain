const moment = require('moment');

const productBAL = require('./product');
const userLog = require('./userlog');

const orderDAL = require('../dal/order');

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

    const expireAt = moment.utc().add(5, 'minutes').toDate();
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
