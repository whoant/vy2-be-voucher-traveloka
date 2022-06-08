const express = require('express');

const router = express.Router();

const giftCardMiddleware = require('../middlewares/giftCard.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const giftCardController = require('../controllers/partner/giftCard.controller');
const voucherController = require("../controllers/partner/voucher.controller");

router.get('/', authMiddleware.selectUser('PARTNER'), giftCardController.getGiftCards);

router.post('/', authMiddleware.selectUser('PARTNER'), giftCardMiddleware.validateGiftCard, giftCardController.createGiftCard);

router.get('/count', authMiddleware.selectUser('PARTNER'), giftCardController.getCountGiftCards);

module.exports = router;