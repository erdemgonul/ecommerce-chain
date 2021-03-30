'use strict';

const userDAL = require('../dal/user')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const self = {
    async signUp (userName, firstName, lastName, email, password) {
        const userExists = await userDAL.isUsernameExists(userName);

        if (userExists) {
            return {error:'User already exists !'};
        }

        const emailExists = await userDAL.isEmailExists(email);

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

            if (!user._id) {
                return {error: 'Invalid User'}
            }

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: 86400 // 24 hours
            });

            return token;
        } else {
            return {error: 'User does not exists !'}
        }
    }
}

module.exports = self;
