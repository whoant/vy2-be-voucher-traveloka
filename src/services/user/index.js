const { Voucher, UserVoucher, Condition, Partner } = require("../../models");
const AppError = require("../../helpers/appError.helper");
const { Op } = require("sequelize");
const { combineDescriptionVoucher } = require("../../helpers/combineDescription.helper");

class UserService {
    constructor(user) {
        this.user = user;
    }

    getUserId() {
        return this.user.dataValues.id;
    }

    async getVoucherEligible(typeVoucher) {

        const partner = await Partner.findOne({
            where: {
                typeVoucher
            },
            raw: true
        });

        if (!partner) throw new Error("Loại voucher này không tồn tại !");


        const listVoucherOwned = await UserVoucher.findAll({
            where: {
                userId: this.getUserId()
            },
            attributes: ['voucherId'],
            raw: true
        });


        const vouchers = await Voucher.findAll({
            where: {
                id: {
                    [Op.notIn]: listVoucherOwned.map(({ voucherId }) => voucherId)
                },
                effectiveAt: {
                    [Op.lte]: Date.now()
                },
                expirationAt: {
                    [Op.gte]: Date.now()
                },
                partnerId: partner.id
            },
            include: {
                model: Condition,
                attributes: ['threshold', 'discount', 'maxAmount']
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'partnerId']
            },
            raw: true,
            nest: true
        });

        return vouchers.map(voucher => {
            return {
                ...voucher,
                description: combineDescriptionVoucher(voucher.Condition)
            }
        });

    }

    async createUserVoucher(voucherId, isBuy = false) {
        await this.checkVoucher(voucherId);
        let state = 'OWNED';
        if (isBuy) state = 'SPENDING'
        try {
            await UserVoucher.create({
                state,
                voucherId,
                userId: this.getUserId()
            });
        } catch (e) {
            throw new AppError('Bạn đã sở hữu voucher này !');
        }

    }

    async checkVoucherValid(voucherId, amount) {
        const voucher = await this.checkVoucher(voucherId);
        console.log(voucher.Condition);

        return await UserVoucher.findOne({
            where: {
                userId: this.getUserId(),
                voucherId
            }
        })
    }

    async getDetailVoucher(voucherId) {

        return UserVoucher.findOne({
            where: {
                userId: this.getUserId(),
                voucherId
            }
        });
    }

    async checkVoucher(voucherId) {
        const voucher = await Voucher.findByPk(voucherId);
        if (!voucher) throw new AppError('Voucher không tồn tại !', 500);
        return voucher;
    }

}

module.exports = UserService;