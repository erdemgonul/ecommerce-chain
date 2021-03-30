'use strict';

const bcrypt = require("bcryptjs");
const db = require("../models");
const User = db.user;

const self = {
    checkUsernameExists : async (username) => {
        try {
            const user = await User.findOne({
                username: username
            }).exec();

            if (user) {
                return true
            }
        } catch (err) {
            return err;
        }

        return false;
    },

    checkEmailExists : async (email) => {
        try {
            const user = await User.findOne({
                email: email
            }).exec();

            if (user) {
                return true
            }
        } catch (err) {
            return err;
        }

        return false;
    },

    createUser : async (userName, firstName, lastName, email, password) => {
        const user = new User({
            username: userName,
            email: email,
            firstName: firstName,
            lastName: lastName,
            password: bcrypt.hashSync(password, 8)
        });

        try {
            const createdUser = await user.save();

            if (createdUser) {
                return createdUser
            }
        } catch (err) {
            return err;
        }
    },

    getUserByUsername : async (username) => {
        try {
            const user = await User.findOne({
                username: username
            }).exec();

            if (user) {
                return user
            }
        } catch (err) {
            return err;
        }
    }
}

module.exports = self;
