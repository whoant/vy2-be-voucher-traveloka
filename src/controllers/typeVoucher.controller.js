const catchAsync = require('../helpers/catchAsync.helper');
const TypeVoucherService = require("../services/TypeVoucher");

exports.createTypeVoucher = catchAsync(async (req, res) => {
    const TypeVoucher = new TypeVoucherService(null);
    await TypeVoucher.createTypeVoucher(req.body);

    res.json({
        status: 'success',
        message: 'Tạo loại voucher thành công !'
    });
});