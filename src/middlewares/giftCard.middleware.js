const catchAsync = require('../helpers/catchAsync.helper');
const AppError = require("../helpers/appError.helper");
const { giftCardSchema } = require("../schemas/giftCard.schema");

exports.validateGiftCard = catchAsync(async (req, res, next) => {
    try {
        await giftCardSchema.validate(req);
        return next();
    } catch (e) {
        throw new AppError(e.message, 400);
    }
});
