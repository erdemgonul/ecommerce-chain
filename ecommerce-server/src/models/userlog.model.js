const mongoose = require('mongoose');

const UserLog = mongoose.model(
  'UserLog',
  new mongoose.Schema({
    userId: String,
    logDate: String,
    logType: String,
    logData: Object,
    expireAt: Date
  })
);

module.exports = UserLog;
