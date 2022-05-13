const express = require('express');

const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const voucherUserController = require('../controllers/user/voucher.controller');

router.get('/eligible', authMiddleware.selectUser('USER'), voucherUserController.getVoucherEligible);

router.get('/list', authMiddleware.selectUser('USER'), voucherUserController.getListVoucher);

router.get('/check-condition', authMiddleware.selectUser('USER'), voucherUserController.checkCondition);

router.post('/save', authMiddleware.selectUser('USER'), voucherUserController.saveVoucher);

router.post('/buy', authMiddleware.selectUser('USER'), voucherUserController.buyVoucher);

router.post('/pre-order', authMiddleware.selectUser('USER'), voucherUserController.preOrder);

router.post('/cancel-order', authMiddleware.selectUser('USER'), voucherUserController.cancelOrder);

router.put('/state', authMiddleware.selectUser('USER'), voucherUserController.updateStateVoucher);


module.exports = router;