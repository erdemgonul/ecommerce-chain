const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userDAL = require('../dal/user');
const util = require('../util/index');

const AWSSESWrapper = require('../common/ses');

const self = {
  async signUp(userName, firstName, lastName, email, password) {
    const userExists = await userDAL.isUsernameExists(userName);

    if (userExists) {
      return { error: 'User already exists !' };
    }

    const emailExists = await userDAL.isEmailExists(email);

    if (emailExists) {
      return { error: 'Email already exists !' };
    }

    const createdUser = await userDAL.createUser(userName, firstName, lastName, email, password);

    if (createdUser && createdUser._id) {
      AWSSESWrapper.SendEmailWithTemplate(createdUser.email, 'USER_REGISTERED', {"recipient_name": createdUser.firstName});

      return createdUser;
    } else {
      return {error: `User creation failed!`};
    }
  },

  async verifyTwoFactorCode(username, code) {
    const user = await userDAL.getUserByUsername(username);

    if (user.lastTwoFactorCode && code === user.lastTwoFactorCode) {
      let lastTime = user.lastLogoutOn;

      if (!user.lastLogoutOn) {
        lastTime = user.createdOn;
      }

      const hashedString = util.authHashString(lastTime, user.password);

      let userRole = user.role

      if (!user.role) {
        userRole = 'customer'
      }

      const token = jwt.sign({ id: user._id, hash: hashedString, role: userRole }, process.env.JWT_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY_TIME || '1h'
      });

      const result = await userDAL.updateUserDetails(user._id, {lastTwoFactorCode: null});

      if (!result) {
        return { error: 'Unable to clear Two Factor Code !' };
      }

      return token;
    }

    return { error: 'Invalid code !' };
  },

  async signIn(username, password) {
    const user = await userDAL.getUserByUsername(username);

    if (user) {
      const passwordIsValid = bcrypt.compareSync(
        password,
        user.password
      );

      if (!passwordIsValid) {
        return { error: 'Invalid Password' };
      }

      if (!user._id) {
        return { error: 'Invalid User' };
      }

      if (user.twoFactorAuthenticationEnabled) {
        const twoFactorCode = Math.floor(100000 + Math.random() * 900000);
        const result = await userDAL.updateUserDetails(user._id, {lastTwoFactorCode: twoFactorCode});

        if (!result) {
          return { error: 'Unable to save Two Factor Code !' };
        }

        AWSSESWrapper.SendEmailWithTemplate(user, 'TWO_FACTOR_CODE_REQUESTED', {"recipient_name": user.firstName, "two_factor_code": twoFactorCode});

        return { state: 'TWO_FACTOR_AUTH' };
      }

      let lastTime = user.lastLogoutOn;

      if (!user.lastLogoutOn) {
        lastTime = user.createdOn;
      }

      const hashedString = util.authHashString(lastTime, user.password);

      let userRole = user.role

      if (!user.role) {
        userRole = 'customer'
      }

      const token = jwt.sign({ id: user._id, hash: hashedString, role: userRole }, process.env.JWT_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY_TIME || '1h'
      });

      return token;
    }
    return { error: 'User does not exists !' };
  },

  async logout(userId) {
    return await userDAL.updateLastLogoutTime(userId);
  }
};

module.exports = self;
