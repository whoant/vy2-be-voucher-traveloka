const AppError = require('../helpers/appError.helper');
const catchAsync = require('../helpers/catchAsync.helper');
const PartnerService = require("../services/partner");

exports.getVouchers = catchAsync(async (req, res, next) => {
	const partner = new PartnerService(res.locals.partner);
	const vouchers = await partner.getVouchers();

	res.json({
		status: 'success',
		message: 'Lấy danh sách voucher thành công !',
		data: {
			vouchers
		}
	});
});

exports.createVoucher = catchAsync(async (req, res, next) => {
	const partner = new PartnerService(res.locals.partner);
	await partner.createVoucher(req.body);

	res.json({
		status: 'success',
		message: 'Tạo voucher thành công !',
	});
});