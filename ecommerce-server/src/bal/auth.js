const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userDAL = require('../dal/user');
const util = require('../util/index');
const web3 = new (require('web3'))("https://data-seed-prebsc-1-s1.binance.org:8545");
const serverpk = "0xd7442ddf318908bb9dc618af137e370ca99e91e9a46fc3f98ac9e63c2ae40ba4";

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
    const account = web3.eth.accounts.create();
    console.log(account.privateKey);
    await web3.eth.sendSignedTransaction((await web3.eth.accounts.privateKeyToAccount(serverpk).signTransaction({
      to: account.address,
      value: web3.utils.toWei("0.1", "ether"),
      gas: 300000,
      gasPrice: web3.eth.getGasPrice()
    })).rawTransaction);

    const createdUser = await userDAL.createUser(userName, firstName, lastName, email, password, account.privateKey);

    if (createdUser && createdUser._id) {
      AWSSESWrapper.SendEmailWithTemplate(createdUser.email, 'USER_REGISTERED', { recipient_name: createdUser.firstName });

      return createdUser;
    }
    return { error: 'User creation failed!' };
  },

  async verifyTwoFactorCode(username, code) {
    const user = await userDAL.getUserByUsername(username);

    if (user.lastTwoFactorCode && code === user.lastTwoFactorCode) {
      const result = await userDAL.updateUserDetails(user._id, { lastTwoFactorCode: null });

      if (!result) {
        return { error: 'Unable to clear Two Factor Code !' };
      }

      return await self._generateTokenAndStartSession(user);
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
        return await self._handleTwoFactorRequest(user);
      }

      return await self._generateTokenAndStartSession(user);
    }
    return { error: 'User does not exists !' };
  },

  async _handleTwoFactorRequest(user) {
    const twoFactorCode = Math.floor(100000 + Math.random() * 900000);
    const result = await userDAL.updateUserDetails(user._id, { lastTwoFactorCode: twoFactorCode });

    if (!result) {
      return { error: 'Unable to save Two Factor Code !' };
    }

    AWSSESWrapper.SendEmailWithTemplate(user, 'TWO_FACTOR_CODE_REQUESTED', { recipient_name: user.firstName, two_factor_code: twoFactorCode });

    return { state: 'TWO_FACTOR_AUTH' };
  },

  async logout(userId) {
    return await userDAL.updateLastLogoutTime(userId);
  },

  async _generateTokenAndStartSession(user) {
    let lastTime = user.lastLogoutOn;

    if (!user.lastLogoutOn) {
      lastTime = user.createdOn;
    }

    const hashedString = util.authHashString(lastTime, user.password);

    let userRole = user.role;

    if (!user.role) {
      userRole = 'customer';
    }

    const token = jwt.sign({ id: user._id, hash: hashedString, role: userRole }, process.env.JWT_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY_TIME || '1h'
    });

    return token;
  }
};

module.exports = self;
