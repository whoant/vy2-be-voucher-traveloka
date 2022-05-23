const catchAsync = require("../../helpers/catchAsync.helper");
const UserService = require("../../services/user");
const AppError = require("../../helpers/appError.helper");

exports.getVoucherEligible = catchAsync(async (req, res, next) => {
    const { partnerTypeVoucher } = res.locals;
    const userService = new UserService(res.locals.user, partnerTypeVoucher);
    const vouchers = await userService.getVoucherEligible();

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

exports.buyVoucher = catchAsync(async (req, res, next) => {
    const { typeVoucher, code } = req.body;
    const userService = new UserService(res.locals.user);
    const userVoucher = await userService.buyVoucher(code, typeVoucher);
    if (!userVoucher) throw new AppError("Voucher này đang được áp cho giao dịch khác", 500);

    res.json({
        status: 'success',
        message: 'Vui lòng thực hiện giao dịch !',
        data: { ...userVoucher }
    });
});

exports.preOrder = catchAsync(async (req, res, next) => {
    const { partnerTypeVoucher } = res.locals;

    const userService = new UserService(res.locals.user, partnerTypeVoucher);
    const preOrder = await userService.preOrder(req.body);

    if (!preOrder) throw new AppError("Voucher này đang được áp cho giao dịch khác", 500);

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

exports.updateStateVoucher = catchAsync(async (req, res, next) => {
    const { partnerTypeVoucher } = res.locals;
    const { orderId } = req.body;
    const userService = new UserService(res.locals.user, partnerTypeVoucher);
    const stateVoucher = await userService.updateStateVoucher(orderId);
    if (!stateVoucher) throw new AppError("Giao dịch không tồn tại", 500);

    res.json({
        status: 'success',
        message: 'Sử dụng voucher thành công !'
    });
});

exports.getVoucherCanBuy = catchAsync(async (req, res, next) => {
    const { user } = res.locals;
    const { typeVoucher } = req.query;
    const userService = new UserService('', '');
    const vouchers = await userService.getVoucherCanBuy(user, typeVoucher);

    res.json({
        status: 'success',
        message: 'Lấy danh sách thành công !',
        data: {
            vouchers
        }
    });
});

exports.postBuyVoucher = catchAsync(async (req, res, next) => {
    const { partnerTypeVoucher } = res.locals;
    const { code } = req.body;
    const userService = new UserService(res.locals.user, partnerTypeVoucher);
    await userService.buyVoucher(code);

    res.json({
        status: 'success',
        message: 'Order thành công !',
    });
});