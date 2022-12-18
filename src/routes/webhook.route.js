const express = require('express');

const router = express.Router();

const webhookController = require('../controllers/webhook.controller');

router.post('/paypal-success', webhookController.paymentSuccess);


module.exports = router;