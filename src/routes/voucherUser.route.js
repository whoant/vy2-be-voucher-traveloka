const express = require('express');

const router = express.Router();

const voucherMiddleware = require('../middlewares/voucher.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const voucherController = require('../controllers/partner/voucher.controller');

router.get('/', authMiddleware.selectUser('USER'), voucherController.getVouchers);
router.post('/', authMiddleware.selectUser('USER'), voucherMiddleware.validateVoucher, voucherController.createVoucher);


module.exports = router;