const authPartnerRoute = require('./authPartner.route');
const voucherPartnerRoute = require('./voucherPartner.route');
const giftCardPartnerRoute = require('./giftCardPartner.route');

const authUserRoute = require('./authUser.route');
const voucherUserRoute = require('./voucherUser.route');

module.exports = app => {
    app.use('/api/v1/partner/auth', authPartnerRoute);
    app.use('/api/v1/partner/voucher', voucherPartnerRoute);
    app.use('/api/v1/partner/gift-card', giftCardPartnerRoute);

    app.use('/api/v1/user/auth', authUserRoute);
    app.use('/api/v1/user/voucher', voucherUserRoute);
};