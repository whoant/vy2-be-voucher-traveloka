const catchAsync = require('../helpers/catchAsync.helper');
const { Partner, User } = require("../models");
const AppError = require("../helpers/appError.helper");
const { authSchema, userSchema } = require("../schemas/auth.schema");
const { verifyToken } = require("../helpers/jwt.helper");

exports.selectUser = permission => {
    return catchAsync(async (req, res, next) => {
        if (permission === 'PARTNER') {
            const token = req.get('authorization');

            if (!token || token.split(' ')[0] !== "Bearer") {
                throw new AppError('Bạn không đủ quyền để truy cập !', 403);
            }

            const { data } = await verifyToken(token.split(' ')[1]);
            const partner = await Partner.findByPk(data.id);

            if (!partner) {
                throw new AppError('Bạn không đủ quyền để truy cập !', 403);
            }
            res.locals.partner = partner;

            return next();
        }

        if (permission === 'USER') {
            const userId = req.get('user_id');
            if (!userId) throw new AppError('Vui lòng nhập đủ thông tin !', 500);
            const user = await User.findOne({
                where: {
                    userId
                }
            });

            if (!user) {
                throw new AppError('Bạn không đủ quyền để truy cập !', 403);
            }
            res.locals.user = user;

            return next();
        }

    });
}

exports.validatePartner = catchAsync(async (req, res, next) => {
    const { username, password } = req.body;
    await authSchema.validate({
        body: { username, password }
    });

    return next();

});

exports.validateUser = catchAsync(async (req, res, next) => {
    const { userId, email } = req.body;
    await userSchema.validate({
        body: { userId, email }
    });

    return next();
});