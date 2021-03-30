'use strict';

const userDAL = require('../dal/user')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const self = {
    async signUp (userName, firstName, lastName, email, password) {
        const userExists = await userDAL.checkUsernameExists(userName);

        if (userExists) {
            return {error:'User already exists !'};
        }

        const emailExists = await userDAL.checkEmailExists(email);

        if (emailExists) {
            return {error:'Email already exists !'};
        }

        return await userDAL.createUser(userName, firstName, lastName, email, password)
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

            // TODO: IMPROVE JWT SIGNING
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
