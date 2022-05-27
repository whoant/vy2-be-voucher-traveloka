const catchAsync = require('../helpers/catchAsync.helper');
const TypeVoucherService = require("../services/TypeVoucher");
const { TypeVoucher } = require("../models");

exports.createTypeVoucher = catchAsync(async (req, res) => {
    const TypeVoucher = new TypeVoucherService(null);
    await TypeVoucher.createTypeVoucher(req.body);

    res.json({
        status: 'success',
        message: 'Tạo loại voucher thành công !'
    });
});

exports.getAllTypeVouchers = catchAsync(async (req, res) => {
    const typeVouchers = await TypeVoucher.findAll({
        attributes: ['name', 'type']
    });

    res.json({
        status: 'success',
        message: 'Lấy dánh sách thành công !',
        data: {
            types: typeVouchers
        }
    });
});