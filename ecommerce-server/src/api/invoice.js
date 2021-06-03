const express = require('express');
const invoiceBAL = require('../bal/invoice');

const router = express.Router();

router.post('/get/all', async (req, res) => {
  const invoices = await invoiceBAL.getInvoicesOfCurrentUser(req.userId);

  if (invoices && !invoices.error) {
    res.send({ data: invoices, success: true });
  } else {
    res.send(invoices);
  }
});

router.post('/get/every', async (req, res) => {
  const invoices = await invoiceBAL.getAllInvoices();

  if (invoices && !invoices.error) {
    res.send({ data: invoices, success: true });
  } else {
    res.send(invoices);
  }
});

router.post('/get', async (req, res) => {
  const invoices = await invoiceBAL.getInvoiceByInvoiceId(req.body.invoiceId);

  if (invoices && !invoices.error) {
    res.send({ data: invoices, success: true });
  } else {
    res.send(invoices);
  }
});


module.exports = router;
