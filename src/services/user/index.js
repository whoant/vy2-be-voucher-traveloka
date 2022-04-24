const { Voucher, UserVoucher } = require("../../models");

class UserService {
	constructor(user) {
		this.user = user;
	}

	getUserId() {
		return this.user.dataValues.id;
	}

	async createUserVoucher(voucherId, isBuy = false) {
		const voucher = await Voucher.findByPk(voucherId);
		if (!voucher) throw new Error('Voucher không tồn tại !');
		let state = 'OWNED';
		if (isBuy) state = 'SPENDING'

		return this.user.createUserVoucher({
			state,
			voucherId,
		});
	}

	async getDetailVoucher(voucherId) {
		
		return UserVoucher.findOne({
			where: {
				userId: this.getUserId(),
				voucherId
			}
		});
	}

}

module.exports = UserService;