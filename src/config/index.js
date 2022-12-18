require('dotenv').config();

module.exports = {
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    DB_URI: process.env.DB_URI,
    REDIS_URI: process.env.REDIS_URI,
    PAYPAL_SECRET: process.env.PAYPAL_SECRET,
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    TOKEN_TELEGRAM: process.env.TOKEN_TELEGRAM,
    GROUP_TELEGRAM: process.env.GROUP_TELEGRAM
};