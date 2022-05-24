const paypal = require('@paypal/checkout-server-sdk');
const { PAYPAL_CLIENT_ID, PAYPAL_SECRET } = require('./index');

const Enviroment = process.env.NODE_ENV === 'production' ? paypal.core.LiveEnvironment : paypal.core.SandboxEnvironment;

module.exports = new paypal.core.PayPalHttpClient(new Enviroment(PAYPAL_CLIENT_ID, PAYPAL_SECRET));