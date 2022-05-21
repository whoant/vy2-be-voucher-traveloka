const {
    Voucher,
    UserVoucher,
    Condition, sequelize,
} = require("../../models");
const AppError = require("../../helpers/appError.helper");
const { Op } = require("sequelize");
const { combineDescriptionVoucher } = require("../../helpers/combineDescription.helper");
const VietQR = require("../vietqr");
const clientRedis = require('../../config/redis');
const PartnerTypeVoucherService = require("../PartnerTypeVoucher");
const { STATE_PROMOTION } = require("../../constants");
const { sha256 } = require("../../helpers/hash.helper");

class UserService {
    constructor(user, partnerTypeVoucher) {
        this.user = user;
        this.partnerTypeVoucher = partnerTypeVoucher;
    }

    async getVoucherEligible() {
        const listVoucherDone = (await UserVoucher.findAll({
            where: {
                userId: this.getUserId(),
                state: STATE_PROMOTION.DONE,
            },
            attributes: ['voucherId'],
            raw: true
        })).map(({ voucherId }) => voucherId);

        const listUserVoucherHave = await UserVoucher.findAll({
            where: {
                userId: this.getUserId(),
            },
            attributes: ['voucherId'],
            raw: true
        });

        const listVoucherNotBuy = (await Voucher.findAll({
            where: {
                amount: {
                    [Op.gt]: 0
                },
                id: {
                    [Op.notIn]: listUserVoucherHave.map(({ voucherId }) => voucherId)
                }
            },
            attributes: ['id'],
            raw: true
        })).map(({ id }) => id);

        const listVoucherDiff = [...new Set([...listVoucherDone, ...listVoucherNotBuy])]

        const vouchers = await Voucher.findAll({
            where: {
                id: {
                    [Op.notIn]: listVoucherDiff
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
        const amountAfter = await this.checkVoucherCondition(voucher, amount);
        const cacheVoucherId = this.generateVoucherId(code, partnerTypeVoucher.getId());
        const isExists = await clientRedis.exists(cacheVoucherId);

        if (!isExists) {
            await clientRedis.set(cacheVoucherId, JSON.stringify({
                transactionId,
                voucherId: voucher.id,
                userId: this.getUserId(),
                amount,
                isBuy: voucher.isBuy(),
                amountAfter: amount - amountAfter
            }), {
                EX: 60 * 5
            });
        } else {
            const parseCache = JSON.parse(await clientRedis.get(cacheVoucherId));
            if (parseCache.transactionId !== transactionId) {
                return false;
            }
        }

        return cacheVoucherId;
    }

    async cancelOrder(orderId) {
        await clientRedis.del(orderId);

        return true;
    }

    async updateStateVoucher(orderId) {
        let orderInfo = await clientRedis.get(orderId);

        if (!orderInfo) return false;
        const { userId, voucherId, transactionId, amount, amountAfter, isBuy } = JSON.parse(orderInfo);

        try {
            return await sequelize.transaction(async t => {
                let newUserVoucher;

                if (isBuy) {
                    newUserVoucher = await UserVoucher.findOne({
                        where: {
                            userId,
                            voucherId,
                        }
                    });
                    newUserVoucher.state = STATE_PROMOTION.DONE;
                    newUserVoucher.save({ transaction: t });

                } else {
                    newUserVoucher = await UserVoucher.create({
                        userId,
                        voucherId,
                        state: STATE_PROMOTION.DONE
                    }, {
                        transaction: t
                    });
                }

                await Promise.all([
                    clientRedis.del(orderId),
                    newUserVoucher.createDetailUserVoucher({
                        transactionId, amount, amountAfter,
                    }, {
                        transaction: t
                    })
                ]);

                return true;
            });
        } catch (e) {

            return Promise.reject(e);
        }
    }

    getUserId() {
        return this.user.dataValues.id;
    }

    async checkVoucherCondition(voucher, amount) {
        const condition = await voucher.getCondition();

        if (Number(amount) < Number(condition.threshold)) {
            throw new AppError("Không đủ điều kiện", 500);
        }

        let deduct = Number(condition.maxAmount);
        if (Number(condition.discount) > 0) {
            let deductTemp = Number(amount) * Number(condition.discount) / 100;
            if (deductTemp < deduct) deduct = deductTemp;
        }

        return Math.round(deduct);
    }

    generateVoucherId(code, partnerTypeVoucherId) {
        return sha256(`${this.getUserId()}:${code}:${partnerTypeVoucherId}`);
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

        if (!voucher) throw new AppError("Voucher không tồn tại !", 500);
        const userVoucher = await UserVoucher.findOne({
            where: {
                voucherId: voucher.id,
                userId: this.getUserId()
            }
        });


        if ((!userVoucher && !voucher.isBuy()) || (userVoucher && userVoucher.isOwned())) return voucher;

        throw new AppError('Voucher không tồn tại !', 500);
    }

}

module.exports = UserService;