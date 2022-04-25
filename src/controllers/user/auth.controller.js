const { generateToken } = require("../../helpers/jwt.helper");
const AppError = require('../../helpers/appError.helper');
const catchAsync = require('../../helpers/catchAsync.helper');
const { Partner, User } = require("../../models");

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

exports.createUser = catchAsync(async (req, res) => {
	const { userId } = req.body;
	await User.create({
		userId,
		encryptToken: 'OKEE',
		email: 'vovanhoangtuan4.2@gmail.com'
	});

	res.json({
		status: 'success',
		message: 'Tạo user thành công !',
	});
});

