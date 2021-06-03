const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config();

const paymentBAL = require('./bal/payment');
const firebaseAdmin = require('./common/firebase');
const db = require('./models/index');
const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

paymentBAL.loadContract().then(function (res) {
  // paymentBAL.fund('0xd7d3f3CDd2EfCAbA60726D05A1c93EB09b2727Af',2000);
  // 0xd7442ddf318908bb9dc618af137e370ca99e91e9a46fc3f98ac9e63c2ae40ba4 server private
  // 0x849e90989379ba534a7354f4c80200194be927e1c748c135532c987634d48431 user private
  // 0x4B8892f667D4Db42ed9C21EDFC3f98Ed5A48C13d user public
  // paymentBAL.transfer("0x849e90989379ba534a7354f4c80200194be927e1c748c135532c987634d48431", process.env.SERVER_TOKEN_PUBLIC_KEY, 1000);
});

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

app.use(middlewares.validateRequest);
app.use(middlewares.verifyToken);
app.use(middlewares.isProductManager);
app.use(middlewares.isSalesManager);

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
