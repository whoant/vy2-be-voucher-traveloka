const catchAsync = require("../../helpers/catchAsync.helper");
const UserService = require("../../services/user");
const AppError = require("../../helpers/appError.helper");

exports.getGiftOwned = catchAsync(async (req, res, next) => {
    const { type } = req.query;
    const userService = new UserService(res.locals.user, null);
    const vouchers = await userService.getVoucherOwned(type);

    res.json({
        status: 'success',
        message: 'Lấy danh sách thành công !',
        data: { vouchers }
    });
});

exports.getGiftrEligible = catchAsync(async (req, res, next) => {
    const { partnerTypeVoucher } = res.locals;
    const userService = new UserService(res.locals.user, partnerTypeVoucher);
    const vouchers = await userService.getGiftCardEligible();

    res.json({
        status: 'success',
        message: 'Lấy danh sách thành công !',
        data: { vouchers }
    });
});

exports.checkCondition = catchAsync(async (req, res, next) => {
    const { amount, code } = req.query;
    const { partnerTypeVoucher } = res.locals;
    const userService = new UserService(res.locals.user, partnerTypeVoucher);
    const voucher = await userService.checkVoucherValid(code);
    const deduct = await userService.checkVoucherCondition(voucher, amount);

    res.json({
        status: 'success',
        message: 'Đủ điền kiện !',
        data: { amount: deduct }
    });
});

exports.preOrder = catchAsync(async (req, res, next) => {
    const { partnerTypeVoucher } = res.locals;

    const userService = new UserService(res.locals.user, partnerTypeVoucher);
    const preOrder = await userService.preOrder(req.body);

    if (!preOrder) throw new AppError("Voucher này đang được áp cho giao dịch khác", 400);

    res.json({
        status: 'success',
        message: 'Áp mã thành công !',
        data: {
            orderId: preOrder
        }
    });
});

exports.cancelOrder = catchAsync(async (req, res, next) => {
    const { partnerTypeVoucher } = res.locals;
    const { orderId } = req.body;
    const userService = new UserService(res.locals.user, partnerTypeVoucher);
    await userService.cancelOrder(orderId);

    res.json({
        status: 'success',
        message: 'Huỷ giao dịch thành công !'
    });
});

exports.updateStateGift = catchAsync(async (req, res, next) => {
    const { partnerTypeVoucher } = res.locals;
    const { orderId } = req.body;
    const userService = new UserService(res.locals.user, partnerTypeVoucher);
    const stateVoucher = await userService.updateStateVoucher(orderId);
    if (!stateVoucher) throw new AppError("Giao dịch không tồn tại", 400);

    res.json({
        status: 'success',
        message: 'Sử dụng voucher thành công !'
    });
});

exports.getGiftCanExchange = catchAsync(async (req, res, next) => {
    const { user } = res.locals;
    const { typeVoucher } = req.query;
    const userService = new UserService(user, null);
    const giftCards = await userService.getGiftCanExchange(typeVoucher);

    res.json({
        status: 'success',
        message: 'Lấy danh sách thành công !',
        data: {
            giftCards
        }
    });
});

exports.postExchangeGift = catchAsync(async (req, res, next) => {
    const { giftCardCode } = req.body;
    const userService = new UserService(res.locals.user, null);
    await userService.exchangeGift(giftCardCode);

    res.json({
        status: 'success',
        message: 'Đổi thành công !',
    });
});
