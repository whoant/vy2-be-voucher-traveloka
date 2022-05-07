const { Voucher, UserVoucher, Condition, Partner, User } = require("../../models");
const AppError = require("../../helpers/appError.helper");
const { Op } = require("sequelize");
const { combineDescriptionVoucher } = require("../../helpers/combineDescription.helper");
const VietQR = require("../vietqr");
const clientRedis = require('../../config/redis');

class UserService {
    constructor(user) {
        this.user = user;
    }

    async createUserVoucher(code, state) {
        const voucher = await this.checkVoucher(code);

        if (voucher.isBuy()) throw new AppError('Voucher này bạn phải mua mới sử dụng được !');

        try {
            await UserVoucher.create({
                state: 'OWNED',
                voucherId: voucher.id,
                userId: this.getUserId()
            });
        } catch (e) {
            throw new AppError('Bạn đã sở hữu voucher này !');
        }

    }

    async getVoucherEligible(typeVoucher) {
        const partner = await this.checkTypeVoucher(typeVoucher);

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
                exclude: ['createdAt', 'updatedAt', 'partnerId', 'id']
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

    async getListVoucher(typeVoucher) {
        const partner = await this.checkTypeVoucher(typeVoucher);
        const listVoucherOwned = await Voucher.findAll({
            where: {
                partnerId: partner.id,
                effectiveAt: {
                    [Op.lte]: Date.now()
                },
                expirationAt: {
                    [Op.gte]: Date.now()
                },
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            include: [
                {
                    model: User,
                    right: true,
                    attributes: []
                },
                {
                    model: Condition,
                    attributes: ['threshold', 'discount', 'maxAmount']
                }],
            nest: true,
            raw: true
        });
        const newVouchers = [];
        for (const voucher of listVoucherOwned) {
            const { Users: { UserVoucher }, title, content, voucherCode, imageUrl, Condition } = voucher;
            if (this.getUserId() !== UserVoucher.userId) continue;
            if (UserVoucher.state !== 'OWNED') continue;
            const isExists = await clientRedis.exists(this.generateVoucherId(voucherCode, typeVoucher));
            if (isExists) return;

            newVouchers.push({
                title,
                content,
                voucherCode,
                imageUrl,
                description: combineDescriptionVoucher(Condition)
            });
        }

        return newVouchers;
    }

    async checkUserVoucherValid(code, typeVoucher) {
        const voucher = await Voucher.findOne({
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

        if (!voucher) throw new AppError("Voucher không tồn tại !", 400);
        const userVoucher = await UserVoucher.findOne({
            where: {
                voucherId: voucher.id,
                userId: this.getUserId()
            }
        });

        if (!userVoucher || !userVoucher.isOwned()) throw new AppError('Voucher không tồn tại !', 400);

        return voucher;
    }

    async buyVoucher(code, typeVoucher) {
        const voucher = await Voucher.findOne({
            where: {
                voucherCode: code
            },
            include: {
                model: Partner,
                where: {
                    typeVoucher
                }
            }
        });
        if (!voucher) throw new AppError("Voucher không tồn tại !", 400);

        const userVoucher = await UserVoucher.create({
            voucherId: voucher.id,
            userId: this.getUserId(),
        });

        const info = {
            bin: 970416,
            accountNo: 112831,
            amount: voucher.amount,
            description: userVoucher.refCode,
            accountName: encodeURIComponent('Vo Van Hoang Tuan')
        };

        const imageBase64 = await VietQR.generateQR(info)

        const result = {
            ya: userVoucher.refCode,
            imageBase64,
            amount: voucher.amount,
            bin: 970416,
            accountNo: 112831,
            accountName: 'Vo Van Hoang Tuan'
        }

        return result;
    }


    async preOrder(orderInfo) {
        const { typeVoucher, code } = orderInfo;
        await this.checkUserVoucherValid(code, typeVoucher);
        await clientRedis.set(this.generateVoucherId(code, typeVoucher), JSON.stringify({
            typeVoucher,
            code,
        }), {
            EX: 60 * 5
        });

        return true;
    }

    async cancelOrder(orderInfo) {
        const { typeVoucher, code } = orderInfo;
        await clientRedis.del(this.generateVoucherId(code, typeVoucher));

        return true;
    }

    getUserId() {
        return this.user.dataValues.id;
    }

    async checkVoucherCondition(code, typeVoucher, amount) {
        const voucher = await this.checkUserVoucherValid(code, typeVoucher);
        const condition = await voucher.getCondition();
        const res = {
            status: 'Không đủ điều kiện'
        }

        if (Number(amount) >= Number(condition.threshold)) {
            res.status = 'Đủ điều kiện';
            let deduct = Number(condition.maxAmount);
            if (Number(condition.discount) > 0) {
                let deductTemp = Number(amount) * Number(condition.discount) / 100;
                if (deductTemp < deduct) deduct = deductTemp;
            }
            res.amount = deduct;
        }
        return res;

    }

    async getDetailVoucher(voucherId) {

        return UserVoucher.findOne({
            where: {
                userId: this.getUserId(),
                voucherId
            }
        });
    }

    async checkVoucher(code) {
        const voucher = await Voucher.findOne({
            where: {
                voucherCode: code
            }
        });
        if (!voucher) throw new AppError('Voucher không tồn tại !', 500);
        return voucher;
    }

    async checkTypeVoucher(typeVoucher) {
        const partner = await Partner.findOne({
            where: {
                typeVoucher
            },
        });

        if (!partner) throw new AppError("Loại voucher này không tồn tại !", 500);

        return partner;
    }

    generateVoucherId(code, typeVoucher) {
        return `${this.getUserId()}:${code}:${typeVoucher}`;
    }

}

module.exports = UserService;