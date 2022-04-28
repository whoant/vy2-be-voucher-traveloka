const { Voucher, UserVoucher, Condition, Partner, User } = require("../../models");
const AppError = require("../../helpers/appError.helper");
const { Op } = require("sequelize");
const { combineDescriptionVoucher } = require("../../helpers/combineDescription.helper");
const VietQR = require("../vietqr");

class UserService {
    constructor(user) {
        this.user = user;
    }

    async createUserVoucher(code, state) {
        const voucher = await this.checkVoucher(code);
        if (voucher.amount > 0) throw new AppError('Lưu voucher thất bại !');

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
                partnerId: partner.id
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
        listVoucherOwned.forEach(voucher => {
            const { Users: { UserVoucher }, title, content, voucherCode, imageUrl, Condition } = voucher;
            if (UserVoucher.state !== 'OWNED') return;

            newVouchers.push({
                title,
                content,
                voucherCode,
                imageUrl,
                description: combineDescriptionVoucher(Condition)
            });
        });

        return newVouchers;
    }

    async checkUserVoucherValid(code, typeVoucher) {
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

        const userVoucher = await UserVoucher.findOne({
            where: {
                voucherId: voucher.id
            }
        });

        if (!userVoucher || !userVoucher.state === 'OWNED') throw new AppError('Voucher không tồn tại !', 400);

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
            refCode: userVoucher.refCode,
            imageBase64,
            amount: voucher.amount,
            bin: 970416,
            accountNo: 112831,
            accountName: 'Vo Van Hoang Tuan'
        }

        return result;
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
                console.log(deductTemp);
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
            raw: true
        });

        if (!partner) throw new AppError("Loại voucher này không tồn tại !", 500);

        return partner;
    }

}

module.exports = UserService;