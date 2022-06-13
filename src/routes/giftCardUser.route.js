const express = require('express');

const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const giftCardUserController = require('../controllers/user/giftCard.controller');
const paramMiddleware = require("../middlewares/param.middleware");

router.get('/owner', authMiddleware.selectUser('USER'), giftCardUserController.getGiftOwned);

router.get('/eligible', authMiddleware.selectUser('USER'), paramMiddleware.paramTypeVoucher, giftCardUserController.getGiftEligible);

router.get('/check-condition', authMiddleware.selectUser('USER'), paramMiddleware.paramTypeVoucher, giftCardUserController.checkCondition);

router.post('/pre-order', authMiddleware.selectUser('USER'), paramMiddleware.paramTypeVoucher, giftCardUserController.preOrder);

router.post('/cancel-order', authMiddleware.selectUser('USER'), paramMiddleware.paramTypeVoucher, giftCardUserController.cancelOrder);

router.put('/state', authMiddleware.selectUser('USER'), paramMiddleware.paramTypeVoucher, giftCardUserController.updateStateGift);

router.get('/can-exchange', authMiddleware.selectUser('USER'), giftCardUserController.getGiftCanExchange);

router.post('/exchange', authMiddleware.selectUser('USER'), giftCardUserController.postExchangeGift);

router.get('/point', authMiddleware.selectUser('USER'), giftCardUserController.getPointAvailable);

module.exports = router;