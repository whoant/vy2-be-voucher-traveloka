const {
    Voucher,
    Condition,
    GiftCard,
    PartnerTypeVoucher,
    TypeVoucher,
    UserVoucher,
    DetailUserVoucher, User
} = require("../../models");
const { combineDescriptionGiftCard, combineDescriptionVoucher } = require("../../helpers/combineDescription.helper");
const PartnerTypeVoucherService = require("../PartnerTypeVoucher");
const { Op } = require("sequelize");
const { STATE_PROMOTION } = require("../../constants");

class PartnerService {

    constructor(partner) {
        this.partner = partner;
    }

    getPartnerId() {
        return this.partner.dataValues.id;
    }

    async getVouchers(type) {
        const partnerVoucher = new PartnerTypeVoucherService(null);
        await partnerVoucher.find(this.getPartnerId(), type);
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
        const partnerVoucher = new PartnerTypeVoucherService(null);
        await partnerVoucher.find(this.getPartnerId(), voucher.type);
        const newVoucher = await partnerVoucher.createVoucher(voucher);

        return newVoucher.createCondition(voucher);
    }

    async getGiftCards() {
        const giftCards = await GiftCard.findAll({
            where: {
                partnerId: this.getPartnerId(),
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'partnerId']
            },
            raw: true,
            nest: true
        });

        return giftCards.map(giftCard => {
            return {
                ...giftCard,
                description: combineDescriptionGiftCard(giftCard)
            }
        });
    }

    createGiftCard(giftCard) {
        return this.partner.createGiftCard(giftCard);
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

    async getDetail({ type, code }) {
        const partnerVoucher = new PartnerTypeVoucherService(null);
        await partnerVoucher.find(this.getPartnerId(), type);
        const voucher = await Voucher.findOne({
            where: {
                PartnerTypeVoucherId: partnerVoucher.getId(),
                voucherCode: code
            },
            raw: true,
            nest: true
        });

        const userVouchers = await UserVoucher.findAll({
            where: {
                voucherId: voucher.id,
                state: STATE_PROMOTION.DONE
            },
            include: {
                model: DetailUserVoucher,
                attributes: ['transactionId', 'amount', 'amountAfter', 'usedAt']
            },
            raw: true,
            nest: true
        });

        const listUser = await Promise.all(userVouchers.map(userVoucher => {
            return User.findByPk(userVoucher.userId, {
                raw: true,
                nest: true
            });
        }));

        const result = [];
        userVouchers.forEach((userVoucher, index) => {
            const { email } = listUser[index];
            const { DetailUserVoucher: { amountAfter, amount, transactionId, usedAt }, userId } = userVoucher;
            result.push({
                index: index + 1,
                email,
                userId,
                amount,
                amountAfter,
                transactionId,
                usedAt
            });
        });
        
        return result;
    }

}

module.exports = PartnerService;