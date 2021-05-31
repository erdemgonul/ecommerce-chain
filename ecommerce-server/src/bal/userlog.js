const userLogDAL = require('../dal/userlog');

const self = {
  LogType : {
     VIEW_PRODUCT: 'VIEW_PRODUCT',
     VIEW_CATEGORY: 'VIEW_CATEGORY',
     PLACE_ORDER: 'PLACE_ORDER',
     PRODUCT_COMMENT: 'PRODUCT_COMMENT'
  },

  async createUserLog(userId, logType, logData) {
    const createdUserLog = await userLogDAL.createUserLog(userId, logType, logData);

    if (createdUserLog) {
        return createdUserLog;
    }

    return { error: 'Log creation failed !' };
  },

  async getUserLogsByUserId(userId, logType) {
    const fetchedUserLogs = await userLogDAL.getUserLogsByUserId(userId, logType);

    if (fetchedUserLogs) {
      return fetchedUserLogs;
    }

    return { error: 'Log not found !' };
  }
};

module.exports = self;
