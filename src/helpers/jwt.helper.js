const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const generateToken = (data) => {
    return new Promise((resolve, reject) => {
        jwt.sign({ data }, JWT_SECRET, {
            algorithm: 'HS256',
            expiresIn: '90d'
        }, (err, token) => {
            if (err) return reject(err);
            resolve(token);
        });
    });
};

const verifyToken = token => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) return reject(err);
            resolve(decoded);
        });
    });
};

module.exports = {
    generateToken,
    verifyToken
};
