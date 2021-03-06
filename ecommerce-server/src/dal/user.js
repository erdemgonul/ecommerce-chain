const bcrypt = require('bcryptjs');
const db = require('../models');
const util = require('../util')
const User = db.user;
const moment = require('moment');

const self = {
  isUsernameExists: async (username) => {
    try {
      const user = await User.findOne({
        username
      }).exec();

      if (user) {
        return true;
      }
    } catch (err) {
      return err;
    }

    return false;
  },

  isEmailExists: async (email) => {
    try {
      const user = await User.findOne({
        email
      }).exec();

      if (user) {
        return true;
      }
    } catch (err) {
      return err;
    }

    return false;
  },

  createUser: async (userName, firstName, lastName, email, password, cryptoAccountPrivateKey, cryptoAccountPublicKey, notificationToken) => {
    const timestamp = moment.utc().toISOString();

    const user = new User({
      username: userName,
      email,
      firstName,
      lastName,
      password: bcrypt.hashSync(password, 8),
      cryptoAccountPrivateKey: util.aesEncrypt(cryptoAccountPrivateKey),
      cryptoAccountPublicKey: cryptoAccountPublicKey,
      createdOn: timestamp,
      notificationTokens: [notificationToken]
    });

    try {
      const createdUser = await user.save();

      if (createdUser) {
        return createdUser.toObject();
      }
    } catch (err) {
      return err;
    }
  },

  getUserByUsername: async (username) => {
    try {
      const user = await User.findOne({
        username
      }).exec();

      if (user) {
        return user.toObject();
      }
    } catch (err) {
      return err;
    }
  },

  getAllNotificationTokens: async () => {
    try {
      const result = [];

      const allTokens = await User.find({ notificationTokens: { $ne: null } }, ['notificationTokens']).exec();

      for (const token of allTokens) {
        if (token.notificationTokens && token.notificationTokens.length)
          result.push(...token.notificationTokens);
      }

      return result;
    } catch (err) {
      return err;
    }
  },

  getUserByUserId: async (userId) => {
    try {
      const user = await User.findOne({
        _id: userId
      }).exec();

      if (user) {
        return user.toObject();
      }
    } catch (err) {
      return err;
    }
  },

  updateUserDetails: async (userId, detailsToChange) => {
    try {
      const updatedUser = await User.findOneAndUpdate({
        _id: userId
      }, detailsToChange);

      if (updatedUser) {
        console.log(updatedUser);
        return true;
      }
    } catch (err) {
      return err;
    }
  },

  updateLastLogoutTime: async (userId) => {
    try {
      const updatedUser = await User.findOneAndUpdate({
        _id: userId
      }, { lastLogoutOn: moment.utc().toISOString() });

      if (updatedUser) {
        return true;
      }
    } catch (err) {
      return err;
    }
  }
};

module.exports = self;
