const { voucherSchema } = require('../schemas/voucher.schema');
const catchAsync = require('../helpers/catchAsync.helper');
const AppError = require("../helpers/appError.helper");

exports.validateVoucher = catchAsync(async (req, res, next) => {
    try {
        await voucherSchema.validate(req);
        return next();
    } catch (e) {
        throw new AppError('Dữ liệu không hợp lệ !', 400);
    }
});
