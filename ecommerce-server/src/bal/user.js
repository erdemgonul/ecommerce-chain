'use strict';

const userDAL = require('../dal/user')
const bcrypt = require("bcryptjs");

const self = {
    async getUserDetailsByUsername (username) {
        const userDetails = await userDAL.getUserByUsername(username)

        if (userDetails) {
            delete userDetails.password;
            delete userDetails._id;
            delete userDetails.__v;

            return userDetails;
        } else {
            return {error:'User not found !'};
        }
    },

    async getUserDetailsById (userId) {
        const userDetails = await userDAL.getUserByUserId(userId)

        if (userDetails) {
            delete userDetails.password;
            delete userDetails._id;
            delete userDetails.__v;

            return userDetails;
        }
    },

    async changeDetails (userId, detailsToChange) {
        if (detailsToChange && Object.keys(detailsToChange).length === 0 && detailsToChange.constructor === Object) {
            return {error: 'Invalid change request !'};
        }

        if (detailsToChange.hasOwnProperty('email')) {
            const emailExists = await userDAL.isEmailExists(detailsToChange.email)

            if (emailExists) {
                return {error: 'Email already exists !'};
            }
        }

        if (detailsToChange.hasOwnProperty('password')) {
            detailsToChange.password = bcrypt.hashSync(detailsToChange.password, 8)
        }

        return await userDAL.updateUserDetails(userId, detailsToChange)
    },

    async signIn (username, password) {
        const user = await userDAL.getUserByUsername(username);

        if (user) {
            const passwordIsValid = bcrypt.compareSync(
                password,
                user.password
            );

            if (!passwordIsValid) {
                return {error: 'Invalid Password'}
            }

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: 86400 // 24 hours
            });

            return token;
        } else {
            return {error: 'User does not exists !'}
        }
    }
}

module.exports = self;
