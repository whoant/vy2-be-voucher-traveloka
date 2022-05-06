const catchAsync = require("../../helpers/catchAsync.helper");
const UserService = require("../../services/user");

exports.saveVoucher = catchAsync(async (req, res, next) => {
    const { code } = req.body;
    const userService = new UserService(res.locals.user);
    await userService.createUserVoucher(code);

    res.json({
        status: 'success',
        message: 'Lưu thành công !',
    });
});

exports.getVoucherEligible = catchAsync(async (req, res, next) => {
    const { typeVoucher } = req.query;
    const userService = new UserService(res.locals.user);
    const vouchers = await userService.getVoucherEligible(typeVoucher);

    res.json({
        status: 'success',
        message: 'Lấy danh sách thành công !',
        data: { vouchers }
    });
});

exports.checkCondition = catchAsync(async (req, res, next) => {
    const { amount, code, typeVoucher } = req.query;
    const userService = new UserService(res.locals.user);
    const vouchers = await userService.checkVoucherCondition(code, typeVoucher, amount);

    res.json({
        status: 'success',
        message: 'Đủ điền kiện !',
        data: { vouchers }
    });
});

exports.getListVoucher = catchAsync(async (req, res, next) => {
    const { typeVoucher } = req.query;
    const userService = new UserService(res.locals.user);
    const vouchers = await userService.getListVoucher(typeVoucher);

    res.json({
        status: 'success',
        message: 'Lấy danh sách thành công !',
        data: { vouchers }
    });
});

exports.buyVoucher = catchAsync(async (req, res, next) => {
    const { typeVoucher, code } = req.body;
    const userService = new UserService(res.locals.user);
    const userVoucher = await userService.buyVoucher(code, typeVoucher);

    res.json({
        status: 'success',
        message: 'Vui lòng thực hiện giao dịch !',
        data: { ...userVoucher }
    });
});

exports.preOrder = catchAsync(async (req, res, next) => {
    const userService = new UserService(res.locals.user);
    await userService.preOrder(req.body);

    res.json({
        status: 'success',
        message: 'Áp mã thành công !'
    });
});

exports.cancelOrder = catchAsync(async (req, res, next) => {

});