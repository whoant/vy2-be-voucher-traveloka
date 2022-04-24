const express = require('express');

const router = express.Router();

const voucherMiddleware = require('../middlewares/voucher.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const voucherController = require('../controllers/voucher.controller');

router.get('/', authMiddleware.selectUser('PARTNER'), voucherController.getVouchers);
router.post('/', authMiddleware.selectUser('PARTNER'), voucherMiddleware.validateVoucher, voucherController.createVoucher);


module.exports = router;