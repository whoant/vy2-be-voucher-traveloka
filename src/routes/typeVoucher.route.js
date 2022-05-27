const express = require('express');

const router = express.Router();

const TypeVoucherController = require('../controllers/typeVoucher.controller');
const TypeVoucherMiddleware = require('../middlewares/typeVoucher.middleware');

router.get('/', TypeVoucherController.getAllTypeVouchers);

router.post('/', TypeVoucherMiddleware.validateTypeVoucher, TypeVoucherController.createTypeVoucher);

module.exports = router;