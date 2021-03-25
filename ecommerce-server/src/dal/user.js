'use strict';

var bcrypt = require("bcryptjs");
const db = require("../models");
const User = db.user;

class userDAL {
    constructor() {

    }

    checkUsernameExists = async (username) => {
        return new Promise((resolve, reject) => {
            User.findOne({
                username: username
            }).exec((err, user) => {
                if (err) {
                    return reject(err);
                }

                if (user) {
                    return resolve(true);
                }

                return resolve(false);
            });
        });
    };

    checkEmailExists = async (email) => {
        return new Promise((resolve, reject) => {
            User.findOne({
                email: email
            }).exec((err, user) => {
                if (err) {
                    return reject(err);
                }

                if (user) {
                    return resolve(true);
                }

                return resolve(false);
            });
        });

    };

    createUser = (userName, firstName, lastName, email, password) => {
        return new Promise((resolve, reject) => {
            const user = new User({
                username: userName,
                email: email,
                firstName: firstName,
                lastName: lastName,
                password: bcrypt.hashSync(password, 8)
            });

            user.save((err, user) => {
                if (err) {
                    return reject(err);
                }

                return resolve(true);
            });
        });
    }

    getUserByUsername = (username) => {
        return new Promise((resolve, reject) => {
            User.findOne({
                username: username
            }).exec((err, user) => {
                if (err) {
                    return reject(err);
                }

                if (user) {
                    return resolve(user);
                }

                return resolve();
            });
        });
    }
}

module.exports = userDAL;
