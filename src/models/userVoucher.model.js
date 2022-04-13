const { Sequelize, DataTypes } = require('sequelize');
const UserModel = require('./user.model');
const VoucherModel = require('./voucher.model');

module.exports = (sequelize) => {
    return sequelize.define('UserVoucher', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        state: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        effectiveAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        userId: {
            type: DataTypes.UUID,
            references: {
                model: UserModel,
                key: 'id'
            }
        },
        voucherId: {
            type: DataTypes.UUID,
            references: {
                model: VoucherModel,
                key: 'id'
            }
        }

    });
};