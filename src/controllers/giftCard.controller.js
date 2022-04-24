const catchAsync = require('../helpers/catchAsync.helper');
const PartnerService = require("../services/partner");

exports.getGiftCards = catchAsync(async (req, res, next) => {
	const partner = new PartnerService(res.locals.partner);
	const giftCards = await partner.getGiftCards();

	res.json({
		status: 'success',
		message: 'lấy danh sách phiếu điểm thưởng thành công !',
		data: {
			giftCards
		}
	});
});

exports.createGiftCard = catchAsync(async (req, res, next) => {
	const partner = new PartnerService(res.locals.partner);
	await partner.createGiftCard(req.body);

	res.json({
		status: 'success',
		message: 'Tạo phiếu điểm thưởng thành công !'
	})
});