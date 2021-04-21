const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require('./user.model');

db.category = require('./category.model');
//db.category.ensureIndex({parent: 1, path: 1})
//db.category.ensureIndex({path: 1})

mongoose.connection.collections['categories'].ensureIndex({ "path": 1, "parent": 1 }, { "unique": true }, function (err, res) {
    console.log(res, err)
});

mongoose.connection.collections['categories'].ensureIndex({ "path": 1 }, { "unique": true }, function (err, res) {
    console.log(res, err)
});

db.product = require('./product.model');

mongoose.connection.collections['products'].ensureIndex({ "categories": 1 }, { "unique": false }, function (err, res) {
    console.log(res, err)
});

module.exports = db;
