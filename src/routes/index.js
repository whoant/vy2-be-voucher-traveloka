const authRoute = require('./auth.route');
const voucherRoute = require('./voucher.route');

module.exports = app => {
	app.use('/api/v1/auth', authRoute);
	app.use('/api/v1/partner/voucher', voucherRoute);
};