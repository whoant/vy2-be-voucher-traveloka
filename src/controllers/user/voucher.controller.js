const catchAsync = require("../../helpers/catchAsync.helper");
const UserService = require("../../services/user");
const AppError = require("../../helpers/appError.helper");
const clientRedis = require("../../config/redis");

exports.getVoucherOwned = catchAsync(async (req, res, next) => {
    const { type } = req.query;
    const userService = new UserService(res.locals.user, null);
    const vouchers = await userService.getVoucherOwned(type);

    res.json({
        status: 'success',
        message: 'Lấy danh sách thành công !',
        data: { vouchers }
    });
});

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

exports.preOrder = catchAsync(async (req, res, next) => {
    const { partnerTypeVoucher } = res.locals;

    const userService = new UserService(res.locals.user, partnerTypeVoucher);
    const preOrder = await userService.preOrder(req.body);

    if (!preOrder) throw new AppError("Voucher này đang được áp cho giao dịch khác", 400);

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

exports.updateStateVoucher = catchAsync(async (req, res, next) => {
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

exports.postPreBuyVoucher = catchAsync(async (req, res, next) => {
    const { partnerTypeVoucher } = res.locals;
    const { code } = req.body;
    const userService = new UserService(res.locals.user, partnerTypeVoucher);
    const transactionId = await userService.preBuyVoucher(code);

    res.json({
        status: 'success',
        message: 'Order thành công !',
        data: {
            transactionId
        }
    });
});

exports.postCheckBuyVoucher = catchAsync(async (req, res, next) => {
    const { transactionId } = req.body;
    const isExists = await clientRedis.exists(transactionId);
    if (!isExists) throw new AppError("Giao dịch này không tồn tại !", 400);

    const { amount, title, description, email } = JSON.parse(await clientRedis.get(transactionId));

    res.json({
        status: 'success',
        message: 'Kiểm tra thành công !',
        data: {
            amount, title, description, email
        }
    });
});

exports.postBuyVoucher = catchAsync(async (req, res, next) => {
    const { transactionId } = req.body;
    const userService = new UserService(res.locals.user, null);
    const paymentId = await userService.buyVoucher(transactionId);

    res.json({
        status: 'success',
        message: 'Thực hiện thành công !',
        data: {
            paymentId
        }
    });
});

exports.getDetailVoucher = catchAsync(async (req, res, next) => {
    const { voucherCode } = req.query;
    const userService = new UserService(res.locals.user, null);
    const info = await userService.getDetailVoucher(voucherCode);

    res.json({
        status: 'success',
        message: 'Lấy thông tin thành công !',
        data: {
            info
        }
    });
});
