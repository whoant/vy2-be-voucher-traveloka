const AppError = require('../../helpers/appError.helper');
const catchAsync = require('../../helpers/catchAsync.helper');
const PartnerService = require("../../services/Partner");

exports.getVouchers = catchAsync(async (req, res, next) => {
    const { type } = req.query;
    const partner = new PartnerService(res.locals.partner, type);
    const vouchers = await partner.getVouchers();

    res.json({
        status: 'success',
        message: 'Lấy danh sách voucher thành công !',
        data: {
            vouchers
        }
    });
});

exports.createVoucher = catchAsync(async (req, res, next) => {
    const { type } = req.body;
    const partner = new PartnerService(res.locals.partner, type);
    await partner.createVoucher(req.body);

    res.json({
        status: 'success',
        message: 'Tạo voucher thành công !',
    });
});

exports.getTypeVouchers = catchAsync(async (req, res, next) => {
    const partner = new PartnerService(res.locals.partner, '');
    const typeVouchers = await partner.getTypeVouchers();

    res.json({
        status: 'success',
        message: 'Lấy danh sách thành công !',
        data: {
            typeVouchers
        }
    });
});

exports.getDetailVoucher = catchAsync(async (req, res, next) => {
    const { type, code } = req.query;
    const partner = new PartnerService(res.locals.partner, type);
    const info = await partner.getDetail(code);

    res.json({
        status: 'success',
        message: 'Lấy thông tin thành công !',
        data: {
            info
        }
    });
});

exports.getAnalyzeVoucher = catchAsync(async (req, res, next) => {
    const { type, code } = req.query;
    const partner = new PartnerService(res.locals.partner, type);
    const analyze = await partner.getAnalyzeVoucher(code);

    res.json({
        status: 'success',
        message: 'Lấy thông tin thành công !',
        data: {
            ...analyze
        }
    });
});

exports.getCountVouchers = catchAsync(async (req, res, next) => {
    const partner = new PartnerService(res.locals.partner, '');
    const count = await partner.getCountVouchers();

    res.json({
        status: 'success',
        message: 'Lấy thông tin thành công !',
        data: {
            count
        }
    });
});