const paypal = require('paypal-rest-sdk');
const { PAYPAL_MODE, PAYPAL_CLIENT_ID, PAYPAL_SECRET } = require('./index');

paypal.configure({
    mode: PAYPAL_MODE,
    client_id: PAYPAL_CLIENT_ID,
    client_secret: PAYPAL_SECRET
});

module.exports = paypal;