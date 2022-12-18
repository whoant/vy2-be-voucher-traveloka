const catchAsync = require('../helpers/catchAsync.helper');
const AppError = require("../helpers/appError.helper");
const { typeVoucherSchema } = require("../schemas/typeVoucher.schema");

exports.validateTypeVoucher = catchAsync(async (req, res, next) => {
    try {
        await typeVoucherSchema.validate(req);
        return next();
    } catch (e) {
        throw new AppError('Dữ liệu không hợp lệ !', 400);
    }
});
