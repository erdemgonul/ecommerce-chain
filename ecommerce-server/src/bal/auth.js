'use strict';

const userDAL = require('../dal/user')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

class authBAL {
    constructor() {
        this.userDal = new userDAL ();
    }

    async signUp (userName, firstName, lastName, email, password) {
        const userExists = await this.userDal.checkUsernameExists(userName);

        if (userExists) {
            return {error:'User already exists !'};
        }

        const emailExists = await this.userDal.checkEmailExists(email);

        if (emailExists) {
            return {error:'Email already exists !'};
        }

        return await this.userDal.createUser(userName, firstName, lastName, email, password)
    }

    async signIn (username, password) {
        const user = await this.userDal.getUserByUsername(username);

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

module.exports = authBAL;
