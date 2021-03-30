const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userDAL = require('../dal/user');
const util = require('../util/index');

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

    return await userDAL.createUser(userName, firstName, lastName, email, password);
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

      let lastTime = user.lastLogoutOn;

      if (!user.lastLogoutOn) {
        lastTime = user.createdOn;
      }

      const hashedString = util.authHashString(lastTime, user.password);

      const token = jwt.sign({ id: user._id, hash: hashedString }, process.env.JWT_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY_TIME || 86400
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
