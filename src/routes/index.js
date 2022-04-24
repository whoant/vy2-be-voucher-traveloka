const authRoute = require('./auth.route');
const voucherPartnerRoute = require('./voucherPartner.route');
const giftCardPartnerRoute = require('./giftCardPartner.route');

module.exports = app => {
	app.use('/api/v1/partner/auth', authRoute);
	app.use('/api/v1/partner/voucher', voucherPartnerRoute);
	app.use('/api/v1/partner/gift-card', giftCardPartnerRoute);
};