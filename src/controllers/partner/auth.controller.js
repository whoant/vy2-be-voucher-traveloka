const { generateToken, verifyToken } = require("../../helpers/jwt.helper");
const AppError = require('../../helpers/appError.helper');
const catchAsync = require('../../helpers/catchAsync.helper');
const { Partner, TypeVoucher, PartnerTypeVoucher } = require("../../models");
const { SERVICE_PROFILE } = require("../../constants");

exports.login = catchAsync(async (req, res) => {
    const { username, password } = req.body;
    const partner = await Partner.findOne({
        where: {
            username
        }
    });

    if (!partner) throw new AppError('Partner không tồn tại !');
    const token = await generateToken({ sub: partner.id });

    res.json({
        status: 'success',
        message: 'Đăng nhập thành công !',
        data: {
            token,
            name: partner.name,
            email: partner.email
        }
    });
});

exports.createPartner = catchAsync(async (req, res) => {
    const { appId } = res.locals;
    const { username, password, typeVouchers, email, name } = req.body;
    const newPartner = await Partner.create({
        username, password, email, name, secretKey: '', appId
    });

    await Promise.all(typeVouchers.map(async type => {
        const typeVoucher = await TypeVoucher.findOne({
            where: {
                type,
            }
        });

        if (typeVoucher) {
            return PartnerTypeVoucher.create({
                partnerId: newPartner.id,
                typeVoucherId: typeVoucher.id,
            })
        }
    }));

    res.json({
        status: 'success',
        message: 'Tạo Partner thành công !',
    });
});

exports.loginUsingToken = catchAsync(async (req, res) => {
    const { appId } = res.locals;
    const { token } = req.query;
    const { sub, username, email, services, name, type } = await verifyToken(token);

    if (type !== 'PARTNER') throw new AppError("Tài khoảng không hợp lệ !");

    let partner = await Partner.findByPk(sub);

    if (!partner) {
        partner = await Partner.create({
            username: username,
            password: username,
            email, name: name || '',
            secretKey: '',
            id: sub,
            appId
        });

        await Promise.all(services.map(async type => {
            const typeVoucher = await TypeVoucher.findOne({
                where: {
                    type,
                }
            });

            if (typeVoucher) {
                return PartnerTypeVoucher.create({
                    partnerId: partner.id,
                    typeVoucherId: typeVoucher.id,
                })
            }
        }));

    }

    res.json({
        status: 'success',
        message: 'Đăng nhập thành công !',
        data: {
            token,
            name: partner.name,
            email: partner.email
        }
    });
});