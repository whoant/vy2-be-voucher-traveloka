const {generateToken} = require("../helpers/jwt.helper");
const AppError = require('../helpers/appError.helper');
const catchAsync = require('../helpers/catchAsync.helper');

exports.login = catchAsync(async (req, res) => {
    const {username, password} = req.body;
    if (!username || !password) throw new AppError('Missing data', 400);

    const token = await generateToken({username, password});
    res.json({
        status: 'success',
        message: 'OKE',
        data: {
            token
        }
    });
});

exports.register = catchAsync(async (req, res) => {
    const {username, password} = req.body;
    if (!username || !password) throw new AppError('Missing data', 400);

    const token = await generateToken({username, password});
    res.json({
        status: 'success',
        message: 'OKE',
        data: {
            token
        }
    });
});

