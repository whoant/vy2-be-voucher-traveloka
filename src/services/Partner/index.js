const {
    Voucher,
    Condition,
    GiftCard,
    PartnerTypeVoucher,
    TypeVoucher,
    UserVoucher,
    DetailUserVoucher, User, sequelize, UserGiftCard, DetailUserGiftCard
} = require("../../models");
const { combineDescriptionGiftCard, combineDescriptionVoucher } = require("../../helpers/combineDescription.helper");
const PartnerTypeVoucherService = require("../PartnerTypeVoucher");
const { Op } = require("sequelize");
const { STATE_PROMOTION } = require("../../constants");
const VoucherService = require("../voucher");
const GiftCardService = require("../GiftCard");

class PartnerService {

    constructor(partner, type) {
        this.partner = partner;
        this.type = type;
    }

    getPartnerId() {
        return this.partner.dataValues.id;
    }

    async getVouchers() {
        const partnerVoucher = await this.getPartner();
        const vouchers = await Voucher.findAll({
            where: {
                PartnerTypeVoucherId: partnerVoucher.getId(),
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

    async createVoucher(voucher) {
        const partnerVoucher = await this.getPartner();
        const newVoucher = await partnerVoucher.createVoucher(voucher);

        return newVoucher.createCondition(voucher);
    }

    async getTypeVouchers() {
        const listTypeVoucherId = (await PartnerTypeVoucher.findAll({
            where: {
                partnerId: this.getPartnerId(),
                isActive: true
            },
            attributes: ['typeVoucherId'],
            raw: true,
            nest: true
        })).map(typeVoucher => typeVoucher.typeVoucherId);

        const listTypeVoucher = await TypeVoucher.findAll({
            where: {
                id: {
                    [Op.in]: listTypeVoucherId
                }
            },
            attributes: ['name', 'type'],
            raw: true,
            nest: true
        })

        return listTypeVoucher;
    }

    async getDetail(code, typeView) {
        const partnerVoucher = await this.getPartner();
        const Voucher = new VoucherService(partnerVoucher);
        const voucher = await Voucher.getVoucherFromCode(code);

        const attributes = ['transactionId', 'amount', 'amountAfter', 'usedAt'];

        let userVouchers = [];

        if (typeView === 'buy') {
            userVouchers = await UserVoucher.findAll({
                where: {
                    voucherId: voucher.id,
                },
                include: {
                    model: DetailUserVoucher,
                },
                raw: true,
                nest: true
            });
        } else {
            userVouchers = await this.getUserVoucherDone(voucher, attributes);
        }


        const listUser = await Promise.all(userVouchers.map(userVoucher => {
            return User.findByPk(userVoucher.userId, {
                raw: true,
                nest: true
            });
        }));

        const result = [];
        userVouchers.forEach((userVoucher, index) => {
            const { email } = listUser[index];
            const { DetailUserVoucher, userId } = userVoucher;

            result.push({
                index: index + 1,
                email,
                userId,
                amount: DetailUserVoucher?.amount || 0,
                amountAfter: DetailUserVoucher?.amountAfter || 0,
                transactionId: DetailUserVoucher?.transactionId || 0,
                usedAt: DetailUserVoucher?.usedAt || userVoucher.createdAt,
            });
        });

        return result;
    }

    async getAnalyzeVoucher(code) {
        const partnerVoucher = await this.getPartner();
        const Voucher = new VoucherService(partnerVoucher);
        const voucher = await Voucher.getVoucherFromCode(code);

        const userVouchers = await this.getUserVoucherDone(voucher, ['amountAfter']);
        const totalBuy = await UserVoucher.count({
            where: {
                voucherId: voucher.id,
                createdAt: {
                    [Op.lte]: sequelize.col('updatedAt')
                }
            },
            raw: true,
            nest: true
        });

        const totalAmount = userVouchers.reduce((previousValue, currentValue) => {
            return previousValue + Number(currentValue.DetailUserVoucher.amountAfter);
        }, 0);

        return {
            totalAmount,
            totalUsed: userVouchers.length,
            totalBuy
        };

    }

    async getCountVouchers() {
        const partnerTypeVoucherId = (await PartnerTypeVoucher.findAll({
            where: {
                partnerId: this.partner.id,
            },
        })).map(item => item.id);

        const count = await Voucher.findAll({
            where: {
                PartnerTypeVoucherId: {
                    [Op.in]: partnerTypeVoucherId
                }
            }
        })

        return count.length || 0;
    }

    async getCountGiftCards() {
        const partnerTypeId = (await PartnerTypeVoucher.findAll({
            where: {
                partnerId: this.partner.id,
            },
        })).map(item => item.id);

        const count = await GiftCard.findAll({
            where: {
                partnerTypeId: {
                    [Op.in]: partnerTypeId
                }
            }
        })

        return count.length || 0;
    }

    async getPartner() {
        const partnerVoucher = new PartnerTypeVoucherService(null);
        await partnerVoucher.find(this.getPartnerId(), this.type);
        return partnerVoucher;
    }

    async getUserVoucherDone(voucher, attributes) {
        return UserVoucher.findAll({
            where: {
                voucherId: voucher.id,
                state: STATE_PROMOTION.DONE
            },
            include: {
                model: DetailUserVoucher,
                attributes
            },
            raw: true,
            nest: true
        });
    }

    async getUserGiftDone(giftCard, attributes) {
        return UserGiftCard.findAll({
            where: {
                giftCardId: giftCard.id,
                state: STATE_PROMOTION.DONE
            },
            include: {
                model: DetailUserGiftCard,
                attributes
            },
            raw: true,
            nest: true
        });
    }

    async getGiftCards() {
        const partnerVoucher = await this.getPartner();
        const giftCards = await GiftCard.findAll({
            where: {
                PartnerTypeId: partnerVoucher.getId(),
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'partnerTypeId']
            },
            raw: true,
            nest: true
        });


        return giftCards.map(giftCard => {
            return {
                ...giftCard,
                description: combineDescriptionVoucher(giftCard)
            }
        });
    }

    async createGiftCard(giftCard) {
        const partnerGift = await this.getPartner();
        return partnerGift.createGiftCard(giftCard);
    }

    async getDetailGift(code, typeView) {
        const partnerVoucher = await this.getPartner();
        const GiftCard = new GiftCardService(partnerVoucher);
        const gift = await GiftCard.getGiftFromCode(code);

        const attributes = ['transactionId', 'amount', 'amountAfter', 'usedAt'];

        let userGiftCards = [];

        if (typeView === 'exchange') {
            userGiftCards = await UserGiftCard.findAll({
                where: {
                    giftCardId: gift.id,
                },
                include: {
                    model: DetailUserGiftCard,
                },
                raw: true,
                nest: true
            });
        } else {
            userGiftCards = await this.getUserGiftDone(gift, attributes);
        }

        const listUser = await Promise.all(userGiftCards.map(userGiftCard => {
            return User.findByPk(userGiftCard.userId, {
                raw: true,
                nest: true
            });
        }));

        const result = [];
        userGiftCards.forEach((userGiftCard, index) => {
            const { email } = listUser[index];
            const { DetailUserGiftCard, userId } = userGiftCard;
            result.push({
                index: index + 1,
                email,
                userId,
                amount: DetailUserGiftCard?.amount || 0,
                amountAfter: DetailUserGiftCard?.amountAfter || 0,
                transactionId: DetailUserGiftCard?.transactionId || 0,
                usedAt: DetailUserGiftCard?.usedAt || userGiftCard.createdAt
            });
        });

        return result;
    }

    async getAnalyzeGiftCard(code) {
        const partnerVoucher = await this.getPartner();
        const GiftCard = new GiftCardService(partnerVoucher);
        const gift = await GiftCard.getGiftFromCode(code);

        const totalUserGiftCard = await UserGiftCard.count({
            where: {
                giftCardId: gift.id,
            }
        });

        const userGiftCards = await this.getUserGiftDone(gift, ['amountAfter']);

        const totalAmount = userGiftCards.reduce((previousValue, currentValue) => {
            return previousValue + Number(currentValue.DetailUserGiftCard.amountAfter);
        }, 0);

        return {
            totalAmount,
            totalUsed: userGiftCards.length,
            totalExchange: totalUserGiftCard
        };
    }

}

module.exports = PartnerService;