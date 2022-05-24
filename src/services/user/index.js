const {
    Voucher,
    UserVoucher,
    Condition, sequelize, TypeVoucher, PartnerTypeVoucher, User, Partner,
} = require("../../models");
const AppError = require("../../helpers/appError.helper");
const { Op } = require("sequelize");
const { combineDescriptionVoucher } = require("../../helpers/combineDescription.helper");
const clientRedis = require('../../config/redis');
const PartnerTypeVoucherService = require("../PartnerTypeVoucher");
const { STATE_PROMOTION } = require("../../constants");
const { sha256 } = require("../../helpers/hash.helper");
const { v4: uuidv4 } = require('uuid');
const paypalClient = require("../../config/paypal");
const paypal = require("@paypal/checkout-server-sdk");
const { VNDtoUSD } = require("../../helpers/currencyConverter.helper");

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

    async getVoucherCanBuy(user, type) {
        const typeVoucher = await TypeVoucher.findOne({
            where: {
                type,
            },
        });

        const partnerTypeVoucher = await PartnerTypeVoucher.findAll({
            where: {
                typeVoucherId: typeVoucher.id
            },
            attributes: {
                include: ['id']
            },
            raw: true,
            nest: true
        });

        const listVouchersExist = await UserVoucher.findAll({
            where: {
                userId: user.id
            },
            attributes: {
                include: ['voucherId']
            }
        });

        const vouchers = await Voucher.findAll({
            where: {
                PartnerTypeVoucherId: {
                    [Op.in]: partnerTypeVoucher.map(item => item.id)
                },
                amount: {
                    [Op.gt]: 0
                },
                effectiveAt: {
                    [Op.lte]: Date.now()
                },
                expirationAt: {
                    [Op.gte]: Date.now()
                },
                id: {
                    [Op.notIn]: listVouchersExist.map(item => item.voucherId)
                }
            },
            include: [{
                model: Condition,
                attributes: ['threshold', 'discount', 'maxAmount']
            }, {
                model: PartnerTypeVoucher,

            }],
            attributes: {
                include: ['id', 'title', 'content', 'voucherCode', 'imageUrl', 'amount', 'effectiveAt', 'expirationAt']
            },
            raw: true,
            nest: true
        });


        return vouchers.map(voucher => {
            const { id, title, content, effectiveAt, expirationAt, amount, imageUrl, voucherCode } = voucher;

            return {
                id, title, content, effectiveAt, expirationAt, amount, imageUrl, voucherCode,
                description: combineDescriptionVoucher(voucher.Condition),
                partnerId: voucher.PartnerTypeVoucher.partnerId
            }
        });

    }

    async preBuyVoucher(code) {
        const voucher = await Voucher.findOne({
            where: {
                voucherCode: code,
                PartnerTypeVoucherId: this.partnerTypeVoucher.getId(),
                amount: {
                    [Op.gt]: 0
                },
                effectiveAt: {
                    [Op.lte]: Date.now()
                },
                expirationAt: {
                    [Op.gte]: Date.now()
                },

            },
            include: [{
                model: Condition,
                attributes: ['threshold', 'discount', 'maxAmount']
            }],
        });

        if (!voucher) throw new AppError("Voucher không tồn tại !", 500);

        const countUserVoucher = await UserVoucher.count({
            where: {
                voucherId: voucher.id,
            }
        });

        const countRedis = await clientRedis.keys(`${voucher.id}|*`);

        if (countUserVoucher + countRedis.length > voucher.limitUse) {
            throw new AppError("Voucher này hiện tại đang hết !", 500);
        }

        const userVoucher = await UserVoucher.findOne({
            where: {
                voucherId: voucher.id,
                userId: this.user.id
            }
        });

        if (userVoucher) throw new AppError("Voucher này bạn đã sở hữu !", 500);

        const transactionId = `${voucher.id}|${this.user.id}`;

        const isExists = await clientRedis.exists(transactionId);
        if (isExists) throw new AppError("Bạn đang thực hiện giao dịch với voucher này !", 500);

        await clientRedis.set(transactionId, JSON.stringify({
            voucherId: voucher.id,
            userId: this.user.id,
            email: this.user.email,
            amount: voucher.amount,
            title: voucher.title,
            description: combineDescriptionVoucher(voucher.Condition)
        }), {
            EX: 60 * 5
        });

        return transactionId;
    }

    async buyVoucher(transactionId) {
        return new Promise(async (resolve, reject) => {
            try {
                const isExists = await clientRedis.exists(transactionId);
                if (!isExists) throw new AppError("Giao dịch này không tồn tại !", 500);

                const { amount, title, voucherId, userId } = JSON.parse(await clientRedis.get(transactionId));

                const request = new paypal.orders.OrdersCreateRequest();
                request.prefer('return=representation');
                request.requestBody({
                    intent: 'CAPTURE',
                    purchase_units: [
                        {
                            amount: {
                                currency_code: 'USD',
                                value: VNDtoUSD(amount),
                                breakdown: {
                                    item_total: {
                                        currency_code: 'USD',
                                        value: VNDtoUSD(amount)
                                    }
                                }
                            },
                            items: [
                                {
                                    name: title,
                                    unit_amount: {
                                        currency_code: 'USD',
                                        value: VNDtoUSD(amount)
                                    },
                                    quantity: 1
                                }
                            ]
                        }
                    ]
                });

                const order = await paypalClient.execute(request);

                const paymentId = order.result.id;

                const ttl = await clientRedis.ttl(transactionId);
                await clientRedis.set(paymentId, JSON.stringify({ amount, title, voucherId, userId }), {
                    EX: ttl
                });
                
                resolve(paymentId);
            } catch (e) {
                reject(e);
            }
        });
    }

}

module.exports = UserService;