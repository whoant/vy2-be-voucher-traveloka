const authPartnerRoute = require('./authPartner.route');
const voucherPartnerRoute = require('./voucherPartner.route');
const giftCardPartnerRoute = require('./giftCardPartner.route');

const authUserRoute = require('./authUser.route');
const voucherUserRoute = require('./voucherUser.route');
const giftCardUserRoute = require('./giftCardUser.route');
const typeVoucherRoute = require('./typeVoucher.route');
const webhookRoute = require('./webhook.route');

module.exports = app => {
    app.use('/api/v1/partner/auth', authPartnerRoute);
    app.use('/api/v1/partner/voucher', voucherPartnerRoute);
    app.use('/api/v1/partner/gift-card', giftCardPartnerRoute);

    app.use('/api/v1/user/auth', authUserRoute);
    app.use('/api/v1/user/voucher', voucherUserRoute);
    app.use('/api/v1/user/gift-card', giftCardUserRoute);

    app.use('/api/v1/type-voucher', typeVoucherRoute);

    app.use('/api/v1/webhook', webhookRoute);
};