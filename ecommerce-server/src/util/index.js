const crypto = require('crypto');

const self = {
  authHashString(lastTime, hashedPassword) {
    const stringToHash = lastTime + hashedPassword.substring(32);
    return crypto.createHash('md5').update(stringToHash).digest('hex');
  },

  flattenObject (obj, parentKey) {
    const flattened = {}

    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray( obj[key] )) {
        let parentKey = key
        if (parentKey) {
          let indChar = parentKey.indexOf('_') + 1;
          let charToUp = parentKey.charAt(indChar);
          parentKey = parentKey.substring(0, indChar) + charToUp.toUpperCase() + parentKey.substring(indChar + 1);
          parentKey = parentKey.replace(/_/g, '');
        }
        Object.assign(flattened, this.flattenObject(obj[key], parentKey))
      } else {
        if (parentKey) {
          flattened[parentKey + '_' + key] = obj[key]
        } else {
          flattened[key] = obj[key]
        }
      }
    })

    return flattened
  }
};

module.exports = self;
