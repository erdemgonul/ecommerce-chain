const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose
  .connect(`mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/${process.env.DATABASE_DB}??retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    /* eslint-disable no-console */
    console.log('Successfully connected to MongoDB.');
    setupIndexes();
    /* eslint-disable no-console */
  })
  .catch((err) => {
    /* eslint-disable no-console */
    console.error('MongoDB Connection error', err);
    /* eslint-disable no-console */
    process.exit();
  });

const db = {};

// db.mongoose = mongoose;

db.user = require('./user.model');

db.category = require('./category.model');
db.product = require('./product.model');
db.order = require('./order.model');
db.userlog = require('./userlog.model');
db.comment = require('./comment.model');
db.invoice = require('./invoice.model');
db.campaign = require('./campaign.model');

function setupIndexes() {
  mongoose.connection.collections.categories.ensureIndex({ path: 1, parent: 1 }, { unique: true }, (err, res) => {
    console.log(`${res} index set.`);
  });

  mongoose.connection.collections.categories.ensureIndex({ path: 1 }, { unique: true }, (err, res) => {
    console.log(`${res} index set.`);
  });

  mongoose.connection.collections.users.ensureIndex({ username: 1 }, { unique: true }, (err, res) => {
    console.log(`${res} index set.`);
  });

  mongoose.connection.collections.users.ensureIndex({ email: 1 }, { unique: true }, (err, res) => {
    console.log(`${res} index set.`);
  });

  mongoose.connection.collections.products.ensureIndex({ categories: 1 }, { unique: false }, (err, res) => {
    console.log(`${res} index set.`);
  });

  mongoose.connection.collections.orders.ensureIndex({ expireAt: 1 }, { expireAfterSeconds: 0 }, (err, res) => {
    console.log(`${res} index set.`);
  });

  mongoose.connection.collections.userlogs.ensureIndex({ expireAt: 1 }, { expireAfterSeconds: 0 }, (err, res) => {
    console.log(`${res} index set.`);
  });

  mongoose.connection.collections.userlogs.ensureIndex({ userId: 1, logDate: 1 }, { unique: true }, (err, res) => {
    console.log(`${res} index set.`);
  });

  mongoose.connection.collections.invoices.ensureIndex({ orderId: 1 }, { unique: true }, (err, res) => {
    console.log(`${res} index set.`);
  });
}

module.exports = db;
