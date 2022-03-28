const crypto = require('crypto');

const md5 = text => crypto.createHash('md5').update(text).digest('hex');

const sha256 = text => crypto.createHash('sha256').update(text).digest('hex');

module.exports = {
    md5, sha256
};