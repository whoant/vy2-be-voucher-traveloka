const { formatMoney } = require("../../helpers/utilities.helper");
const { Voucher, Condition, GiftCard } = require("../../models");

class PartnerService {

	constructor(partner) {
		this.partner = partner;
	}

	getPartnerId() {
		return this.partner.dataValues.id;
	}

	async getVouchers() {
		const partnerId = this.getPartnerId();
		const vouchers = await Voucher.findAll({
			where: {
				partnerId,
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
				description: this.combineDescriptionVoucher(voucher.Condition)
			}
		});
	}

	async createVoucher(voucher) {
		const newVoucher = await this.partner.createVoucher(voucher);

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
				description: this.combineDescriptionGiftCard(giftCard)
			}
		});
	}

	createGiftCard(giftCard) {
		return this.partner.createGiftCard(giftCard);
	}

	combineDescriptionVoucher(condition) {
		const { threshold, discount, maxAmount } = condition;
		const formatThreshold = formatMoney(threshold);
		const formatMaxAmount = formatMoney(maxAmount);
		if (discount === 0) {
			return `Đơn hàng trị giá trên ${formatThreshold}đ sẽ nhận được giảm giá ${formatMaxAmount}đ`;
		}
		return `Đơn hàng trị giá trên ${formatThreshold}đ sẽ nhận được giảm giá ${discount}%, không vượt quá ${formatMaxAmount}đ`;
	}

	combineDescriptionGiftCard(giftCard) {
		const { discount, typeGift } = giftCard;

		if (typeGift === 'PERCENT') {
			return `Đơn hàng sẽ được giảm giá ${discount}%`;
		}

		return `Đơn hàng sẽ được giảm giá ${formatMoney(discount)} đ`;
	}
}

module.exports = PartnerService;