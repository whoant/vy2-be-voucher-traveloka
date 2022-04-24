const { generateToken } = require("../helpers/jwt.helper");
const AppError = require('../helpers/appError.helper');
const catchAsync = require('../helpers/catchAsync.helper');
const { Partner } = require("../models");

exports.login = catchAsync(async (req, res) => {
	const { username, password } = req.body;
	const partner = await Partner.findOne({
		where: {
			username, password
		}
	});

	if (!partner) throw new AppError('Partner không tồn tại !');
	const token = await generateToken(partner.id);

	res.json({
		status: 'success',
		message: 'Đăng nhập thành công !',
		data: {
			token
		}
	});
});

exports.createPartner = catchAsync(async (req, res) => {
	const { username, password, secretKey } = req.body;
	if (!secretKey) throw new AppError('Vui lòng kiểm tra lại tài khoản của mình !', 400);
	await Partner.create({
		username, password, secretKey
	});

	res.json({
		status: 'success',
		message: 'Tạo partner thành công !',
	});
});

