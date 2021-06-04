const moment = require('moment');

const productBAL = require('./product');
const userLog = require('./userlog');
const paymentBAL = require('./payment')
const invoiceBAL = require('./invoice')
const orderDAL = require('../dal/order');
const userBAL = require('./user')
const campaignBAL = require('./campaign');
const AWSLambdaFunctions = require('../common/lambda');
const AWSSESWrapper = require('../common/ses');
const ElasticSearchWrapper = require('../common/elasticsearchwrapper');
const notificationBAL = require('./notification');

const elasticSearch = new ElasticSearchWrapper(process.env.ELASTIC_SEARCH_REGION, process.env.ELASTIC_SEARCH_DOMAIN, process.env.ELASTIC_SEARCH_PRODUCT_INDEX, process.env.ELASTIC_SEARCH_PRODUCT_INDEXTYPE, true, process.env.ELASTIC_SEARCH_USERNAME, process.env.ELASTIC_SEARCH_PASSWORD);

const self = {
    async createOrder(user, shippingAddress, billingAddress, products, shouldLog) {
        let orderTotal = 0;

        for (const product of products) {
            const productId = product.sku;
            const productQuantity = product.quantity;

            const productData = await productBAL.getProductByProductId(productId);

            if (!productData) {
                return {error: `Product with sku: ${productId} not found!`};
            }

            if (productData.quantity - productQuantity < 0) {
                return {error: `Not enough stock for ${productId}!`};
            }

            product.unitPrice = productData.price;
            product.categories = productData.categories;
            product.sellerId = productData.sellerId;
            orderTotal += productQuantity * productData.price;

            const subtractSuccess = await productBAL.subtractQuantityFromProduct(product.sku, productQuantity);

            if (!subtractSuccess) {
                return {error: `Reducing quantity failed for ${productId}!`};
            }

            try {
                await productBAL.updateProductOnElasticSearch(productData);
            } catch (err) {
                return {error: 'Elastic search error !'};
            }
        }

        const expireAt = moment.utc().add(2, 'days').toDate();
        const createdOrder = await orderDAL.createOrder(user.id, shippingAddress, billingAddress, products, orderTotal, expireAt);

        if (createdOrder && createdOrder._id) {
            AWSSESWrapper.SendEmailWithTemplate(user, 'ORDER_CREATED', {recipient_name: user.firstName});

            notificationBAL.sendNotification('EcommerceChain - Your order is created !', 'If you do not make a payment, your order will be deleted after 2 days.',  user.notificationTokens)

            const scheduledEmailResponse = await AWSLambdaFunctions.invokeMailScheduler({
                to: [user.email],
                templateName: 'ORDER_PAYMENT_REMINDER',
                templateData: {recipient_name: user.firstName, orderId: createdOrder._id}
            }, moment.utc().add(2, 'minutes').toISOString());

            // Append the cancellation token to order
            await orderDAL.updateOrderDetails(createdOrder._id, {reminderMailCancellationToken: scheduledEmailResponse.executionArn})

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
        return {error: 'Order creation failed!'};
    },

    async _cancelNonPaidOrders(productId) {
        const ordersContainingProduct = await self.getOrdersOfContainingProduct(productId, true);

        if (ordersContainingProduct && ordersContainingProduct.length) {
            for (let order of ordersContainingProduct) {
                const cancelResponse = await self.cancelOrder(order.id);

                if (cancelResponse.error) {
                    return cancelResponse;
                }
            }
        }
    },

    async _payOrder(currentUser, order, campaign) {
        let totalAmountToPay = 0;

        const paymentMap = new Map();

        for (let product of order.products) {
            const sellerId = product.sellerId;
            totalAmountToPay += product.unitPrice;

            if (paymentMap.has(sellerId)) {
                const newValue = paymentMap.get(sellerId) + product.unitPrice;
                paymentMap.set(sellerId, newValue);
            } else {
                paymentMap.set(sellerId, product.unitPrice)
            }
        }

        const balance = await paymentBAL.getBalance(currentUser.cryptoAccountPublicKey);
        let discountAmount = 0;

        if (campaign && campaign.isActive) {
            if (campaign.campaignType === 'FIXED_DISCOUNT') {
                discountAmount = campaign.discountAmount;
            }
        }

        if (discountAmount + balance < totalAmountToPay) {
            return {error: 'Not enough balance to pay your order !'};
        }

        if (discountAmount > 0) {
            // fund user the discount
            console.log('FUNDING THE USER BECAUSE OF CAMPAIGN: ' + discountAmount)
            await paymentBAL.fund(currentUser.cryptoAccountPublicKey, discountAmount);
        }

        const transferArray = [];
        let transferCount = 0;

        const currentUserDecodedPrivateKey = currentUser.cryptoAccountPrivateKey;

        const transactions = []

        for (let [sellerId, amountToPay] of paymentMap) {
            const sellerUser = await userBAL.getUserDetailsById(sellerId, true);

            const transaction = {
                sellerUser: {
                    username: sellerUser.username,
                    email: sellerUser.email,
                    id: sellerUser.id
                },
                amountPaid: amountToPay,
                transactionId: ''
            }

            transferArray.push(paymentBAL.transfer(currentUserDecodedPrivateKey, sellerUser.cryptoAccountPublicKey, amountToPay).then(function (transactionId) {
                transaction.transactionId = transactionId;
                transactions.push(transaction)
            }).catch(err => {
                throw {error: 'Payment error ! Please make sure you have enough balance to pay !'};
            }));
            transferCount++;
        }

        const transferResults = await Promise.all(transferArray);

        if (transferResults.length === transferCount) {
            return transactions;
        }

        return {error: 'Payment error !'};
    },

    async updateOrderDetails(payload) {
        const detailsToChange = payload;
        const orderId = payload.orderId;

        delete detailsToChange.orderId;

        if (detailsToChange && Object.keys(detailsToChange).length === 0 && detailsToChange.constructor === Object) {
            return {error: 'Invalid change request !'};
        }

        const updateResult = await orderDAL.updateOrderDetails(orderId, detailsToChange);

        if (!updateResult) {
            return {error: 'Order update failed!'};
        }

        return updateResult;
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
            throw {error: 'Order update failed!'};
        }
    },

    async finishPayment(currentUser, orderId, campaignId) {
        const order = await orderDAL.getOrderByOrderId(orderId);
        let campaign;

        if (!order) {
            return {error: 'Order does not exists!'};
        }

        if (order.status !== 'ORDER_PLACED') {
            return {error: 'You cant pay for already paid orders !'};
        }

        if (order.createdBy.toString() !== currentUser.id.toString()) {
            return {error: 'You cant pay for other user\'s orders'};
        }

        if (campaignId) {
            let campaignRetrieved = await campaignBAL.getCampaignById(campaignId);
            const validTimeDiff = moment.utc().diff(campaignRetrieved.validUntil, 'second');

            if (!campaignRetrieved.isActive)
                return {error: 'Campaign is no longer active !'};

            if (validTimeDiff >= 0) {
                return {error: 'Campaign is no longer valid !'};
            }

            if (!campaignRetrieved || !campaignRetrieved.id) {
                return {error: 'Campaign not found !'};
            }

            campaign = campaignRetrieved;
        }

        let paymentResult;

        try {
            paymentResult = await self._payOrder(currentUser, order, campaign);
        } catch (err) {
            return err;
        }

        // Update order state and postpone expiration by a year

        try {
            await self._updateOrderToCompleted(order)
        } catch (err) {
            return err;
        }

        // Remove scheduled order remainder mail
        try {
            const cancelResponse = await AWSLambdaFunctions.cancelScheduledMail(order.reminderMailCancellationToken);
            console.log('Mail cancel response:')
            console.log(cancelResponse)
        } catch (err) {
        } // Do nothing, machine might be expired

        // Call invoiceBAL.generateInvoice <- set a record on db and generate pdf. add pdf url to invoice. store pdf on s3 or maybe directly on server ?
        const createdInvoice = await invoiceBAL.createInvoice(currentUser, orderId, paymentResult, order.products, order.shippingAddress, order.billingAddresses)

        // Return generated invoice
        if (createdInvoice && createdInvoice._id) {
            // send mail
            AWSSESWrapper.SendEmailWithTemplate(currentUser, 'ORDER_COMPLETED', {
                recipient_name: currentUser.firstName,
                invoicePDFUrl: createdInvoice.pdfUrl
            });

            notificationBAL.sendNotification('EcommerceChain - Your payment is successful!', 'Your order will be shipped in 1 business day.', user.notificationTokens)

            return createdInvoice;
        }

        return {error: 'Failed to create invoice !'};
    },

    async deleteOrderWithId(orderId) {
        return await orderDAL.deleteOrderWithId(orderId);
    },

    async getOrdersOfCurrentUser(userId) {
        return await orderDAL.getOrdersOfCurrentUser(userId);
    },

    async getOrdersOfContainingProduct(productId, placedOnly) {
        return await orderDAL.getOrdersOfContainingProduct(productId, placedOnly);
    },

    async getOrderByOrderId(orderId) {
        const orderDetails = await orderDAL.getOrderByOrderId(orderId);

        if (orderDetails && orderDetails._id) {
            orderDetails.id = orderDetails._id;
            delete orderDetails._id;
            delete orderDetails.__v;

            return orderDetails;
        }

        return {error: 'Order not found !'};
    },

    async cancelOrder(orderId) {
        const orderDetails = await self.getOrderByOrderId(orderId);

        if (orderDetails.error) {
            return orderDetails;
        }

        if (orderDetails.status === 'ORDER_COMPLETED') {
            // order is already paid, refund the orderTotal to payer from each product owner
            const invoice = await invoiceBAL.getInvoiceByOrderId(orderId);

            if (invoice && invoice.id) {
                const paymentInfoArray = invoice.paymentInfo;

                const refundPromiseArr = []

                const buyerId = invoice.createdBy;
                const buyerUserDetails = await userBAL.getUserDetailsById(buyerId, true);

                for (let payment of paymentInfoArray) {
                  const sellerUserId = payment.sellerUser.id;
                  const sellerUserDetails = await userBAL.getUserDetailsById(sellerUserId, true);
                  const amount = payment.amountPaid;

                  refundPromiseArr.push(paymentBAL.transfer(sellerUserDetails.cryptoAccountPrivateKey, buyerUserDetails.cryptoAccountPublicKey, amount).catch(async err => {
                    // seller does not have enough money in his acount, we will cover up the costs
                    await paymentBAL.fund(buyerUserDetails.cryptoAccountPublicKey, amount);
                  }));
                }

                await Promise.all(refundPromiseArr);
            } else {
                return {error: 'Invoice for order not found !'};
            }
        }

        // change order status to cancelled
        const detailsToChange = {
            status: 'ORDER_CANCELLED',
            expireAt: moment.utc().add(1, 'year').toDate()
        }

        const updateResult = await orderDAL.updateOrderDetails(orderId, detailsToChange);

        if (!updateResult) {
            return {error: 'Order update failed!'};
        }

        return updateResult;
    },
};

module.exports = self;
