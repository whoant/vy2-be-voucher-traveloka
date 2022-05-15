const AppError = require('../../helpers/appError.helper');
const catchAsync = require('../../helpers/catchAsync.helper');
const PartnerService = require("../../services/Partner");

exports.getVouchers = catchAsync(async (req, res, next) => {
    const { type } = req.query;
    const partner = new PartnerService(res.locals.partner);
    const vouchers = await partner.getVouchers(type);

    res.json({
        status: 'success',
        message: 'Lấy danh sách voucher thành công !',
        data: {
            vouchers
        }
    });
});

exports.createVoucher = catchAsync(async (req, res, next) => {
    const partner = new PartnerService(res.locals.partner);
    await partner.createVoucher(req.body);

    res.json({
        status: 'success',
        message: 'Tạo voucher thành công !',
    });
});

exports.updateStateVoucher = catchAsync(async (req, res, next) => {
    const { userId, code, transactionId } = req.body;
    const partner = new PartnerService(res.locals.partner);
    await partner.updateStateVoucherAfterUsed(userId, code, transactionId)

    res.json({
        status: 'success',
        message: 'Cập voucher thành công !',
    });
});