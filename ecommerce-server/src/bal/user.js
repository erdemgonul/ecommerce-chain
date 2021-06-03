const bcrypt = require('bcryptjs');
const userDAL = require('../dal/user');
const paymentBAL = require('./payment');
const util = require('../util');

const self = {
    async getUserDetailsByUsername(username) {
        const userDetails = await userDAL.getUserByUsername(username);

        if (userDetails) {
            delete userDetails.createdOn;
            delete userDetails.lastLogoutOn;
            delete userDetails.password;
            delete userDetails._id;
            delete userDetails.__v;
            delete userDetails.lastTwoFactorCode;
            delete userDetails.cryptoAccountPrivateKey;

            return userDetails;
        }

        return {error: 'User not found !'};
    },

    async getAllNotificationTokens() {
      return await userDAL.getAllNotificationTokens();
    },

    async getUserDetailsById(userId, fullDetails = false, forCurrentUser = false) {
        const userDetails = await userDAL.getUserByUserId(userId);

        if (userDetails) {
            if (forCurrentUser) {
                userDetails.balance = await paymentBAL.getBalance(userDetails.cryptoAccountPublicKey);
            }

            if (fullDetails) {
                // also decrypt private key
                const currentUserDecodedPrivateKey = util.aesDecrypt(userDetails.cryptoAccountPrivateKey);

                userDetails.cryptoAccountPrivateKey = currentUserDecodedPrivateKey;

                userDetails.id = userDetails._id;
                delete userDetails._id;
                delete userDetails.__v;

                return userDetails;
            }

            delete userDetails.createdOn;
            delete userDetails.lastLogoutOn;
            delete userDetails.password;
            delete userDetails._id;
            delete userDetails.__v;
            delete userDetails.lastTwoFactorCode;
            delete userDetails.cryptoAccountPrivateKey;

            return userDetails;
        }
    },

    async changeDetails(userId, detailsToChange) {
        if (detailsToChange && Object.keys(detailsToChange).length === 0 && detailsToChange.constructor === Object) {
            return {error: 'Invalid change request !'};
        }

        if (detailsToChange.hasOwnProperty('email')) {
            const emailExists = await userDAL.isEmailExists(detailsToChange.email);

            if (emailExists) {
                return {error: 'Email already exists !'};
            }
        }

        let currentUserDetails;

        if (detailsToChange.hasOwnProperty('newShippingAddress') && detailsToChange.hasOwnProperty('shippingAddresses')) {
            if (!currentUserDetails) {
                currentUserDetails = await userDAL.getUserByUserId(userId);
            }

            detailsToChange.shippingAddresses = [...currentUserDetails.shippingAddresses, ...detailsToChange.shippingAddresses];
        }

        if (detailsToChange.hasOwnProperty('newBillingAddress') && detailsToChange.hasOwnProperty('billingAddresses')) {
            if (!currentUserDetails) {
                currentUserDetails = await userDAL.getUserByUserId(userId);
            }

            detailsToChange.billingAddresses = [...currentUserDetails.billingAddresses, ...detailsToChange.billingAddresses];
        }

        if (detailsToChange.hasOwnProperty('password')) {
            detailsToChange.password = bcrypt.hashSync(detailsToChange.password, 8);
        }

        delete detailsToChange.newBillingAddress;
        delete detailsToChange.newShippingAddress;

        return await userDAL.updateUserDetails(userId, detailsToChange);
    }
};

module.exports = self;
