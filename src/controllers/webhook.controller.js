const catchAsync = require('../helpers/catchAsync.helper');
const clientRedis = require("../config/redis");
const { UserVoucher } = require("../models");
const { STATE_PROMOTION } = require("../constants");
const AppError = require("../helpers/appError.helper");
const SwitchProfile = require("../services/Profile");


exports.paymentSuccess = catchAsync(async (req, res) => {
    const { paymentId, transactionId } = req.body;

    const isExists = await clientRedis.exists(paymentId);

    if (!isExists) {
        throw new AppError("Giao dịch không tồn tại !", 400);
    }

    const { voucherId, userId, partnerId, amount, title } = JSON.parse(await clientRedis.get(paymentId));
    const newUserVoucher = await UserVoucher.create({
        state: STATE_PROMOTION.OWNED,
        userId,
        voucherId
    });
    await newUserVoucher.createPayment({ transactionId: paymentId });

    await Promise.all([clientRedis.del(paymentId), clientRedis.del(transactionId)]);

    //const profileService = SwitchProfile('vy03', '');
    //await profileService.order(title, amount, 100, partnerId, userId);

    res.json({
        status: 'success',
        message: 'Mua voucher thành công !'
    });
});