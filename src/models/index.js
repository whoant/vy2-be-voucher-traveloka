const { Sequelize } = require('sequelize');
const { DB_URI } = require('../config');

const UserModel = require('./user.model');
const VoucherModel = require('./voucher.model');
const PartnerModel = require('./partner.model');
const UserVoucherModel = require('./userVoucher.model');
const VarModel = require('./var.model');
const ConditionModel = require('./condition.model');
const PaymentModel = require('./payment.model');
const DetailUserVoucherModel = require('./detailUserVoucher.model');
const GiftCardModel = require('./giftCard.model');
const UserGiftCardModel = require('./userGiftCard.model');
const DetailUserGiftCardModel = require('./detailUserGiftCard.model');
const PartnerTypeVoucherModel = require('./partnerTypeVoucher.model');
const TypeVoucherModel = require('./typeVoucher.model');

const sequelize = new Sequelize(DB_URI);

const User = UserModel(sequelize);
const Voucher = VoucherModel(sequelize);
const Partner = PartnerModel(sequelize);
const UserVoucher = UserVoucherModel(sequelize);
const Condition = ConditionModel(sequelize);
const Var = VarModel(sequelize);
const Payment = PaymentModel(sequelize);
const DetailUserVoucher = DetailUserVoucherModel(sequelize);
const GiftCard = GiftCardModel(sequelize);
const UserGiftCard = UserGiftCardModel(sequelize);
const DetailUserGiftCard = DetailUserGiftCardModel(sequelize);
const PartnerTypeVoucher = PartnerTypeVoucherModel(sequelize);
const TypeVoucher = TypeVoucherModel(sequelize);

Partner.belongsToMany(TypeVoucher, {
    through: PartnerTypeVoucher,
    foreignKey: 'partnerId',
    otherKey: 'typeVoucherId'
});

TypeVoucher.belongsToMany(Partner, {
    through: PartnerTypeVoucher,
    foreignKey: 'typeVoucherId',
    otherKey: 'partnerId'
});

PartnerTypeVoucher.hasMany(Voucher, {
    foreignKey: 'PartnerTypeVoucherId',
});

Voucher.belongsTo(PartnerTypeVoucher, {
    foreignKey: 'PartnerTypeVoucherId',
});

Voucher.hasOne(Condition, {
    foreignKey: 'voucherId'
});

Condition.belongsTo(Voucher, {
    foreignKey: 'voucherId'
});

User.belongsToMany(Voucher, {
    through: UserVoucher,
    foreignKey: 'userId',
    otherKey: 'voucherId'
});

Voucher.belongsToMany(User, {
    through: UserVoucher,
    foreignKey: 'voucherId',
    otherKey: 'userId'
});

UserVoucher.hasOne(Payment, {
    foreignKey: 'userVoucherId'
});

Payment.belongsTo(UserVoucher, {
    foreignKey: 'userVoucherId'
});

UserVoucher.hasOne(DetailUserVoucher, {
    foreignKey: 'userVoucherId'
});

DetailUserVoucher.belongsTo(UserVoucher, {
    foreignKey: 'userVoucherId'
});

PartnerTypeVoucher.hasMany(GiftCard, {
    foreignKey: 'partnerTypeId'
});

GiftCard.belongsTo(PartnerTypeVoucher, {
    foreignKey: 'partnerTypeId'
});

User.belongsToMany(GiftCard, {
    through: UserGiftCard,
    foreignKey: 'userId',
    otherKey: 'giftCardId'
});

GiftCard.belongsToMany(User, {
    through: UserGiftCard,
    foreignKey: 'giftCardId',
    otherKey: 'userId'
});

UserGiftCard.hasOne(DetailUserGiftCard, {
    foreignKey: 'userGiftCardId'
});

DetailUserGiftCard.belongsTo(UserGiftCard, {
    foreignKey: 'userGiftCardId'
});

module.exports = {
    User,
    Voucher,
    Partner,
    UserVoucher,
    Var,
    Condition,
    Payment,
    DetailUserVoucher,
    GiftCard,
    UserGiftCard,
    DetailUserGiftCard,
    PartnerTypeVoucher,
    TypeVoucher,
    sequelize
};