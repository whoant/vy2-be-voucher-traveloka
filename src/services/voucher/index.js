const { Voucher, UserVoucher, User, Partner } = require("../../models");
const AppError = require("../../helpers/appError.helper");
const { Op } = require("sequelize/types");

class VoucherService {
    constructor(partner) {
        this.partner = partner;
    }

    async getVoucherFromCode(code) {
        const voucher = await Voucher.findOne({
            where: {
                voucherCode: code,
                partnerId: this.partner.id
            },
        });

        if (!voucher) throw new AppError("Voucher không tồn tại !", 400);

        return voucher;
    }

    async getUserVoucher(voucher, userId) {
        const user = await User.findOne({
            where: {
                userId,
            }
        });

        const userVoucher = await UserVoucher.findOne({
            where: {
                voucherId: voucher.id,
                userId: user.id
            },
        });

        if (!userVoucher) throw new AppError("Voucher không tồn tại !", 400);

        return userVoucher;
    }

    async getVoucherLiveFromType(code, typeVoucher) {
        return Voucher.findOne({
            where: {
                voucherCode: code,
                effectiveAt: {
                    [Op.lte]: Date.now()
                },
                expirationAt: {
                    [Op.gte]: Date.now()
                },
            },
            include: {
                model: Partner,
                where: {
                    typeVoucher
                }
            }
        });
    }

}

module.exports = VoucherService;