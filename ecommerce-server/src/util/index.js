const crypto = require('crypto');

const self = {
    authHashString (lastTime, hashedPassword) {
        const stringToHash = lastTime + hashedPassword.substring(32);
        return crypto.createHash('md5').update(stringToHash).digest("hex");
    }
}

module.exports = self;