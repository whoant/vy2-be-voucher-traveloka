const {
    Voucher,
    UserVoucher,
    Condition,
} = require("../../models");
const AppError = require("../../helpers/appError.helper");
const { Op } = require("sequelize");
const { combineDescriptionVoucher } = require("../../helpers/combineDescription.helper");
const VietQR = require("../vietqr");
const clientRedis = require('../../config/redis');
const PartnerTypeVoucherService = require("../PartnerTypeVoucher");
const { STATE_PROMOTION } = require("../../constants");

class UserService {
    constructor(user, partnerTypeVoucher) {
        this.user = user;
        this.partnerTypeVoucher = partnerTypeVoucher;
    }

    async getVoucherEligible() {
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
                PartnerTypeVoucherId: this.partnerTypeVoucher.getId()
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

    async preOrder(orderInfo) {
        const { code, transactionId, amount } = orderInfo;
        const partnerTypeVoucher = this.partnerTypeVoucher;

        const voucher = await this.checkVoucherValid(code);
        const voucherCondition = await this.checkVoucherCondition(voucher, amount);
        const cacheVoucherId = this.generateVoucherId(code, partnerTypeVoucher.getId(), transactionId);
        const isExists = await clientRedis.exists(cacheVoucherId);

        if (isExists) return false;
        await clientRedis.set(cacheVoucherId, JSON.stringify({
            transactionId,
            voucherId: voucher.id,
            userId: this.getUserId(),
            amount,
            amountAfter: voucherCondition.amount
        }), {
            EX: 60 * 5
        });

        return cacheVoucherId;
    }

    async cancelOrder(orderId) {
        await clientRedis.del(orderId);

        return true;
    }

    async updateStateVoucher(orderId) {
        let orderInfo = await clientRedis.get(orderId);
        if (!orderInfo) return false;
        const { userId, voucherId, transactionId, amount, amountAfter } = JSON.parse(orderInfo);
        const newUserVoucher = await UserVoucher.create({
            userId,
            voucherId,
            state: STATE_PROMOTION.DONE
        });

        await Promise.all([
            clientRedis.del(orderId),
            newUserVoucher.createDetailUserVoucher({
                transactionId, amount, amountAfter,
            })
        ]);

        return true;
    }

    getUserId() {
        return this.user.dataValues.id;
    }

    async checkVoucherCondition(voucher, amount) {
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

    generateVoucherId(code, partnerTypeVoucherId, transactionId) {
        return `${this.getUserId()}:${code}:${partnerTypeVoucherId}:${transactionId}`;
    }

    async checkVoucherValid(code) {
        const voucher = await Voucher.findOne({
            where: {
                voucherCode: code,
                effectiveAt: {
                    [Op.lte]: Date.now()
                },
                expirationAt: {
                    [Op.gte]: Date.now()
                },
                PartnerTypeVoucherId: this.partnerTypeVoucher.getId()
            }
        });

        if (!voucher) throw new AppError("Voucher không tồn tại !", 400);
        const userVoucher = await UserVoucher.findOne({
            where: {
                voucherId: voucher.id,
                userId: this.getUserId()
            }
        });
        if (!userVoucher || userVoucher.isOwned()) return voucher;

        throw new AppError('Voucher không tồn tại !', 400);
    }

}

module.exports = UserService;