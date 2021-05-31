const db = require('../models');

const UserLog = db.userlog;
const moment = require('moment');

const self = {
  createUserLog: async (userId, logType, logData) => {
    const logDate = moment.utc().toISOString();
    const expireAt = moment.utc().add(5, 'days').toDate();

    const userLog = new UserLog({
      userId, logDate, logType, logData, expireAt
    });

    try {
      const createdUserLog = await userLog.save();

      if (createdUserLog) {
        return userLog.toObject();
      }
    } catch (err) {
      return err;
    }
  },

  getUserLogsByUserId: async (userId, logType) => {
    try {
      const logs = [];

      const filter = {
        userId
      }

      if (logType)
        filter.logType = logType;

      const userLogs = await UserLog.find(filter).exec();

      for (let log of userLogs) {
          logs.push(log.toObject())
      }

      return logs
    } catch (err) {
      return err;
    }
  },
};

module.exports = self;
