require('dotenv').config();

module.exports = {
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    DB_URI: process.env.DB_URI,
    REDIS_URI: process.env.REDIS_URI,
    PAYPAL_MODE: process.env.PAYPAL_MODE,
    PAYPAL_SECRET: process.env.PAYPAL_SECRET,
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID
};