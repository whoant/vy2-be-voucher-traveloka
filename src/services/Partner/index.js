const { Voucher, Condition, GiftCard } = require("../../models");
const { combineDescriptionGiftCard, combineDescriptionVoucher } = require("../../helpers/combineDescription.helper");
const PartnerTypeVoucherService = require("../PartnerTypeVoucher");

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


}

module.exports = PartnerService;