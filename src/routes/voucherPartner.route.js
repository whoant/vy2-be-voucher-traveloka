const express = require('express');

const router = express.Router();

const voucherMiddleware = require('../middlewares/voucher.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const voucherController = require('../controllers/partner/voucher.controller');

router.get('/', authMiddleware.selectUser('PARTNER'), voucherController.getVouchers);

router.post('/', authMiddleware.selectUser('PARTNER'), voucherMiddleware.validateVoucher, voucherController.createVoucher);

router.get('/type-voucher', authMiddleware.selectUser('PARTNER'), voucherController.getTypeVouchers);

router.get('/detail', authMiddleware.selectUser('PARTNER'), voucherController.getDetailVoucher);

router.get('/analyze', authMiddleware.selectUser('PARTNER'), voucherController.getAnalyzeVoucher);

module.exports = router;