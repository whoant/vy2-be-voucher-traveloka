const { generateToken, verifyToken } = require("../../helpers/jwt.helper");
const AppError = require('../../helpers/appError.helper');
const catchAsync = require('../../helpers/catchAsync.helper');
const { User } = require("../../models");

exports.login = catchAsync(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({
        where: {
            email
        }
    });

    if (!user) throw new AppError('Tài khoản không tồn tại !');
    const token = await generateToken({ sub: user.userId });

    res.json({
        status: 'success',
        message: 'Đăng nhập thành công !',
        data: {
            token,
            userId: user.userId,
            email
        }
    });
});

exports.createUser = catchAsync(async (req, res) => {
    const { userId, email } = req.body;
    await User.create({
        userId,
        encryptToken: 'OKEE',
        email,
    });

    res.json({
        status: 'success',
        message: 'Tạo user thành công !',
    });
});

exports.loginUsingToken = catchAsync(async (req, res) => {
    const { token } = req.query;
    const data = await verifyToken(token);

    let user = await User.findOne({
        where: {
            userId: data.sub
        }
    });

    if (!user) {
        user = await User.create({
            userId: data.sub,
            encryptToken: 'OKEE',
            email: data.email
        });
    }

    res.json({
        status: 'success',
        message: 'Đăng nhập thành công !',
        data: {
            token,
            userId: user.userId,
            email: user.email
        }
    });
});