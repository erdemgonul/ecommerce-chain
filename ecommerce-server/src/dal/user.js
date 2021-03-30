'use strict';

const bcrypt = require("bcryptjs");
const db = require("../models");
const User = db.user;

const self = {
    isUsernameExists: async (username) => {
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

    isEmailExists: async (email) => {
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

    createUser: async (userName, firstName, lastName, email, password) => {
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
                return createdUser.toObject()
            }
        } catch (err) {
            return err;
        }
    },

    getUserByUsername: async (username) => {
        try {
            const user = await User.findOne({
                username: username
            }).exec();

            if (user) {
                return user.toObject()
            }
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
                return user.toObject()
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
                return true
            }
        } catch (err) {
            return err;
        }
    }
}

module.exports = self;
