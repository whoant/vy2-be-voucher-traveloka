const { formatMoney } = require("../../helpers/utilities.helper");
const { Voucher, Condition } = require("../../models");

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

		const listVoucher = vouchers.map(voucher => {
			return {
				...voucher,
				description: this.combineDescription(voucher.Condition)
			}
		});

		return listVoucher;
	}

	async createVoucher(voucher) {
		const newVoucher = await this.partner.createVoucher(voucher);

		return newVoucher.createCondition(voucher);
	}

	combineDescription(condition) {
		const { threshold, discount, maxAmount } = condition;
		const formatThreshold = formatMoney(threshold);
		const formatMaxAmount = formatMoney(maxAmount);
		if (discount === 0) {
			return `Đơn hàng trị giá trên ${formatThreshold}đ sẽ nhận được giảm giá ${formatMaxAmount}đ`;
		}
		return `Đơn hàng trị giá trên ${formatThreshold}đ sẽ nhận được giảm giá ${discount}%, không vượt quá ${formatMaxAmount}đ`;
	}
}

module.exports = PartnerService;