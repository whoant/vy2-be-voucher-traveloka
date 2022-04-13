const { Sequelize } = require('sequelize');
const { DB_URI } = require('../config');

const UserModel = require('./user.model');
const VoucherModel = require('./voucher.model');
const PartnerModel = require('./partner.model');
const UserVoucherModel = require('./userVoucher.model');
const VarModel = require('./var.model');
const DetailUserVoucherModel = require('./detailUserVoucher.model');
const ConditionModel = require('./condition.model');

const sequelize = new Sequelize(DB_URI);

const User = UserModel(sequelize);
const Voucher = VoucherModel(sequelize);
const Partner = PartnerModel(sequelize);
const UserVoucher = UserVoucherModel(sequelize);
const Condition = ConditionModel(sequelize);
const DetailUserVoucher = DetailUserVoucherModel(sequelize);
const Var = VarModel(sequelize);


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
});

Voucher.belongsToMany(User, {
    through: UserVoucher,
});

UserVoucher.hasMany(DetailUserVoucher, {
    foreignKey: 'userVoucherId'
});

DetailUserVoucher.belongsTo(UserVoucher, {
    foreignKey: 'userVoucherId'
});

module.exports = {
    User,
    Voucher,
    Partner,
    UserVoucher,
    DetailUserVoucher,
    Var,
    Condition,
    sequelize
};