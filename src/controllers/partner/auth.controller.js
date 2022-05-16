const { generateToken } = require("../../helpers/jwt.helper");
const AppError = require('../../helpers/appError.helper');
const catchAsync = require('../../helpers/catchAsync.helper');
const { Partner, TypeVoucher, PartnerTypeVoucher } = require("../../models");

exports.login = catchAsync(async (req, res) => {
    const { username, password } = req.body;
    const partner = await Partner.findOne({
        where: {
            username, password
        }
    });

    if (!partner) throw new AppError('Partner không tồn tại !');
    const token = await generateToken(partner.id);

    res.json({
        status: 'success',
        message: 'Đăng nhập thành công !',
        data: {
            token
        }
    });
});

exports.createPartner = catchAsync(async (req, res) => {
    const { username, password, typeVouchers } = req.body;

    const newPartner = await Partner.create({
        username, password, secretKey: ''
    });


    await Promise.all(typeVouchers.map(async type => {
        const typeVoucher = await TypeVoucher.findOne({
            where: {
                type
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

