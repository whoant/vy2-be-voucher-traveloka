const catchAsync = require("../../helpers/catchAsync.helper");
const UserService = require("../../services/user");

exports.saveVoucher = catchAsync(async (req, res, next) => {
    const { voucherId } = req.body;
    const userService = new UserService(res.locals.user);
    await userService.createUserVoucher(voucherId);

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
    const { amount, voucherId } = req.body;
    const userService = new UserService(res.locals.user);
    const vouchers = await userService.checkVoucherValid(voucherId, amount);

    res.json({
        status: 'success',
        message: 'Đủ điền kiện !',
        data: { vouchers }
    });
});