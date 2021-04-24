const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose
    .connect(`mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/${process.env.DATABASE_DB}??retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        /* eslint-disable no-console */
        console.log('Successfully connect to MongoDB.');
        setupIndexes();
        /* eslint-disable no-console */
    })
    .catch((err) => {
        /* eslint-disable no-console */
        console.error('Connection error', err);
        /* eslint-disable no-console */
        process.exit();
    });

const db = {};

db.mongoose = mongoose;

db.user = require('./user.model');

db.category = require('./category.model');
//db.category.ensureIndex({parent: 1, path: 1})
//db.category.ensureIndex({path: 1})
db.product = require('./product.model');

function setupIndexes() {
    mongoose.connection.collections['categories'].ensureIndex({ "path": 1, "parent": 1 }, { "unique": true }, function (err, res) {
        console.log(res, err)
    });

    mongoose.connection.collections['categories'].ensureIndex({ "path": 1 }, { "unique": true }, function (err, res) {
        console.log(res, err)
    });

    mongoose.connection.collections['products'].ensureIndex({ "categories": 1 }, { "unique": false }, function (err, res) {
        console.log(res, err)
    });
}

module.exports = db;
