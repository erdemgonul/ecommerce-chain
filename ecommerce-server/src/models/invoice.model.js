const mongoose = require('mongoose');

const Invoice = mongoose.model(
    'Invoice',
    new mongoose.Schema({
        createdOn: String,
        createdBy: String,
        shippingAddress: String,
        billingAddress: String,
        products: Array,
        paymentInfo: Array,
        pdfUrl: String,
        orderId: String
    })
);

module.exports = Invoice;
