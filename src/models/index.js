const { Sequelize } = require('sequelize');
const { DB_URI } = require('../config');

const UserModel = require('./user.model');
const VoucherModel = require('./voucher.model');
const PartnerModel = require('./partner.model');
const UserVoucherModel = require('./userVoucher.model');
const VarModel = require('./var.model');
const ConditionModel = require('./condition.model');
const PaymentModel = require('./payment.model');

const sequelize = new Sequelize(DB_URI);

const User = UserModel(sequelize);
const Voucher = VoucherModel(sequelize);
const Partner = PartnerModel(sequelize);
const UserVoucher = UserVoucherModel(sequelize);
const Condition = ConditionModel(sequelize);
const Var = VarModel(sequelize);
const Payment = PaymentModel(sequelize);


Partner.hasMany(Voucher, {
    foreignKey: 'partnerId'
});

Voucher.belongsTo(Partner, {
    foreignKey: 'partnerId'
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

module.exports = {
    User,
    Voucher,
    Partner,
    UserVoucher,
    Var,
    Condition,
    Payment,
    sequelize
};