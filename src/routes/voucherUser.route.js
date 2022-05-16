const express = require('express');

const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const voucherUserController = require('../controllers/user/voucher.controller');
const paramMiddleware = require("../middlewares/param.middleware");

router.get('/eligible', authMiddleware.selectUser('USER'), paramMiddleware.paramTypeVoucher, voucherUserController.getVoucherEligible);

router.get('/check-condition', authMiddleware.selectUser('USER'), paramMiddleware.paramTypeVoucher, voucherUserController.checkCondition);

router.post('/pre-order', authMiddleware.selectUser('USER'), paramMiddleware.paramTypeVoucher, voucherUserController.preOrder);

router.post('/cancel-order', authMiddleware.selectUser('USER'), paramMiddleware.paramTypeVoucher, voucherUserController.cancelOrder);

router.put('/state', authMiddleware.selectUser('USER'), paramMiddleware.paramTypeVoucher, voucherUserController.updateStateVoucher);

module.exports = router;