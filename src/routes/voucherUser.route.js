const express = require('express');

const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const voucherUserController = require('../controllers/user/voucher.controller');
const paramMiddleware = require("../middlewares/param.middleware");

router.get('/owner', authMiddleware.selectUser('USER'), voucherUserController.getVoucherOwned);

router.get('/eligible', authMiddleware.selectUser('USER'), paramMiddleware.paramTypeVoucher, voucherUserController.getVoucherEligible);

router.get('/check-condition', authMiddleware.selectUser('USER'), paramMiddleware.paramTypeVoucher, voucherUserController.checkCondition);

router.post('/pre-order', authMiddleware.selectUser('USER'), paramMiddleware.paramTypeVoucher, voucherUserController.preOrder);

router.post('/cancel-order', authMiddleware.selectUser('USER'), paramMiddleware.paramTypeVoucher, voucherUserController.cancelOrder);

router.put('/state', authMiddleware.selectUser('USER'), paramMiddleware.paramTypeVoucher, voucherUserController.updateStateVoucher);

router.get('/can-buy', authMiddleware.selectUser('USER'), voucherUserController.getVoucherCanBuy);

router.post('/pre-buy', authMiddleware.selectUser('USER'), paramMiddleware.paramTypeVoucher, voucherUserController.postPreBuyVoucher);

router.post('/check-buy', authMiddleware.selectUser('USER'), voucherUserController.postCheckBuyVoucher);

router.post('/buy', authMiddleware.selectUser('USER'), voucherUserController.postBuyVoucher);

module.exports = router;