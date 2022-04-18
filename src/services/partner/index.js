const { formatMoney } = require("../../helpers/utilities.helper");

class PartnerService {

	constructor(partner) {
		this.partner = partner;
	}

	async getVouchers() {
		const vouchers = await this.partner.getVouchers();
		const conditions = await Promise.all(vouchers.map(voucher => {
			return voucher.getCondition();
		}));

		const voucherConditon = [];
		vouchers.forEach((voucher, position) => {
			if (conditions[position] === null) return;
			voucherConditon.push({
				...voucher.dataValues,
				message: this.combineMessage(conditions[position].dataValues),
				condition: {
					...conditions[position].dataValues
				}
			});
		});

		return voucherConditon;
	}

	async createVoucher(voucher) {
		const newVoucher = await this.partner.createVoucher(voucher);

		return newVoucher.createCondition(voucher);
	}


	combineMessage(condition) {
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