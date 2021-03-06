const { Voucher, UserVoucher, User, Partner } = require("../../models");
const AppError = require("../../helpers/appError.helper");
const { Op } = require("sequelize");

class VoucherService {
    constructor(partnerVoucher) {
        this.partnerTypeVoucher = partnerVoucher;
    }

    async getVoucherFromCode(code) {
        const voucher = await Voucher.findOne({
            where: {
                voucherCode: code,
                PartnerTypeVoucherId: this.partnerTypeVoucher.getId(),
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