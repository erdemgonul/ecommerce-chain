const crypto = require('crypto');
const invoicePDFGenerator = require('./invoicePDFGenerator');

const self = {
  authHashString(lastTime, hashedPassword) {
    const stringToHash = lastTime + hashedPassword.substring(32);
    return crypto.createHash('md5').update(stringToHash).digest('hex');
  },

  flattenObject(obj, parentKey) {
    const flattened = {};

    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        let parentKey = key;
        if (parentKey) {
          const indChar = parentKey.indexOf('_') + 1;
          const charToUp = parentKey.charAt(indChar);
          parentKey = parentKey.substring(0, indChar) + charToUp.toUpperCase() + parentKey.substring(indChar + 1);
          parentKey = parentKey.replace(/_/g, '');
        }
        Object.assign(flattened, this.flattenObject(obj[key], parentKey));
      } else if (parentKey) {
        flattened[`${parentKey}_${key}`] = obj[key];
      } else {
        flattened[key] = obj[key];
      }
    });

    return flattened;
  },

  aesEncrypt(text) {
    let iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv('aes-256-cbc', process.env.CRYPTO_AES_KEY, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + '.' + encrypted.toString('hex');
  },

  aesDecrypt(encryptedTextWithIv) {
    let splitEncryptedTextWithIv = encryptedTextWithIv.split('.');
    let iv = splitEncryptedTextWithIv[0]
    let encryptedText = Buffer.from(splitEncryptedTextWithIv[1], 'hex');

    let decipher = crypto.createDecipheriv('aes-256-cbc', process.env.CRYPTO_AES_KEY, Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  },

  generateInvoicePDF(invoiceData) {
    return invoicePDFGenerator.createInvoice(invoiceData);
  }
};

module.exports = self;
