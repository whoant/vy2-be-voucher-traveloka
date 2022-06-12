const catchAsync = require("../../helpers/catchAsync.helper");
const UserService = require("../../services/user");
const AppError = require("../../helpers/appError.helper");
const SwitchProfile = require('../../services/Profile');

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
    const giftCards = await userService.getGiftCardEligible();

    res.json({
        status: 'success',
        message: 'Lấy danh sách thành công !',
        data: { giftCards }
    });
});

exports.checkCondition = catchAsync(async (req, res, next) => {
    const { amount, code } = req.query;
    const { partnerTypeVoucher } = res.locals;
    const userService = new UserService(res.locals.user, partnerTypeVoucher);
    const deduct = await userService.checkGiftCardCondition(code, amount);

    res.json({
        status: 'success',
        message: 'Đủ điền kiện !',
        data: { ...deduct }
    });
});

exports.preOrder = catchAsync(async (req, res, next) => {
    const { partnerTypeVoucher } = res.locals;

    const userService = new UserService(res.locals.user, partnerTypeVoucher);
    const preOrder = await userService.preOrderGiftCard(req.body);

    if (!preOrder) throw new AppError("Thẻ quà tặng này đang được áp cho giao dịch khác", 400);

    res.json({
        status: 'success',
        message: 'Áp mã thành công !',
        data: {
            ...preOrder
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
    const stateVoucher = await userService.updateStateGiftCard(orderId);
    if (!stateVoucher) throw new AppError("Giao dịch không tồn tại", 400);

    res.json({
        status: 'success',
        message: 'Sử dụng thẻ quà tặng thành công !'
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
    const token = req.get('authorization');
    const userService = new UserService(res.locals.user, null);
    await userService.exchangeGift(giftCardCode, token);

    res.json({
        status: 'success',
        message: 'Đổi thành công !',
    });
});

exports.getPointAvailable = catchAsync(async (req, res, next) => {
    const { appId } = res.locals.user;
    const token = req.get('authorization');
    const profileService = SwitchProfile(appId, token);
    const point = await profileService.getPoint();

    res.json({
        status: 'success',
        data: {
            point
        },
        message: 'Lấy điểm thành công !'
    })
});