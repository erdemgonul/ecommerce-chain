const moment = require('moment');
const util = require('../util')
const invoiceDAL = require('../dal/invoice');
const awsS3 = require('../common/s3')

const self = {
  async createInvoice(createdBy, orderId, paymentInfo, products, shippingAddress, billingAddress) {
    // generate a pdf and store it on s3
    let invoiceFileName = orderId + '.pdf';
    let pdfUrl = process.env.S3_INVOICE_URL + invoiceFileName

    const createdInvoice = await invoiceDAL.createInvoice(orderId, pdfUrl, paymentInfo, products, createdBy.id, shippingAddress, billingAddress);

    if (createdInvoice && createdInvoice._id) {
      const invoiceData = {
        invoiceId: createdInvoice._id,
        orderId,
        createdBy,
        paymentInfo,
        products,
        shippingAddress,
        billingAddress
      }

      console.log(JSON.stringify(invoiceData, null, 2));

      const generatedPDF = util.generateInvoicePDF(invoiceData);

      // Upload to S3
      await awsS3.uploadInvoicePDF(generatedPDF, invoiceFileName);

      return createdInvoice;
    }

    return { error: 'Invoice creation failed!' };
  },

  async getInvoicesOfCurrentUser(userId) {
    return await invoiceDAL.getInvoicesOfCurrentUser(userId);
  },

  async isInvoiceExistForProduct(userId, productId) {
    return await invoiceDAL.isInvoiceExistForProduct(userId, productId);
  },

  async getInvoiceByInvoiceId(invoiceId) {
    const invoiceDetails = await invoiceDAL.getInvoiceByInvoiceId(invoiceId);

    if (invoiceDetails) {
      invoiceDetails.id = invoiceDetails._id;
      delete invoiceDetails._id;
      delete invoiceDetails.__v;

      return invoiceDetails;
    }
    return { error: 'Product not found !' };
  },
};

module.exports = self;
