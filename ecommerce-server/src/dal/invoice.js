const moment = require('moment');
const db = require('../models');

const Invoice = db.invoice;

const self = {
  createInvoice: async (orderId, pdfUrl, paymentInfo, products, createdBy, shippingAddress, billingAddress) => {
    const createdOn = moment.utc().toISOString();

    const invoice = new Invoice({
      orderId, pdfUrl, paymentInfo, products, createdBy, shippingAddress, billingAddress, createdOn
    });

    try {
      const createdInvoice = await invoice.save();

      if (invoice) {
        const invoiceObj = createdInvoice.toObject();

        delete invoiceObj.__v;

        return invoiceObj;
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  },

  getInvoicesOfCurrentUser: async (userId) => {
    try {
      const result = [];

      const invoices = await Invoice.find({
        createdBy: userId
      }).exec();

      for (const invoice of invoices) {
        const invoiceObj = invoice.toObject();
        invoiceObj.id = invoiceObj._id;

        delete invoiceObj._id;
        delete invoiceObj.__v;
        result.push(invoiceObj);
      }

      return result;
    } catch (err) {
      return err;
    }
  },

  updateInvoiceDetails: async (invoiceId, detailsToChange) => {
    const updatedInvoice = await Invoice.findOneAndUpdate({
      _id: invoiceId
    }, detailsToChange);

    if (updatedInvoice) {
      return true;
    }
  },

  getInvoiceByInvoiceId: async (invoiceId) => {
    try {
      const invoice = await Invoice.findOne({
        _id: invoiceId
      }).exec();

      if (invoice) {
        return invoice.toObject();
      }
    } catch (err) {
      return err;
    }
  },
};

module.exports = self;
