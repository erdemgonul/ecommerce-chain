const productBAL = require('../bal/product');
const orderDAL = require('../dal/order');

const self = {
    async createOrder(createdBy, shippingAddress, billingAddress, products) {
        let orderTotal = 0;

        for (let product of products) {
            const productId = product.sku
            const productQuantity = product.quantity

            const productData = await productBAL.getProductByProductId(productId)

            if (!productData) {
                return {error: `Product with sku: ${productId} not found!`};
            }

            if (productData.quantity - productQuantity < 0) {
                return {error: `Not enough stock for ${productId}!`};
            }

            product.unitPrice = productData.price;
            orderTotal += productQuantity *  productData.price;

            const subtractSuccess = await productBAL.subtractQuantityFromProduct(product.sku, productQuantity);

            if (!subtractSuccess) {
                return {error: `Reducing quantity failed for ${productId}!`};
            }
        }

        const createdOrder = await orderDAL.createOrder(createdBy, shippingAddress, billingAddress, products, orderTotal);

        if (createdOrder && createdOrder._id) {
            // todo: update product's quantity on elastic search, elastic.co/guide/en/elasticsearch/reference/current/docs-update.html
            return createdOrder;
        } else {
            return {error: `Order creation failed!`};
        }
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
        return {error: 'Product not found !'};
    },
};

module.exports = self;
