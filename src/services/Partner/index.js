const {
    Voucher,
    Condition,
    GiftCard,
    PartnerTypeVoucher,
    TypeVoucher,
    UserVoucher,
    DetailUserVoucher, User, sequelize
} = require("../../models");
const { combineDescriptionGiftCard, combineDescriptionVoucher } = require("../../helpers/combineDescription.helper");
const PartnerTypeVoucherService = require("../PartnerTypeVoucher");
const { Op } = require("sequelize");
const { STATE_PROMOTION } = require("../../constants");
const VoucherService = require("../voucher");

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

    async getDetail(code) {
        const partnerVoucher = await this.getPartner();
        const Voucher = new VoucherService(partnerVoucher);
        const voucher = await Voucher.getVoucherFromCode(code);

        const attributes = ['transactionId', 'amount', 'amountAfter', 'usedAt'];

        const userVouchers = await this.getUserVoucherDone(voucher, attributes);

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

    async getAnalyzeVoucher(code) {
        const partnerVoucher = await this.getPartner();
        const Voucher = new VoucherService(partnerVoucher);
        const voucher = await Voucher.getVoucherFromCode(code);

        const userVouchers = await this.getUserVoucherDone(voucher, ['amountAfter']);

        const totalAmount = userVouchers.reduce((previousValue, currentValue) => {
            return previousValue + Number(currentValue.DetailUserVoucher.amountAfter);
        }, 0);

        return {
            totalAmount,
            totalUse: userVouchers.length,
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

}

module.exports = PartnerService;